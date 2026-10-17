export type SpokenLanguage = 'ar' | 'de' | 'en';
// Whisper verbose_json returns language names. Never guess German/English from names.
export function spokenLanguage(value: unknown): SpokenLanguage | null {
  if (typeof value !== 'string') return null;
  const name = value.toLowerCase().trim();
  if (name === 'arabic' || name === 'ar') return 'ar';
  if (name === 'german' || name === 'de') return 'de';
  if (name === 'english' || name === 'en') return 'en';
  return null;
}
export function voiceLocale(language: SpokenLanguage): string {
  return {ar:'ar',de:'de-DE',en:'en-GB'}[language];
}
