const KEY = "scroll-positions";

function getAll(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export const scrollStore = {
  get: (route: string): number => getAll()[route] ?? 0,
  set: (route: string, y: number) => {
    const all = getAll();
    all[route] = y;
    sessionStorage.setItem(KEY, JSON.stringify(all));
  },
};
