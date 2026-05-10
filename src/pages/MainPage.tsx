// src/pages/MainPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { equipmentApi } from '../api/equipmentApi';
import EquipmentCard from '../components/EquipmentCard';
import type { Equipment } from '../api/types';
import './MainPage.css';

export default function MainPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [items, setItems] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);

    // useCallback чтобы избежать проблемы с зависимостями
    const loadRandomItems = useCallback(async () => {
        try {
            const data = await equipmentApi.getRandom(3);
            setItems(data);
        } catch (err) {
            console.error('Ошибка загрузки:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRandomItems();
    }, [loadRandomItems]);

    return (
        <div className="main-page">
            <header className="main-header">
                <h1 className="main-logo">GostEvent</h1>
                <div className="main-header-actions">
                    <button
                        className="main-search-btn"
                        onClick={() => navigate('/search')}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        Поиск оборудования
                    </button>
                    <button
                        className="main-profile-btn"
                        onClick={() => navigate('/profile')}
                        title="Профиль"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="main-content">
                <div className="main-welcome">
                    <h2>Привет, {user?.name || 'гость'}! 👋</h2>
                    <p>Найдите идеальное оборудование для вашего мероприятия</p>
                </div>

                <h3 className="main-section-title">Популярное оборудование</h3>

                {loading ? (
                    <div className="main-loading">
                        <div className="spinner"></div>
                        <p>Загрузка...</p>
                    </div>
                ) : (
                    <div className="main-grid">
                        {items.map((item) => (
                            <EquipmentCard key={item.id} equipment={item} />
                        ))}
                    </div>
                )}

                <button
                    className="main-view-all"
                    onClick={() => navigate('/search')}
                >
                    Смотреть всё оборудование →
                </button>
            </main>
        </div>
    );
}