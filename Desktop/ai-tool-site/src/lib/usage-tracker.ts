const USAGE_PREFIX = "voiceover-usage-";
const BONUS_KEY = "voiceover-bonus-credits";

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getDailyUsage(): number {
  if (!isClient()) return 0;
  const raw = localStorage.getItem(USAGE_PREFIX + todayKey());
  return raw ? parseInt(raw, 10) : 0;
}

export function incrementUsage(): void {
  if (!isClient()) return;
  const key = USAGE_PREFIX + todayKey();
  const current = getDailyUsage();
  localStorage.setItem(key, String(current + 1));
}

export function getBonusCredits(): number {
  if (!isClient()) return 0;
  const raw = localStorage.getItem(BONUS_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

export function addShareBonus(): void {
  if (!isClient()) return;
  const current = getBonusCredits();
  const cap = 30;
  const added = Math.min(3, cap - current);
  if (added > 0) {
    localStorage.setItem(BONUS_KEY, String(current + added));
  }
}

export function getTotalAvailable(): number {
  const base = 3; // freeQuota.dailyTtsCount
  return base;
}

export function getRemainingToday(): number {
  return getTotalAvailable() - getDailyUsage();
}

export function canGenerate(isPro = false): boolean {
  // Paid members are not rate-limited by the daily free counter.
  if (isPro) return true;
  return getRemainingToday() > 0;
}

export function getTodayUsed(): number {
  return getDailyUsage();
}