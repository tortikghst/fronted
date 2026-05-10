// src/api/equipmentApi.ts
import { apiClient } from './client';
import type { Equipment, EquipmentFilters, Category } from './types';

export const equipmentApi = {
    // Получить список с фильтрацией
    getAll: (filters?: EquipmentFilters) => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }
        return apiClient<Equipment[]>(`/equipment?${params.toString()}`);
    },

    // Случайное оборудование
    getRandom: (count: number = 3) =>
        apiClient<Equipment[]>(`/equipment/random?count=${count}`),

    // Детали товара
    getById: (id: string) =>
        apiClient<Equipment>(`/equipment/${id}`),

    // Создать (только поставщик/админ)
    create: (data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) =>
        apiClient<Equipment>('/equipment', { method: 'POST', body: JSON.stringify(data) }),

    // Обновить
    update: (id: string, data: Partial<Equipment>) =>
        apiClient<Equipment>(`/equipment/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // Удалить
    delete: (id: string) =>
        apiClient<void>(`/equipment/${id}`, { method: 'DELETE' }),
};

export const categoriesApi = {
    getAll: () => apiClient<Category[]>('/categories'),
};