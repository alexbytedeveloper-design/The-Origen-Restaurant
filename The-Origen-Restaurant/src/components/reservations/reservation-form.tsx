"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRightIcon, CheckIcon, ClockIcon, CopyIcon, WhatsAppIcon } from "@/components/ui/icons";
import { RESTAURANT } from "@/content/restaurant";
import { reservationSchema } from "@/domain/reservations/reservation.schema";
import { RESERVATION_ZONES, type ReservationResult, type ReservationZone } from "@/domain/reservations/reservation.types";
import { ServiceSchedule, type OpeningDay } from "@/domain/reservations/service-schedule";
import { addDaysIso, formatLongDate } from "@/lib/format/date";
import { localePath, type Locale } from "@/lib/i18n/config";
import { interpolate } from "@/lib/i18n/interpolate";
import { buildWhatsAppUrl, DIRECT_WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import type { Dictionary } from "@/content/dictionaries";

interface ReservationFormProps {
  readonly locale: Locale;
  readonly copy: Dictionary["reservation"];
  readonly common: Dictionary["common"];
  readonly today: string;
  readonly maxDate: string;
  readonly serviceDays: readonly OpeningDay[];
  readonly stepMinutes: number;
  readonly whatsappNumber: string;
}

interface FormValues {
  readonly name: string;
  readonly contact: string;
  readonly partySize: string;
  readonly date: string;
  readonly time: string;
  readonly zone: ReservationZone;
  readonly notes: string;
}

type SubmitStatus = "idle" | "submitting" | "success";

type ApiEnvelope =
  | { readonly ok: true; readonly data: ReservationResult }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: string;
        readonly message: string;
        readonly fields?: Readonly<Record<string, string>>;
      };
    };

const findFirstOpenDate = (
  today: string,
  schedule: ServiceSchedule,
  maxDate: string,
): string => {
  for (let offset = 0; offset <= 14; offset += 1) {
    const candidate = addDaysIso(today, offset);
    if (candidate > maxDate) break;
    if (schedule.isOpen(candidate)) return candidate;
  }
  return today;
};

interface FieldShellProps {
  readonly id: string;
  readonly label: string;
  readonly error?: string;
  readonly hint?: ReactNode;
  readonly required?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

function FieldShell({ id, label, error, hint, required, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? (
          <span aria-hidden className="ml-1 text-gold">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ReservationForm({
  locale,
  copy,
  common,
  today,
  maxDate,
  serviceDays,
  stepMinutes,
  whatsappNumber,
}: ReservationFormProps) {
  const schedule = useMemo(
    () => new ServiceSchedule(serviceDays, stepMinutes),
    [serviceDays, stepMinutes],
  );

  const initialDate = useMemo(
    () => findFirstOpenDate(today, schedule, maxDate),
    [today, schedule, maxDate],
  );

  const [values, setValues] = useState<FormValues>(() => ({
    name: "",
    contact: "",
    partySize: "2",
    date: initialDate,
    time: schedule.slotsFor(initialDate)[0] ?? "",
    zone: "any",
    notes: "",
  }));
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [result, setResult] = useState<ReservationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const copyTimer = useRef<number | null>(null);

  const slots = schedule.slotsFor(values.date);
  const isClosed = slots.length === 0;

  const validationMessages = copy.validation as unknown as Record<string, string>;

  const fieldError = (field: string): string | undefined => {
    const code = fieldErrors[field];
    return code ? (validationMessages[code] ?? copy.validation.generic) : undefined;
  };

  const describedBy = (
    elementId: string,
    field: string,
    hasHint = false,
  ): string | undefined => {
    const ids = [
      hasHint ? `${elementId}-hint` : null,
      fieldErrors[field] ? `${elementId}-error` : null,
    ].filter(Boolean);
    return ids.length > 0 ? ids.join(" ") : undefined;
  };

  const update = <Key extends keyof FormValues>(key: Key, value: FormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleDateChange = (date: string) => {
    const nextSlots = schedule.slotsFor(date);
    setValues((current) => ({
      ...current,
      date,
      time: nextSlots.includes(current.time) ? current.time : (nextSlots[0] ?? ""),
    }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next.date;
      delete next.time;
      return next;
    });
  };

  useEffect(() => {
    if (status !== "success") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    successRef.current?.focus({ preventScroll: true });
    successRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  }, [status]);

  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  const resetForm = () => {
    const nextDate = findFirstOpenDate(today, schedule, maxDate);
    setValues({
      name: "",
      contact: "",
      partySize: "2",
      date: nextDate,
      time: schedule.slotsFor(nextDate)[0] ?? "",
      zone: "any",
      notes: "",
    });
    setHoneypot("");
    setFieldErrors({});
    setGeneralError("");
    setResult(null);
    setCopied(false);
    setStatus("idle");
    requestAnimationFrame(() => document.getElementById("reservation-name")?.focus());
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const candidate = {
      name: values.name,
      contact: values.contact,
      partySize: values.partySize,
      date: values.date,
      time: values.time,
      zone: values.zone,
      notes: values.notes,
      locale,
      website: honeypot,
    };

    const parsed = reservationSchema.safeParse(candidate);
    const errors: Record<string, string> = {};

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && key !== "website" && !errors[key]) {
          errors[key] = issue.message;
        }
      }
    }

    if (values.date < today) {
      errors.date = "date_past";
    } else if (values.date > maxDate) {
      errors.date = "date_too_far";
    } else if (isClosed) {
      errors.date = "date_closed";
    }

    if (!isClosed && !slots.includes(values.time)) {
      errors.time = "time_unavailable";
    }

    if (!parsed.success || Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setGeneralError(copy.validation.generic);
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setStatus("submitting");
    setGeneralError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const payload = (await response.json()) as ApiEnvelope;

      if (!response.ok || !payload.ok) {
        if (!payload.ok) {
          if (payload.error.fields) setFieldErrors(payload.error.fields);
          setGeneralError(
            payload.error.code === "RATE_LIMITED"
              ? copy.errors.rateLimited
              : payload.error.code === "FORBIDDEN"
                ? copy.errors.forbidden
                : copy.errors.generic,
          );
        } else {
          setGeneralError(copy.errors.generic);
        }
        setStatus("idle");
        return;
      }

      setResult(payload.data);
      setStatus("success");
    } catch {
      setGeneralError(copy.errors.network);
      setStatus("idle");
    }
  };

  const copyMessage = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.message);
      setCopied(true);
    } catch {
      const area = document.createElement("textarea");
      area.value = result.message;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      setCopied(true);
    }
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  const directWhatsAppUrl = buildWhatsAppUrl(
    whatsappNumber,
    DIRECT_WHATSAPP_MESSAGES[locale],
  );

  const openDay = RESTAURANT.serviceDays.find((day) => !day.closed);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
      <div>
        {result ? (
          <section
            aria-live="polite"
            className="card-soft p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckIcon />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                  {copy.success.reference}
                </p>
                <p className="font-display text-3xl leading-none text-gold-soft">
                  {result.reference}
                </p>
              </div>
            </div>

            <h2
              ref={successRef}
              tabIndex={-1}
              className="display-2 mt-6 outline-none"
            >
              {copy.success.title}
            </h2>
            <p className="lead mt-3">{copy.success.lead}</p>

            <dl className="mt-6 grid gap-4 rounded-xl border border-border/60 bg-surface/50 p-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  {copy.form.name}
                </dt>
                <dd className="mt-1 text-sm">{result.summary.guestName}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  {copy.form.date}
                </dt>
                <dd className="mt-1 text-sm capitalize">
                  {formatLongDate(result.summary.date, locale)}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  {copy.form.time}
                </dt>
                <dd className="mt-1 text-sm">{result.summary.time}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  {copy.form.partySize}
                </dt>
                <dd className="mt-1 text-sm">
                  {result.summary.partySize === 1
                    ? copy.form.guest
                    : interpolate(copy.form.guests, { count: result.summary.partySize })}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  {copy.form.zone}
                </dt>
                <dd className="mt-1 text-sm">{copy.zones[result.summary.zone]}</dd>
              </div>
            </dl>

            <a
              href={result.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-6 w-full"
            >
              <WhatsAppIcon />
              {copy.success.whatsappCta}
            </a>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={copyMessage} className="btn btn-secondary flex-1">
                <CopyIcon />
                {copied ? copy.success.copied : copy.success.copyMessage}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-ghost">
                {copy.success.newRequest}
              </button>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              {copy.success.pendingNote}
            </p>

            <Link href={localePath(locale, "/gracias")} className="link-arrow mt-5">
              {copy.success.nextSteps}
              <ArrowRightIcon />
            </Link>
          </section>
        ) : (
          <div ref={formRef} className="card-soft p-5 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FieldShell
                  id="reservation-name"
                  label={copy.form.name}
                  required
                  error={fieldError("name")}
                >
                  <input
                    id="reservation-name"
                    name="name"
                    type="text"
                    value={values.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder={copy.form.namePlaceholder}
                    autoComplete="name"
                    maxLength={80}
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={describedBy("reservation-name", "name")}
                    className="field-input"
                  />
                </FieldShell>

                <FieldShell
                  id="reservation-contact"
                  label={copy.form.contact}
                  required
                  hint={copy.form.contactHint}
                  error={fieldError("contact")}
                >
                  <input
                    id="reservation-contact"
                    name="contact"
                    type="tel"
                    inputMode="tel"
                    value={values.contact}
                    onChange={(event) => update("contact", event.target.value)}
                    placeholder={copy.form.contactPlaceholder}
                    autoComplete="tel"
                    maxLength={25}
                    aria-invalid={Boolean(fieldErrors.contact)}
                    aria-describedby={describedBy("reservation-contact", "contact", true)}
                    className="field-input"
                  />
                </FieldShell>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FieldShell
                  id="reservation-party"
                  label={copy.form.partySize}
                  required
                  error={fieldError("partySize")}
                >
                  <select
                    id="reservation-party"
                    name="partySize"
                    value={values.partySize}
                    onChange={(event) => update("partySize", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.partySize)}
                    aria-describedby={describedBy("reservation-party", "partySize")}
                    className="field-input"
                  >
                    {Array.from({ length: RESTAURANT.reservation.maxPartySize }, (_, index) => index + 1).map(
                      (count) => (
                        <option key={count} value={count}>
                          {count === 1
                            ? copy.form.guest
                            : interpolate(copy.form.guests, { count })}
                        </option>
                      ),
                    )}
                  </select>
                </FieldShell>

                <FieldShell
                  id="reservation-zone"
                  label={copy.form.zone}
                  error={fieldError("zone")}
                >
                  <select
                    id="reservation-zone"
                    name="zone"
                    value={values.zone}
                    onChange={(event) => update("zone", event.target.value as ReservationZone)}
                    aria-invalid={Boolean(fieldErrors.zone)}
                    aria-describedby={describedBy("reservation-zone", "zone")}
                    className="field-input"
                  >
                    {RESERVATION_ZONES.map((zone) => (
                      <option key={zone} value={zone}>
                        {copy.zones[zone]}
                      </option>
                    ))}
                  </select>
                </FieldShell>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FieldShell
                  id="reservation-date"
                  label={copy.form.date}
                  required
                  hint={<span className="capitalize">{formatLongDate(values.date, locale)}</span>}
                  error={fieldError("date")}
                >
                  <input
                    id="reservation-date"
                    name="date"
                    type="date"
                    min={today}
                    max={maxDate}
                    value={values.date}
                    onChange={(event) => handleDateChange(event.target.value)}
                    aria-invalid={Boolean(fieldErrors.date)}
                    aria-describedby={describedBy("reservation-date", "date", true)}
                    className="field-input"
                  />
                </FieldShell>

                <FieldShell
                  id="reservation-time"
                  label={copy.form.time}
                  required
                  hint={copy.form.timeHint}
                  error={fieldError("time")}
                >
                  <select
                    id="reservation-time"
                    name="time"
                    value={values.time}
                    onChange={(event) => update("time", event.target.value)}
                    disabled={isClosed}
                    aria-invalid={Boolean(fieldErrors.time)}
                    aria-describedby={describedBy("reservation-time", "time", true)}
                    className="field-input"
                  >
                    {isClosed ? (
                      <option value="">{copy.form.closedDay}</option>
                    ) : (
                      slots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))
                    )}
                  </select>
                </FieldShell>
              </div>

              <FieldShell
                id="reservation-notes"
                label={`${copy.form.notes} · ${common.optional}`}
                hint={`${values.notes.length}/400`}
                error={fieldError("notes")}
              >
                <textarea
                  id="reservation-notes"
                  name="notes"
                  rows={3}
                  value={values.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  placeholder={copy.form.notesPlaceholder}
                  maxLength={400}
                  aria-invalid={Boolean(fieldErrors.notes)}
                  aria-describedby={describedBy("reservation-notes", "notes", true)}
                  className="field-input resize-y"
                />
              </FieldShell>

              <div
                aria-hidden
                className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
              >
                <label htmlFor="reservation-website">Website</label>
                <input
                  id="reservation-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>

              {generalError ? (
                <p
                  role="alert"
                  className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
                >
                  {generalError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                aria-busy={status === "submitting"}
                className="btn btn-primary w-full"
              >
                {status === "submitting" ? copy.form.submitting : copy.form.submit}
                {status === "submitting" ? null : <ArrowRightIcon />}
              </button>

              <p className="text-center text-xs leading-relaxed text-muted">
                {copy.form.consent}
              </p>
            </form>
          </div>
        )}
      </div>

      <aside className="space-y-5">
        <div className="card-soft p-6">
          <h2 className="font-display text-2xl">{copy.aside.title}</h2>
          <ol className="mt-5 space-y-4">
            {copy.aside.steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/40 text-[10px] font-bold text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-gold/25 bg-gold/5 p-6">
          <h3 className="font-display text-xl">{copy.aside.directTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{copy.aside.directText}</p>
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary mt-4 w-full"
          >
            <WhatsAppIcon />
            {copy.aside.directCta}
          </a>
        </div>

        <div className="rounded-2xl border border-border/60 p-6">
          <h3 className="flex items-center gap-2 font-display text-xl">
            <ClockIcon className="text-gold" />
            {copy.aside.hoursTitle}
          </h3>
          <p className="mt-2 text-sm text-text">
            {openDay && !openDay.closed
              ? `${openDay.opens} – ${openDay.lastSeating}`
              : null}
          </p>
          <p className="mt-1 text-sm text-muted">{copy.aside.hoursNote}</p>
        </div>
      </aside>
    </div>
  );
}
