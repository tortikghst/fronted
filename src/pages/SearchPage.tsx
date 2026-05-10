// src/pages/SearchPage.tsx
import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipmentApi, categoriesApi } from '../api/equipmentApi';
import EquipmentCard from '../components/EquipmentCard';
import type { Equipment, Category, EquipmentFilters } from '../api/types';
import './SearchPage.css';

export default function SearchPage() {
    const navigate = useNavigate();

    const [items, setItems] = useState<Equipment[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const [filters, setFilters] = useState<EquipmentFilters>({
        city: '',
        minPrice: undefined,
        maxPrice: undefined,
        search: '',
        delivery: undefined,
        categoryId: '',
    });

    const handleSearch = useCallback(async (e?: FormEvent) => {
        e?.preventDefault();
        setLoading(true);
        setSearched(true);

        try {
            const cleanFilters: EquipmentFilters = {};
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== undefined && value !== null) {
                    (cleanFilters as Record<string, unknown>)[key] = value;
                }
            });

            const data = await equipmentApi.getAll(cleanFilters);
            setItems(data);
        } catch (err) {
            console.error('Ошибка поиска:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const updateFilter = useCallback((key: keyof EquipmentFilters, value: unknown) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    useEffect(() => {
        categoriesApi.getAll().then(setCategories).catch(console.error);
        handleSearch();
    }, [handleSearch]);

    return (
        <div className="search-page">
            <header className="search-header">
                <div className="search-header-left">
                    <button
                        className="search-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Назад
                    </button>
                    <h1 className="search-logo">GostEvent</h1>
                </div>
                <button
                    className="search-profile-btn"
                    onClick={() => navigate('/profile')}
                    title="Профиль"
                >
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </button>
            </header>

            <section className="search-filters">
                <form className="search-filters-form" onSubmit={handleSearch}>
                    <div className="search-filter-group">
                        <label>Поиск</label>
                        <input
                            type="text"
                            placeholder="Название оборудования..."
                            value={filters.search || ''}
                            onChange={e => updateFilter('search', e.target.value)}
                        />
                    </div>

                    <div className="search-filter-group">
                        <label>Город</label>
                        <input
                            type="text"
                            placeholder="Москва"
                            value={filters.city || ''}
                            onChange={e => updateFilter('city', e.target.value)}
                        />
                    </div>

                    <div className="search-filter-group">
                        <label>Категория</label>
                        <select
                            value={filters.categoryId || ''}
                            onChange={e => updateFilter('categoryId', e.target.value)}
                        >
                            <option value="">Все категории</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="search-filter-group">
                        <label>Цена от</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={filters.minPrice || ''}
                            onChange={e => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                        />
                    </div>

                    <div className="search-filter-group">
                        <label>Цена до</label>
                        <input
                            type="number"
                            placeholder="∞"
                            value={filters.maxPrice || ''}
                            onChange={e => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                        />
                    </div>

                    <label className="search-filter-checkbox">
                        <input
                            type="checkbox"
                            checked={!!filters.delivery}
                            onChange={e => updateFilter('delivery', e.target.checked || undefined)}
                        />
                        С доставкой
                    </label>

                    <button type="submit" className="search-filter-btn">
                        🔍 Найти
                    </button>
                </form>
            </section>

            <section className="search-results">
                {loading ? (
                    <div className="main-loading">
                        <div className="spinner"></div>
                        <p>Поиск...</p>
                    </div>
                ) : (
                    <>
                        {searched && (
                            <p className="search-count">
                                Найдено: <span>{items.length}</span> {items.length === 1 ? 'товар' : items.length < 5 ? 'товара' : 'товаров'}
                            </p>
                        )}

                        {items.length > 0 ? (
                            <div className="search-grid">
                                {items.map(item => (
                                    <EquipmentCard key={item.id} equipment={item} />
                                ))}
                            </div>
                        ) : searched ? (
                            <div className="search-empty">
                                <h3>Ничего не найдено</h3>
                                <p>Попробуйте изменить параметры поиска</p>
                            </div>
                        ) : null}
                    </>
                )}
            </section>
        </div>
    );
}