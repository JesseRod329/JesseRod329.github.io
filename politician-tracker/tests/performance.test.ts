import { describe, expect, it } from "vitest";
import { summarizeSnapshots } from "@/lib/performance";

const snapshots = [
  { id: "1", ticker: "AAPL", asOfDate: new Date("2024-01-01"), closePrice: 100, sourceName: "mock", createdAt: new Date() },
  { id: "2", ticker: "AAPL", asOfDate: new Date("2024-02-01"), closePrice: 120, sourceName: "mock", createdAt: new Date() }
];

describe("summarizeSnapshots", () => {
  it("returns percent change between first and last snapshot", () => {
    const result = summarizeSnapshots(snapshots as any);
    expect(result).toBeCloseTo(20);
  });

  it("returns null when no data", () => {
    expect(summarizeSnapshots([] as any)).toBeNull();
  });
});
