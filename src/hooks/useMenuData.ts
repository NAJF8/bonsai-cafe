import { useEffect, useState } from "react";
import type { Category, Product, BrandSettings } from "../types";
import { categories as seedCategories } from "../data/categories";
import { products as seedProducts } from "../data/products";
import { brand as seedBrand } from "../data/brand";
import { fetchCollectionSafe, isFirebaseConfigured } from "../lib/firebase";

interface MenuData {
  categories: Category[];
  products: Product[];
  brand: BrandSettings;
  loading: boolean;
  source: "firebase" | "seed";
}

export function useMenuData(): MenuData {
  const [state, setState] = useState<MenuData>({
    categories: seedCategories,
    products: seedProducts,
    brand: seedBrand,
    loading: isFirebaseConfigured,
    source: "seed",
  });

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let cancelled = false;

    (async () => {
      const [remoteCategories, remoteProducts, remoteSettings] = await Promise.all([
        fetchCollectionSafe<Category>("categories"),
        fetchCollectionSafe<Product>("products"),
        fetchCollectionSafe<BrandSettings & { id: string }>("settings"),
      ]);

      if (cancelled) return;

      // Firestore collections don't preserve array order, so every list
      // read from it must be explicitly re-sorted by its own sortOrder.
      const sortedCategories = remoteCategories?.length
        ? [...remoteCategories].sort((a, b) => a.sortOrder - b.sortOrder)
        : null;
      const sortedProducts = remoteProducts?.length
        ? [...remoteProducts].sort((a, b) => a.sortOrder - b.sortOrder)
        : null;

      setState((prev) => ({
        categories: sortedCategories ?? prev.categories,
        products: sortedProducts ?? prev.products,
        brand: remoteSettings && remoteSettings.length ? remoteSettings[0] : prev.brand,
        loading: false,
        source: remoteCategories || remoteProducts ? "firebase" : "seed",
      }));
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
