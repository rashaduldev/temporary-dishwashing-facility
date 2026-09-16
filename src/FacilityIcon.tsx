export function FacilityIcon({ kind }: { kind: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "kitchen" ? (
        <>
          <path d="M5 26V14h22v12M3 26h26M7 14V9h18v5M10 4v5m6-5v5m6-5v5M8 19h5v7m5-7h6" />
          <path d="M19 22h4" />
        </>
      ) : kind === "cold" ? (
        <>
          <path d="M16 3v26M5 9l22 14M5 23 27 9M12 5l4 4 4-4m-8 22 4-4 4 4M5 14l5-2-1-5m14 18-1-5 5-2M5 18l5 2-1 5m14-18-1 5 5 2" />
        </>
      ) : kind === "living" ? (
        <>
          <path d="M5 27V5m22 22V16H5m0 7h22M9 16v-6h7v6m0-4h7a4 4 0 0 1 4 4" />
        </>
      ) : kind === "phone" ? (
        <path d="m11 4-6 2c-2 8 13 23 21 21l2-6-7-4-3 3a19 19 0 0 1-7-7l3-3-3-6Z" />
      ) : kind === "pin" ? (
        <>
          <path d="M26 13c0 8-10 16-10 16S6 21 6 13a10 10 0 0 1 20 0Z" />
          <circle cx="16" cy="13" r="3.5" />
        </>
      ) : kind === "truck" ? (
        <>
          <path d="M3 7h17v17H3V7Zm17 6h5l4 6v5h-9M23 13v6h6" />
          <circle cx="9" cy="25" r="3" />
          <circle cx="24" cy="25" r="3" />
        </>
      ) : (
        <>
          <path d="M7 28V10a7 7 0 0 1 14 0M17 10h9v4h-9zM18 19v2m6-2v2m-3 4v2M4 28h7" />
        </>
      )}
    </svg>
  );
}
