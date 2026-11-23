import type { BrandSettings, Category, Lang, Product } from "../types";
import { formatIQD } from "./currency";

/** Fully local, on-device "smart search" assistant — no external API, no
 *  network call, no key to protect. It answers from the data the app
 *  already has (menu + brand info), not from a language model, so replies
 *  are always accurate to what's actually on the menu. */
export function answerLocally(
  query: string,
  lang: Lang,
  products: Product[],
  categories: Category[],
  brand: BrandSettings
): string {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const q = query.trim().toLowerCase();
  if (!q) return t("اسألني عن أي مشروب أو حلى بالمنيو 🙂", "Ask me about any drink or dessert on the menu 🙂");

  const faq: Array<{ keys: string[]; answer: string }> = [
    {
      keys: ["ساعات", "دوام", "وقت العمل", "متى تفتح", "hours", "open"],
      answer: `${t("ساعات العمل", "Opening hours")}: ${brand.hours[lang]}`,
    },
    {
      keys: ["موقع", "عنوان", "وين", "location", "address"],
      answer: `${t("موقعنا", "Our location")}: ${brand.address[lang]}`,
    },
    {
      keys: ["واتساب", "رقم", "هاتف", "اتصال", "whatsapp", "phone", "call"],
      answer: `${t("تواصل معنا على واتساب", "Reach us on WhatsApp")}: wa.me/${brand.whatsapp}`,
    },
    {
      keys: ["بدون سكر", "صحي", "دايت", "sugar free", "healthy"],
      answer: t(
        "عندنا قسم كامل \"خيارات صحية\" بدون سكر مضاف — جرب دراكون سموذي أو فريش سنست.",
        "We have a full \"Sugar Free & Healthy\" category — try Dragon Smoothie or Fresh Sunset."
      ),
    },
  ];

  for (const entry of faq) {
    if (entry.keys.some((k) => q.includes(k))) return entry.answer;
  }

  const matches = products
    .filter((p) => p.available && (p.name.ar.toLowerCase().includes(q) || p.name.en.toLowerCase().includes(q)))
    .slice(0, 5);

  if (matches.length > 0) {
    const list = matches.map((p) => `• ${p.name[lang]} — ${formatIQD(p.price, lang)}`).join("\n");
    return `${t("لقيت هذي النتائج", "Here's what I found")}:\n${list}`;
  }

  const categoryMatch = categories.find(
    (c) => c.name.ar.toLowerCase().includes(q) || c.name.en.toLowerCase().includes(q)
  );
  if (categoryMatch) {
    return t(
      `قسم "${categoryMatch.name.ar}" موجود بالمنيو — مرّر لفوق وتصفحه من شريط الأقسام.`,
      `The "${categoryMatch.name.en}" category is on the menu — scroll up and pick it from the category tabs.`
    );
  }

  return t(
    `ما لقيت شي بهذا الاسم بالمنيو. جرب كلمة أخرى، أو تواصل معنا مباشرة على واتساب: wa.me/${brand.whatsapp}`,
    `I couldn't find that on the menu. Try another word, or message us directly on WhatsApp: wa.me/${brand.whatsapp}`
  );
}
