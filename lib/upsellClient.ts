"use client";

import { useEffect, useState } from "react";
import type { UpsellConfig } from "@/lib/upsell";

export type UpsellBook = {
  id: number;
  title: string;
  cover: string;
  price: number;
};

export type UpsellData = UpsellConfig & { books: UpsellBook[] };

const EMPTY: UpsellData = {
  enabled: false,
  price: 0,
  title: "",
  subtitle: "",
  books: [],
};

// The cart page and the offer strip both need this, so the request is shared
// instead of fired twice. A page reload always refetches.
let cached: Promise<UpsellData> | null = null;

export function loadUpsellData(): Promise<UpsellData> {
  if (!cached) {
    cached = fetch("/api/upsell")
      .then((res) => (res.ok ? res.json() : EMPTY))
      .catch(() => EMPTY);
  }

  return cached;
}

export function useUpsellData(): UpsellData | null {
  const [data, setData] = useState<UpsellData | null>(null);

  useEffect(() => {
    let active = true;

    loadUpsellData().then((result) => {
      if (active) setData(result);
    });

    return () => {
      active = false;
    };
  }, []);

  return data;
}
