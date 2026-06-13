import { useState } from "react";
import { Download, LockKeyhole } from "lucide-react";
import { useDownloads } from "../context/DownloadContext";
import type { DownloadContentType } from "../lib/types";

export function DownloadButton({
  contentType,
  contentId,
  title,
  compact = false,
}: {
  contentType: DownloadContentType;
  contentId: string;
  title: string;
  compact?: boolean;
}) {
  const { requestDownload } = useDownloads();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  async function handleDownload() {
    setWorking(true);
    const result = await requestDownload({ contentType, contentId, title });
    setFeedback(result.message);
    setWorking(false);
    window.setTimeout(() => setFeedback(null), 3600);
  }

  return (
    <div className="download-action">
      <button
        className={`button ${compact ? "button--compact" : "button--gold"}`}
        type="button"
        disabled={working}
        onClick={handleDownload}
      >
        {working ? <LockKeyhole size={15} /> : <Download size={15} />}
        {working ? "Validando" : "Descargar"}
      </button>
      {feedback ? <span className="action-feedback" role="status">{feedback}</span> : null}
    </div>
  );
}

