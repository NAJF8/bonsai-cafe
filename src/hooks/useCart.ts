import { useCallback, useEffect, useState } from "react";
import type { CartLine } from "../types";

const STORAGE_KEY = "bonsai_cart_v1";

function readStoredCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>(() => readStoredCart());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable (private mode) — cart still works in-memory */
    }
  }, [lines]);

  const addLine = useCallback((line: Omit<CartLine, "lineId">) => {
    setLines((prev) => [...prev, { ...line, lineId: crypto.randomUUID() }]);
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.lineId !== lineId)
        : prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l))
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  // Addon price is already folded into unitPrice at add-time.
  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  return { lines, addLine, removeLine, updateQuantity, clear, itemCount, total };
}
