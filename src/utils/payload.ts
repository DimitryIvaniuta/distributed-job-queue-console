const encoder = new TextEncoder();

/** Returns UTF-8 payload size used to protect browser and backend from accidental huge JSON submissions. */
export function getUtf8SizeBytes(value: string): number {
  return encoder.encode(value).byteLength;
}

/** Builds a compact operator-facing size label. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}
