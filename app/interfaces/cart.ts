import type { IProduct } from './product'

export interface CartItemOption {
    optionId: number;
    optionTitle: string;
    valueId: number;
    valueTitle: string;
}

export interface CartItem {
    id: number;
    local: number;
    product: IProduct;
    options: CartItemOption[];
    price: number;
    quantity: number;
    total: number;
    error?: string;
    max?: number;
}

export type CartTotalType = 'shipping' | 'tax';

export interface CartTotal {
    type: CartTotalType;
    title: string;
    price: number;
}

export interface Cart {
    items: CartItem[];
    quantity: number;
    subtotal: number;
    totals: CartTotal[];
    total: number;
    weight: number;
    stock: boolean;
    multiple: boolean;
}
