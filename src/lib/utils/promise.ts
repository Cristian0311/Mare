/**
 * Envuelve una promesa con un tiempo límite de ejecución.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallbackValue: T
): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutHandle = setTimeout(() => {
      console.warn(`Promise timed out after ${timeoutMs}ms. Using fallback.`);
      resolve(fallbackValue);
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    // @ts-ignore
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

/**
 * Intenta ejecutar una promesa, si falla o tarda demasiado, devuelve el fallback.
 */
export async function safeFetch<T>(
  fetcher: () => Promise<T>,
  fallbackValue: T,
  timeoutMs = 5000
): Promise<T> {
  try {
    return await withTimeout(fetcher(), timeoutMs, fallbackValue);
  } catch (error) {
    console.error('safeFetch error:', error);
    return fallbackValue;
  }
}
