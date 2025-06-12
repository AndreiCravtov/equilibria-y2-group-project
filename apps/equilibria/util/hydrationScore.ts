export interface DrinkEvent {
  timestamp: Date | number;
  volumeMl: number;
}

export interface ScoreConfig {
  referenceServingMl?: number; // default 250 mL
  capVolumeMl?: number;        // default 400 mL
  muHours?: number;            // default 2 h
  sigmaHours?: number;         // default 1 h
}

function gaussian(dtSec: number, muSec: number, sigmaSec: number): number {
  return Math.exp(-((dtSec - muSec) ** 2) / (2 * sigmaSec ** 2));
}

export function computeDailyScore(
  events: DrinkEvent[],
  dailyGoalMl: number,
  cfg: ScoreConfig = {}
): number {
  const {
    referenceServingMl = 250,
    capVolumeMl = 400,
    muHours = 2,
    sigmaHours = 1,
  } = cfg;

  const MU = muHours * 3600;
  const SIG = sigmaHours * 3600;
  const P_OPT = 100 * referenceServingMl / dailyGoalMl;

  const sorted = [...events].sort(
    (a, b) =>
      (a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp) -
      (b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp)
  );

  let score = 0;
  let lastTs: number | null = null;

  for (const { timestamp, volumeMl } of sorted) {
    const ts = timestamp instanceof Date ? timestamp.getTime() : timestamp;
    const dtSec = lastTs === null ? MU : (ts - lastTs) / 1000;
    const fTime = gaussian(dtSec, MU, SIG);
    const fVol = Math.min(volumeMl, capVolumeMl) / referenceServingMl;

    score = Math.min(score + P_OPT * fVol * fTime, 100);
    lastTs = ts;
  }

  return Math.round(score * 100) / 100;
}
