import { useId, useState } from "react";
import { Pause, Play } from "lucide-react";

const waveform = [18, 44, 29, 64, 38, 76, 54, 28, 69, 48, 82, 35, 61, 25, 52, 72, 31, 58, 42, 68];

export function AudioPreview({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const id = useId();

  return (
    <div className={`audio-preview ${compact ? "audio-preview--compact" : ""}`}>
      <button
        type="button"
        aria-label={`${playing ? "Pausar" : "Escuchar"} ${label}`}
        aria-pressed={playing}
        onClick={() => setPlaying((value) => !value)}
      >
        {playing ? <Pause size={17} /> : <Play size={17} />}
      </button>
      <div className={`waveform ${playing ? "is-playing" : ""}`} aria-hidden="true">
        {waveform.map((height, index) => (
          <i
            key={`${id}-${index}`}
            style={{ height: `${compact ? Math.max(height / 2, 7) : height}%` }}
          />
        ))}
      </div>
      <time>{playing ? "0:12" : "0:00"}</time>
    </div>
  );
}

