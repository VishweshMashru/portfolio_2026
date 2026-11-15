import type { CSSProperties } from "react";

export type IconName =
  | "arrow"
  | "mail"
  | "phone"
  | "chat"
  | "code"
  | "chip"
  | "gear"
  | "pen"
  | "language"
  | "pin"
  | "briefcase"
  | "sun"
  | "moon"
  | "search"
  | "close"
  | "person";
const paths: Record<IconName, React.ReactNode> = {
  arrow: (
    <>
      <path d="M7 17 17 7M7 7h10v10" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  phone: (
    <path d="m7 3 3 5-3 3a15 15 0 0 0 6 6l3-3 5 3c0 3-2 4-4 4C9 21 3 15 3 7c0-2 1-4 4-4Z" />
  ),
  chat: (
    <>
      <path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5A9 9 0 1 1 21 11.5Z" />
      <path d="M8 10h8M8 14h5" />
    </>
  ),
  code: (
    <>
      <path d="m7 6-5 6 5 6m10-12 5 6-5 6m-3-15-4 18" />
    </>
  ),
  chip: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="3" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" />
    </>
  ),
  gear: (
    <>
      <path
        d="m10 3 1-1h2l1 1 .5 2 2 .9 2-.5 1.5 2.6-.9 1.6.2 2.3L21 13v3l-2 1-1 1.8.2 2.2-2.5 1.2-1.8-1.3h-2L10 22l-2.5-1.2.2-2.2-1-1.8L5 16v-3l1.2-1.1.2-2.3-.9-1.6L7 5.4l2 .5Z"
        transform="translate(-1 -1) scale(.95)"
      />
      <circle cx="12" cy="12" r="3.5" />
    </>
  ),
  pen: (
    <>
      <path d="m14 4 6 6-10 10-7 1 1-7L14 4Zm-9 10 5 5M14 4l3-3 6 6-3 3" />
    </>
  ),
  language: (
    <>
      <path d="M3 5h12M9 2v3m-4 4c1 4 4 7 8 8m-1-12c0 6-4 11-10 14m12 3 5-13 5 13m-8-4h6" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V3h8v4M3 12c5 3 13 3 18 0M10 13h4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
    </>
  ),
  moon: <path d="M21 13a9 9 0 0 1-10-10A9 9 0 1 0 21 13Z" />,
  search: (
    <>
      <circle cx="10" cy="10" r="6.5" />
      <path d="m15 15 6 6" />
    </>
  ),
  close: <path d="m5 5 14 14M19 5 5 19" />,
  person: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 22v-3a8 8 0 0 1 16 0v3" />
    </>
  ),
};
export default function Icon({
  name,
  className,
  style,
}: {
  name: IconName;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
