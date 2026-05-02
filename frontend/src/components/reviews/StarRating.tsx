type StarRatingProps =
  | { interactive?: false; value: number; size?: "sm" | "md" | "lg" }
  | {
      interactive: true;
      value: number;
      onChange: (value: number) => void;
      size?: "sm" | "md" | "lg";
    };

const SIZES = { sm: 14, md: 18, lg: 22 };

export default function StarRating(props: StarRatingProps) {
  const { value, interactive = false, size = "md" } = props;
  const px = SIZES[size];

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() =>
            interactive && "onChange" in props && props.onChange(star)
          }
          className={
            interactive
              ? "cursor-pointer"
              : "cursor-default pointer-events-none"
          }
          aria-label={
            interactive ? `${star} étoile${star > 1 ? "s" : ""}` : undefined
          }
        >
          <svg
            width={px}
            height={px}
            viewBox="0 0 20 20"
            fill={star <= value ? "#f59e0b" : "none"}
            stroke={star <= value ? "#f59e0b" : "#d1d5db"}
            strokeWidth={1.5}
          >
            <path d="M10 1l2.39 4.84 5.34.78-3.86 3.76.91 5.31L10 13.27l-4.78 2.52.91-5.31L2.27 6.62l5.34-.78z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
