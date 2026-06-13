export function CoverArt({
  seed,
  label,
}: {
  seed: number;
  label: string;
}) {
  return (
    <div className={`cover-art cover-art--${(seed % 5) + 1}`} role="img" aria-label={`Portada de ${label}`}>
      <span />
      <i />
      <b>SSR</b>
    </div>
  );
}

