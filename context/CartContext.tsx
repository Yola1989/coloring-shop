"use client";

import { createContext, useContext, useState } from "react";

export type CartItemType = "book" | "offer";

export type CartItem = {
  id: number;
  type: CartItemType;
  title: string;
  price: number;
  cover: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number, type: CartItemType) => void;
  updateQuantity: (id: number, type: CartItemType, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(item: Omit<CartItem, "quantity">) {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.type === item.type
      );

      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.type === item.type
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(id: number, type: CartItemType) {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  }

  function updateQuantity(id: number, type: CartItemType, quantity: number) {
    if (quantity < 1) {
      removeFromCart(id, type);
      return;
    }

    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.type === type ? { ...i, quantity } : i
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
