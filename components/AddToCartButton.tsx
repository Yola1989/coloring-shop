"use client";

import { useState } from "react";
import { useCart, CartItemType } from "@/context/CartContext";

type AddToCartButtonProps = {
  id: number;
  title: string;
  price: number;
  cover: string;
  type?: CartItemType;
};

export default function AddToCartButton({
  id,
  title,
  price,
  cover,
  type = "book",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart({ id, type, title, price, cover });
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  return (
    <>
      <button
        onClick={handleAdd}
        className="w-full rounded-2xl bg-orange-500 py-4 text-lg font-semibold text-white transition hover:bg-orange-600"
      >
        Add to Cart
      </button>

      {added && (
        <p className="mt-4 rounded-xl bg-green-100 py-3 text-center font-medium text-green-700">
          ✅ Added to cart
        </p>
      )}
    </>
  );
}
