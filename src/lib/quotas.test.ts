import { describe, expect, it } from "vitest";
import { calculateDownloadQuota, canDownload } from "./quotas";
import { subscriptionPlans } from "./demo-data";
import type { DownloadRecord } from "./types";

const now = new Date("2026-06-13T12:00:00.000Z");

const downloads: DownloadRecord[] = [
  {
    id: "1",
    userId: "user",
    contentType: "sample_pack",
    contentId: "pack",
    title: "Pack",
    createdAt: "2026-06-01T12:00:00.000Z",
  },
  {
    id: "2",
    userId: "user",
    contentType: "sample",
    contentId: "sample",
    title: "Sample",
    createdAt: "2026-06-02T12:00:00.000Z",
  },
  {
    id: "3",
    userId: "user",
    contentType: "instrumental",
    contentId: "beat",
    title: "Beat",
    createdAt: "2026-05-02T12:00:00.000Z",
  },
];

describe("download quotas", () => {
  it("counts only the current month and groups sample packs with samples", () => {
    const quota = calculateDownloadQuota(subscriptionPlans[0], downloads, now);

    expect(quota.samplesUsed).toBe(2);
    expect(quota.samplesRemaining).toBe(8);
    expect(quota.instrumentalsUsed).toBe(0);
    expect(canDownload("instrumental", quota)).toBe(false);
  });

  it("supports unlimited Archivist quotas", () => {
    const quota = calculateDownloadQuota(subscriptionPlans[2], downloads, now);

    expect(quota.samplesRemaining).toBeNull();
    expect(quota.instrumentalsRemaining).toBeNull();
    expect(canDownload("instrumental", quota)).toBe(true);
  });
});
