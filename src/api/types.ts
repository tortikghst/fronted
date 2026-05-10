// src/api/types.ts

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'SUPPLIER' | 'ADMIN';
    createdAt: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

// === ОБОРУДОВАНИЕ ===
export interface Equipment {
    id: string;
    name: string;
    description: string;
    price: number;
    city: string;
    delivery: boolean;
    images: string | string[] | null;
    categoryId: string;
    category?: Category;
    supplierId: string;
    supplier?: Supplier;
    createdAt: string;
    updatedAt: string;
}

export interface EquipmentFilters {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    delivery?: boolean;
    categoryId?: string;
}

// === ЗАКАЗЫ ===
export interface OrderItemInput {
    equipmentId: string;
    quantity: number;
    startDate: string;
    endDate: string;
}

export interface CreateOrderData {
    items: OrderItemInput[];
    eventType: string;
    eventCity: string;
}

export interface OrderItem {
    id: string;
    equipment: Equipment;
    quantity: number;
    startDate: string;
    endDate: string;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    eventType: string;
    eventCity: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    totalPrice: number;
    createdAt: string;
}

// === КАТЕГОРИИ ===
export interface Category {
    id: string;
    name: string;
    description?: string;
    image?: string;
}

// === ПОСТАВЩИКИ ===
export interface Supplier {
    id: string;
    userId: string;
    companyName: string;
    description?: string;
    city: string;
    phone?: string;
    rating?: number;
}

// === ИЗБРАННОЕ ===
export interface Favorite {
    id: string;
    equipmentId: string;
    equipment: Equipment;
    createdAt: string;
}