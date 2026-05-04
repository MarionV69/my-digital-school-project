type RatingDistributionBarProps = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export default function RatingDistributionBar({
  average,
  count,
  distribution,
}: RatingDistributionBarProps) {
  const total = Math.max(count, 1);

  return (
    <div className="flex gap-4 rounded-lg bg-muted p-4">
      {/* Global rating */}
      <div className="flex flex-col items-center justify-center gap-1 pr-4 border-r border-border">
        <span className="text-4xl font-semibold text-foreground">
          {average}
        </span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              width={14}
              height={14}
              viewBox="0 0 20 20"
              fill={star <= Math.round(average) ? "#f59e0b" : "none"}
              stroke={star <= Math.round(average) ? "#f59e0b" : "#d1d5db"}
              strokeWidth={1.5}
            >
              <path d="M10 1l2.39 4.84 5.34.78-3.86 3.76.91 5.31L10 13.27l-4.78 2.52.91-5.31L2.27 6.62l5.34-.78z" />
            </svg>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{count} avis</span>
      </div>

      {/* Distribution bars */}
      <div className="flex flex-1 flex-col justify-center gap-1">
        {([5, 4, 3, 2, 1] as const).map((star) => (
          <div key={star} className="flex items-center gap-2">
            <span className="w-2 text-right text-xs text-muted-foreground">
              {star}
            </span>
            <div className="h-1.5 flex-1 rounded-full bg-muted-foreground/20">
              <div
                className="h-1.5 rounded-full bg-yellow-400 transition-all"
                style={{ width: `${(distribution[star] / total) * 100}%` }}
              />
            </div>
            <span className="w-4 text-right text-xs text-muted-foreground">
              {distribution[star]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
