export function QuotaMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | null;
}) {
  const remaining = limit === null ? null : Math.max(limit - used, 0);
  const percentage =
    limit === null || limit === 0 || remaining === null
      ? 100
      : Math.max((remaining / limit) * 100, 0);

  return (
    <div className="quota-meter">
      <span>{label}</span>
      <strong>
        {remaining === null ? "∞" : remaining}
        <small>{limit === null ? " sin límite" : ` de ${limit}`}</small>
      </strong>
      <div className="quota-track" aria-hidden="true">
        <i style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
