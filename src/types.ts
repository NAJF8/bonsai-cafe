export type Lang = "ar" | "en";

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface ProductAddon {
  id: string;
  name: LocalizedText;
  price: number; // IQD, 0 = free
}

export interface ProductSize {
  id: string;
  name: LocalizedText;
  priceDelta: number; // added to base price, can be 0
}

export interface Product {
  id: string;
  categoryId: string;
  name: LocalizedText;
  description?: LocalizedText;
  price: number; // IQD, base price
  image?: string;
  tags?: Array<"bestseller" | "signature" | "healthy" | "new">;
  sizes?: ProductSize[];
  addons?: ProductAddon[];
  available: boolean;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: LocalizedText;
  sortOrder: number;
  icon?: string;
}

export interface CartLine {
  lineId: string;
  productId: string;
  name: LocalizedText;
  unitPrice: number;
  quantity: number;
  sizeId?: string;
  sizeName?: LocalizedText;
  addonIds: string[];
  addonNames: LocalizedText[];
  note?: string;
}

export interface BrandSettings {
  name: LocalizedText;
  tagline: LocalizedText;
  phone: string;
  whatsapp: string;
  address: LocalizedText;
  hours: LocalizedText;
  instagram: string;
  rating?: number;
}

export interface Review {
  id?: string;
  rating: number;
  comment: string;
  customerName?: string;
  phone?: string;
  productId?: string;
  createdAt: number;
}

export interface Member {
  phone: string;
  name: string;
  points: number;
  createdAt?: unknown;
}

export interface CafeEvent {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "19:00 - 02:00"
  price: LocalizedText; // e.g. "مجاني" / "Free"
  sortOrder: number;
}

export interface GiftOrder {
  id?: string;
  code: string;
  kind: "product" | "amount";
  productId?: string;
  productName?: string;
  amount?: number;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone?: string;
  message?: string;
  status: "pending" | "redeemed";
  createdAt?: unknown;
}

export interface BookingRequest {
  id?: string;
  purpose: LocalizedText;
  date: string;
  time: string;
  partySize: number;
  name: string;
  phone: string;
  note?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt?: unknown;
}
