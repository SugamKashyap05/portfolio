let instance: unknown = null;

export function registerSmoothScroll(next: unknown | null) {
  instance = next;
}

export function peekSmoothScroll() {
  return instance;
}
