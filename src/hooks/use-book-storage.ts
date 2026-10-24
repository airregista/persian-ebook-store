"use client";

import * as React from "react";
import { toast } from "sonner";

const STORAGE_KEYS = {
  WISHLIST: "kg_wishlist_ids",
  PURCHASED: "kg_purchased_ids",
} as const;

// Default initial IDs for demo/sample store state
const DEFAULT_WISHLIST_RAW = JSON.stringify(["2"]);
const DEFAULT_PURCHASED_RAW = JSON.stringify(["1"]);

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("kg_storage_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("kg_storage_change", callback);
  };
}

function notifyStorageChange() {
  window.dispatchEvent(new Event("kg_storage_change"));
}

function getWishlistSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.WISHLIST) ?? DEFAULT_WISHLIST_RAW;
  } catch {
    return DEFAULT_WISHLIST_RAW;
  }
}

function getPurchasedSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.PURCHASED) ?? DEFAULT_PURCHASED_RAW;
  } catch {
    return DEFAULT_PURCHASED_RAW;
  }
}

function getServerWishlistSnapshot(): string {
  return DEFAULT_WISHLIST_RAW;
}

function getServerPurchasedSnapshot(): string {
  return DEFAULT_PURCHASED_RAW;
}

export function useBookStorage() {
  // ponytail: useSyncExternalStore provides safe SSR hydration, zero setState-in-effect, and cross-tab sync
  const isLoaded = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const rawWishlist = React.useSyncExternalStore(
    subscribe,
    getWishlistSnapshot,
    getServerWishlistSnapshot
  );

  const rawPurchased = React.useSyncExternalStore(
    subscribe,
    getPurchasedSnapshot,
    getServerPurchasedSnapshot
  );

  const wishlistIds = React.useMemo(() => {
    try {
      const parsed = JSON.parse(rawWishlist);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return ["2"];
    }
  }, [rawWishlist]);

  const purchasedIds = React.useMemo(() => {
    try {
      const parsed = JSON.parse(rawPurchased);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return ["1"];
    }
  }, [rawPurchased]);

  const toggleWishlist = React.useCallback((bookId: string) => {
    try {
      const currentRaw = localStorage.getItem(STORAGE_KEYS.WISHLIST) ?? DEFAULT_WISHLIST_RAW;
      const current: string[] = JSON.parse(currentRaw);
      const exists = current.includes(bookId);
      const next = exists ? current.filter((id) => id !== bookId) : [...current, bookId];
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(next));
      notifyStorageChange();
      if (exists) {
        toast.info("از لیست علاقه‌مندی‌ها حذف شد");
      } else {
        toast.success("به لیست علاقه‌مندی‌ها افزوده شد");
      }
    } catch {
      // ignore in restricted environments
    }
  }, []);

  const purchaseBook = React.useCallback((bookId: string) => {
    try {
      const currentRaw = localStorage.getItem(STORAGE_KEYS.PURCHASED) ?? DEFAULT_PURCHASED_RAW;
      const current: string[] = JSON.parse(currentRaw);
      if (!current.includes(bookId)) {
        const next = [...current, bookId];
        localStorage.setItem(STORAGE_KEYS.PURCHASED, JSON.stringify(next));
        notifyStorageChange();
      }
    } catch {
      // ignore
    }
  }, []);

  const isWishlisted = React.useCallback(
    (bookId: string) => wishlistIds.includes(bookId),
    [wishlistIds]
  );

  const isPurchased = React.useCallback(
    (bookId: string) => purchasedIds.includes(bookId),
    [purchasedIds]
  );

  return {
    wishlistIds,
    purchasedIds,
    wishlistCount: wishlistIds.length,
    purchasedCount: purchasedIds.length,
    isLoaded,
    toggleWishlist,
    purchaseBook,
    isWishlisted,
    isPurchased,
  };
}
