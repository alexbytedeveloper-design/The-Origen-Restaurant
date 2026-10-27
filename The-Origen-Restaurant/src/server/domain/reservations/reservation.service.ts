import { RESTAURANT } from "@/content/restaurant";
import type { ReservationInput } from "@/domain/reservations/reservation.schema";
import type { ReservationResult } from "@/domain/reservations/reservation.types";
import type { ServiceSchedule } from "@/domain/reservations/service-schedule";
import { AppError } from "@/server/core/app-error";
import type { StructuredLogger } from "@/server/core/logger";
import type { RequestContext } from "@/server/http/request-context";
import type { RateLimiter } from "@/server/infrastructure/rate-limit/rate-limiter";
import { RATE_LIMITS } from "@/server/infrastructure/rate-limit/rate-limit.registry";
import type { HmacHasher } from "@/server/infrastructure/hashing/hmac-hasher";
import type { HavanaClock } from "./havana-clock";
import type { ReferenceFactory } from "./reference.factory";
import type { WhatsAppLinkFactory } from "./whatsapp-link.factory";
import type { WhatsAppMessageBuilder } from "./whatsapp-message.builder";

export interface ReservationServiceDependencies {
  readonly clock: HavanaClock;
  readonly schedule: ServiceSchedule;
  readonly rateLimiter: RateLimiter;
  readonly hasher: HmacHasher;
  readonly references: ReferenceFactory;
  readonly messages: WhatsAppMessageBuilder;
  readonly whatsapp: WhatsAppLinkFactory;
  readonly logger: StructuredLogger;
}

export class ReservationService {
  public constructor(private readonly dependencies: ReservationServiceDependencies) {}

  public submit(payload: ReservationInput, context: RequestContext): ReservationResult {
    context.assertSameOrigin();

    if (payload.website && payload.website.trim().length > 0) {
      this.dependencies.logger.warn("reservation.spam_blocked", {
        ipHash: this.dependencies.hasher.hash(context.ip).slice(0, 16),
        userAgentFamily: context.userAgentFamily,
      });
      return this.buildSpamResult(payload);
    }

    this.assertCalendar(payload);

    const ipHash = this.dependencies.hasher.hash(context.ip);
    const contactHash = this.dependencies.hasher.hash(
      payload.contact.replace(/\D/g, ""),
    );

    const ipDecision = this.dependencies.rateLimiter.consume(
      `reservation:ip:${ipHash}`,
      RATE_LIMITS.reservationByIp,
    );
    if (!ipDecision.allowed) {
      this.dependencies.logger.warn("reservation.rate_limited", {
        scope: "ip",
        ipHash: ipHash.slice(0, 16),
      });
      throw AppError.rateLimited(ipDecision.retryAfterSeconds);
    }

    const contactDecision = this.dependencies.rateLimiter.consume(
      `reservation:contact:${contactHash}`,
      RATE_LIMITS.reservationByContact,
    );
    if (!contactDecision.allowed) {
      this.dependencies.logger.warn("reservation.rate_limited", {
        scope: "contact",
        ipHash: ipHash.slice(0, 16),
        contactHash: contactHash.slice(0, 16),
      });
      throw AppError.rateLimited(contactDecision.retryAfterSeconds);
    }

    const reference = this.dependencies.references.create();
    const message = this.dependencies.messages.build(payload, reference);

    this.dependencies.logger.info("reservation.requested", {
      reference,
      partySize: payload.partySize,
      date: payload.date,
      time: payload.time,
      zone: payload.zone,
      locale: payload.locale,
      ipHash: ipHash.slice(0, 16),
      contactHash: contactHash.slice(0, 16),
      userAgentFamily: context.userAgentFamily,
    });

    return {
      reference,
      status: "pending",
      message,
      whatsappUrl: this.dependencies.whatsapp.create(message),
      summary: {
        guestName: payload.name,
        partySize: payload.partySize,
        date: payload.date,
        time: payload.time,
        zone: payload.zone,
      },
    };
  }

  private assertCalendar(input: ReservationInput): void {
    const today = this.dependencies.clock.today();
    const fields: Record<string, string> = {};

    if (!this.dependencies.clock.isWithinWindow(input.date, today, RESTAURANT.reservation.maxDaysAhead)) {
      fields.date = input.date < today ? "date_past" : "date_too_far";
    } else if (!this.dependencies.schedule.isOpen(input.date)) {
      fields.date = "date_closed";
    } else if (!this.dependencies.schedule.isSlotAvailable(input.date, input.time)) {
      fields.time = "time_unavailable";
    }

    if (Object.keys(fields).length > 0) {
      throw AppError.validation("The requested reservation is not available.", fields);
    }
  }

  private buildSpamResult(input: ReservationInput): ReservationResult {
    const reference = this.dependencies.references.create();
    const message =
      input.locale === "es"
        ? `Hola, The Origen. Quiero consultar disponibilidad. Referencia: ${reference}`
        : `Hello, The Origen. I would like to check availability. Reference: ${reference}`;

    return {
      reference,
      status: "pending",
      message,
      whatsappUrl: this.dependencies.whatsapp.create(message),
      summary: {
        guestName: input.name,
        partySize: input.partySize,
        date: input.date,
        time: input.time,
        zone: input.zone,
      },
    };
  }
}
