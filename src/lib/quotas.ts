import type {
  DownloadContentType,
  DownloadQuota,
  DownloadRecord,
  SubscriptionPlan,
} from "./types";

export function isInCurrentMonth(
  isoDate: string,
  now = new Date(),
): boolean {
  const date = new Date(isoDate);

  return (
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth()
  );
}

export function calculateDownloadQuota(
  plan: SubscriptionPlan | undefined,
  downloads: DownloadRecord[],
  now = new Date(),
): DownloadQuota {
  const currentDownloads = downloads.filter((download) =>
    isInCurrentMonth(download.createdAt, now),
  );
  const samplesUsed = currentDownloads.filter(
    ({ contentType }) =>
      contentType === "sample" || contentType === "sample_pack",
  ).length;
  const instrumentalsUsed = currentDownloads.filter(
    ({ contentType }) => contentType === "instrumental",
  ).length;
  const sampleLimit =
    plan === undefined ? 0 : plan.monthlySampleLimit;
  const instrumentalLimit =
    plan === undefined ? 0 : plan.monthlyInstrumentalLimit;

  return {
    sampleLimit,
    instrumentalLimit,
    samplesUsed,
    instrumentalsUsed,
    samplesRemaining:
      sampleLimit === null ? null : Math.max(sampleLimit - samplesUsed, 0),
    instrumentalsRemaining:
      instrumentalLimit === null
        ? null
        : Math.max(instrumentalLimit - instrumentalsUsed, 0),
  };
}

export function canDownload(
  contentType: DownloadContentType,
  quota: DownloadQuota,
): boolean {
  const remaining =
    contentType === "instrumental"
      ? quota.instrumentalsRemaining
      : quota.samplesRemaining;

  return remaining === null || remaining > 0;
}
