import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const defaults: IconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
};

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...defaults} width={18} height={18} {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...defaults} width={18} height={18} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...defaults} width={19} height={19} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...defaults} width={19} height={19} {...props}>
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...defaults} width={22} height={22} {...props}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...defaults} width={22} height={22} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...defaults} width={18} height={18} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...defaults} width={20} height={20} {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...defaults} width={18} height={18} {...props}>
      <rect x="8" y="8" width="12" height="12" rx="2.5" />
      <path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3H5.5A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M12.04 2a9.86 9.86 0 0 0-8.46 14.92L2 22l5.2-1.55A9.86 9.86 0 1 0 12.04 2Zm0 1.8a8.06 8.06 0 1 1-4.11 15l-.3-.18-3.08.92.93-2.99-.2-.31A8.06 8.06 0 0 1 12.04 3.8Zm-3.5 4.2c-.19 0-.5.07-.76.36-.26.29-1 .97-1 2.37 0 1.4 1.02 2.75 1.16 2.94.14.19 1.96 3.13 4.83 4.27 2.38.94 2.86.75 3.38.7.52-.05 1.67-.68 1.9-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.55-.33-.29-.15-1.67-.82-1.93-.91-.26-.1-.45-.15-.64.14-.19.29-.73.91-.9 1.1-.16.19-.33.21-.62.07a7.7 7.7 0 0 1-2.26-1.4 8.5 8.5 0 0 1-1.57-1.95c-.16-.29-.02-.44.13-.58.13-.13.29-.34.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.54-.88-2.11-.23-.55-.46-.48-.64-.49h-.55Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...defaults} width={19} height={19} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.9h.01" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...defaults} width={19} height={19} {...props}>
      <path d="M14.5 8.5h2.2V5.4h-2.4c-2.2 0-3.6 1.4-3.6 3.7v1.6H8.5v3.1h2.2V21h3.2v-7.2h2.3l.5-3.1h-2.8V9.4c0-.6.2-.9.6-.9Z" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...defaults} width={18} height={18} {...props}>
      <path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...defaults} width={18} height={18} {...props}>
      <path d="M6.3 3.5h3l1.4 3.7-2 1.4a12.4 12.4 0 0 0 4.7 4.7l1.4-2 3.7 1.4v3a2 2 0 0 1-2.2 2 17 17 0 0 1-14-14 2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...defaults} width={18} height={18} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...defaults} width={20} height={20} {...props}>
      <path d="M12 21c3.6 0 6-2.3 6-5.5 0-2.5-1.5-4.3-2.8-5.8-.6-.7-1.2-1.4-1.6-2.2-.8 2.2-2 3.2-3.1 4.4-1.2 1.3-2.5 2.6-2.5 4.6C8 19 9.9 21 12 21Z" />
      <path d="M12 18c1.3 0 2.2-.9 2.2-2.1 0-1-.6-1.7-1.2-2.4-.4.8-.9 1.2-1.4 1.8-.4.5-.8 1-.8 1.6 0 1 .6 1.1 1.2 1.1Z" />
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...defaults} width={20} height={20} {...props}>
      <path d="M20 4c-8 0-14 3.5-14 10a6 6 0 0 0 6 6c6.5 0 8-7 8-16Z" />
      <path d="M4 21c1.5-4.5 4-7.5 8-9.5" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...defaults} width={20} height={20} {...props}>
      <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.7l-1.6-5.5L5 10.6 10.4 9 12 3.5Z" />
      <path d="M18.5 16.5 19.2 19l2.3.7-2.3.7-.7 2.4-.7-2.4-2.3-.7 2.3-.7.7-2.5Z" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...defaults} width={18} height={18} {...props}>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 20c0-3.2 2.4-5.5 5.5-5.5s5.5 2.3 5.5 5.5" />
      <path d="M15.5 5.7a3.2 3.2 0 0 1 0 5.6M17 14.9c2 .6 3.5 2.4 3.5 5.1" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...defaults} width={18} height={18} {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}
