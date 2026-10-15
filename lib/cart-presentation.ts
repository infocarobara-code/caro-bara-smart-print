import type { Language } from "@/lib/i18n";

type Option = { value: string; label: Partial<Record<Language, string>> };
const normalize = (value: string) => value.trim().normalize("NFKC").replace(/\s+/g, " ").toLowerCase();

/** Exact known option matches only. Unknown values and customer text stay intact. */
export function translateCartOption(options: Option[], value: string, language: Language, multiple = false): string {
  const choices = options.flatMap(option => [option.value, ...Object.values(option.label)]
    .filter((text): text is string => typeof text === "string" && !!text.trim())
    .map(text => ({ text, option })))
    .sort((a, b) => b.text.length - a.text.length);
  const label = (option: Option) => option.label[language] || option.value;
  const exact = choices.find(choice => normalize(choice.text) === normalize(value));
  if (exact) return label(exact.option);
  if (!multiple) return value;

  // Longest matching label first also supports legacy labels containing commas.
  let remaining = value.trim();
  const translated: string[] = [];
  while (remaining) {
    const choice = choices.find(({ text }) => {
      const head = remaining.slice(0, text.length);
      return normalize(head) === normalize(text) &&
        (remaining.length === text.length || /^[\s]*[,،]/.test(remaining.slice(text.length)));
    });
    if (choice) {
      translated.push(label(choice.option));
      remaining = remaining.slice(choice.text.length).replace(/^[\s,،]+/, "");
    } else {
      const separator = remaining.search(/[,،]/);
      if (separator < 0) { translated.push(remaining); break; }
      translated.push(remaining.slice(0, separator).trim());
      remaining = remaining.slice(separator + 1).trim();
    }
  }
  return translated.join(", ");
}
