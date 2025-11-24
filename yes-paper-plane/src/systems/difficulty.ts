export function difficultyAt(seconds: number) {
  // Early gentle, then ramps. Clamp spawn to avoid impossible starts.
  const speed = 150 + Math.min(250, seconds * 4.5);
  const spawnMs = Math.max(800, 1800 - seconds * 12);
  return { speed, spawnMs };
}












