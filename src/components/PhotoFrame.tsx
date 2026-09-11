type PhotoFrameProps = {
  /** Exact photo brief for the CEA volunteer photographer. */
  brief: string;
  /** Tailwind aspect utility, e.g. "aspect-[16/9]". */
  aspect?: string;
  className?: string;
  /** Hide the caption but keep it available to assistive tech. */
  captionHidden?: boolean;
};

/**
 * Placeholder for authentic, high-quality CEA photography.
 *
 * No stock imagery is used anywhere on this site. Each frame carries the brief
 * for the local photo we still need to shoot — real riders, real Bidwell Park
 * trails, real community events — and reserves its exact space up front so the
 * final image drops in with zero layout shift.
 */
export default function PhotoFrame({
  brief,
  aspect = "aspect-[4/3]",
  className = "",
  captionHidden = false,
}: PhotoFrameProps) {
  const caption = captionHidden ? (
    <span className="sr-only">Photo to be captured: {brief}</span>
  ) : (
    <p className="text-[0.6875rem] leading-snug text-forest-700/85">
      <span className="font-semibold tracking-wide uppercase">Photo needed:</span>{" "}
      {brief}
    </p>
  );

  return (
    <figure className={`photo-frame ${aspect} ${className}`} role="img" aria-label={brief}>
      <figcaption className="w-full">
        <span
          aria-hidden="true"
          className="mb-1 inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-forest-700 uppercase"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 19V6.5A1.5 1.5 0 0 1 5.5 5h2.2l1.1-1.6A1 1 0 0 1 9.6 3h4.8a1 1 0 0 1 .8.4L16.3 5h2.2A1.5 1.5 0 0 1 20 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="12" cy="12.5" r="3.4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Local photo
        </span>
        {caption}
      </figcaption>
    </figure>
  );
}
