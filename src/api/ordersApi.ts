// src/api/ordersApi.ts
import { apiClient } from './client';
import type { Order, CreateOrderData } from './types';

export const ordersApi = {
    // Создать заказ
    create: (data: CreateOrderData) =>
        apiClient<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),

    // Список заказов пользователя
    getMyOrders: () =>
        apiClient<Order[]>('/orders'),

    // Детали заказа
    getById: (id: string) =>
        apiClient<Order>(`/orders/${id}`),

    // Изменить статус
    updateStatus: (id: string, status: string) =>
        apiClient<Order>(`/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),

    // Авто-отмена старых
    autoCancel: () =>
        apiClient<void>('/orders/auto-cancel', { method: 'POST' }),
};