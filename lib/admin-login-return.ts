// Only the explicitly supported trial destination is accepted from user input.
export function adminLoginReturn(value: unknown): string {
  return value === "/inquiry-assistant" ? "/inquiry-assistant" : "";
}
