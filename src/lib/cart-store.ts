export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("dos-cart") || "[]");
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem("dos-cart", JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "quantity">, qty: number = 1): CartItem[] {
  const cart = getCart();
  const idx = cart.findIndex((c) => c.id === item.id && c.color === item.color && c.size === item.size);
  if (idx >= 0) cart[idx].quantity += qty;
  else cart.push({ ...item, quantity: qty });
  saveCart(cart);
  return cart;
}

export function updateQuantity(id: string, color: string, size: string, qty: number): CartItem[] {
  const cart = getCart().map((c) =>
    c.id === id && c.color === color && c.size === size ? { ...c, quantity: Math.max(1, qty) } : c
  );
  saveCart(cart);
  return cart;
}

export function removeItem(id: string, color: string, size: string): CartItem[] {
  const cart = getCart().filter((c) => !(c.id === id && c.color === color && c.size === size));
  saveCart(cart);
  return cart;
}

export function clearCart(): CartItem[] {
  saveCart([]);
  return [];
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}