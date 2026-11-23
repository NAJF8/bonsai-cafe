import type { CartLine, Lang } from "../types";
import { formatIQD } from "./currency";

interface OrderInfo {
  customerName: string;
  customerPhone?: string;
  orderType: "dine-in" | "pickup" | "delivery";
  tableOrAddress?: string;
  note?: string;
}

export function buildWhatsAppMessage(
  lines: CartLine[],
  total: number,
  order: OrderInfo,
  lang: Lang
): string {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const parts: string[] = [];

  parts.push(`*${t("طلب جديد — بونساي كافيه", "New Order — Bonsai Café")}*`);
  parts.push("");
  parts.push(`${t("الاسم", "Name")}: ${order.customerName}`);
  if (order.customerPhone) parts.push(`${t("الهاتف", "Phone")}: ${order.customerPhone}`);

  const orderTypeLabel = {
    "dine-in": t("تناول في الكافيه", "Dine-in"),
    pickup: t("استلام", "Pickup"),
    delivery: t("توصيل", "Delivery"),
  }[order.orderType];
  parts.push(`${t("نوع الطلب", "Order type")}: ${orderTypeLabel}`);
  if (order.tableOrAddress) {
    parts.push(`${t("الطاولة / العنوان", "Table / Address")}: ${order.tableOrAddress}`);
  }

  parts.push("");
  parts.push(`${t("الطلبات", "Items")}:`);
  lines.forEach((line, i) => {
    let itemLine = `${i + 1}. ${line.name[lang]} x${line.quantity}`;
    if (line.sizeName) itemLine += ` (${line.sizeName[lang]})`;
    parts.push(itemLine);
    if (line.addonNames.length) {
      parts.push(`   + ${line.addonNames.map((a) => a[lang]).join(", ")}`);
    }
    if (line.note) {
      parts.push(`   ${t("ملاحظة", "Note")}: ${line.note}`);
    }
    parts.push(`   ${formatIQD(line.unitPrice * line.quantity, lang)}`);
  });

  parts.push("");
  parts.push(`*${t("المجموع", "Total")}: ${formatIQD(total, lang)}*`);

  if (order.note) {
    parts.push("");
    parts.push(`${t("ملاحظات عامة", "General note")}: ${order.note}`);
  }

  return parts.join("\n");
}

export function buildWhatsAppLink(phoneE164: string, message: string): string {
  return `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`;
}
