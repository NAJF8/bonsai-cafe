export function formatIQD(amount: number, lang: "ar" | "en"): string {
  // Always use Western (Latin) digits for readability, even in Arabic —
  // standard practice for prices in Iraqi digital menus.
  const formatted = new Intl.NumberFormat("en-US").format(amount);
  return lang === "ar" ? `${formatted} د.ع` : `${formatted} IQD`;
}
