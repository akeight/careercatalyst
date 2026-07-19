type LogPayload = Record<string, unknown>;

export function researchLog(event: string, payload: LogPayload = {}): void {
  console.info(
    JSON.stringify({
      scope: "interview-prep",
      event,
      ts: new Date().toISOString(),
      ...payload,
    }),
  );
}
