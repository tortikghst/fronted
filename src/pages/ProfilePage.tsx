// src/pages/ProfilePage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ordersApi } from '../api/ordersApi';
import type { Order } from '../api/types';
import './ProfilePage.css';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');
    const [loading, setLoading] = useState(true);

    const loadOrders = useCallback(async () => {
        try {
            const data = await ordersApi.getMyOrders();
            setOrders(data);
        } catch (err) {
            console.error('Ошибка загрузки заказов:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleLogout = () => {
        logout();
        navigate('/start');
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, { text: string; class: string }> = {
            PENDING: { text: '⏳ Ожидает', class: 'status-pending' },
            CONFIRMED: { text: '✅ Подтверждён', class: 'status-confirmed' },
            CANCELLED: { text: '❌ Отменён', class: 'status-cancelled' },
            COMPLETED: { text: '🎉 Завершён', class: 'status-completed' },
        };
        return labels[status] || { text: status, class: '' };
    };

    return (
        <div className="profile-page">
            <header className="profile-header">
                <button className="profile-back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Назад
                </button>
                <h1 className="profile-logo">GostEvent</h1>
                <button className="profile-logout-btn" onClick={handleLogout}>
                    Выйти
                </button>
            </header>

            <div className="profile-content">
                <div className="profile-sidebar">
                    <div className="profile-avatar">
                        {user?.name?.[0]?.toUpperCase() || '👤'}
                    </div>
                    <h2 className="profile-name">{user?.name}</h2>
                    <p className="profile-email">{user?.email}</p>
                    <span className={`profile-role role-${user?.role?.toLowerCase()}`}>
                        {user?.role}
                    </span>

                    <div className="profile-tabs">
                        <button
                            className={activeTab === 'info' ? 'active' : ''}
                            onClick={() => setActiveTab('info')}
                        >
                            Профиль
                        </button>
                        <button
                            className={activeTab === 'orders' ? 'active' : ''}
                            onClick={() => setActiveTab('orders')}
                        >
                            Мои заказы ({orders.length})
                        </button>
                    </div>
                </div>

                <div className="profile-main">
                    {activeTab === 'info' ? (
                        <div className="profile-info">
                            <h3>Личная информация</h3>
                            <div className="profile-field">
                                <label>Имя</label>
                                <p>{user?.name}</p>
                            </div>
                            <div className="profile-field">
                                <label>Email</label>
                                <p>{user?.email}</p>
                            </div>
                            <div className="profile-field">
                                <label>Роль</label>
                                <p>{user?.role}</p>
                            </div>
                            <div className="profile-field">
                                <label>ID</label>
                                <p className="profile-id">{user?.id}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-orders">
                            <h3>История заказов</h3>
                            {loading ? (
                                <div className="profile-loading">Загрузка...</div>
                            ) : orders.length === 0 ? (
                                <div className="profile-empty">
                                    <p>У вас пока нет заказов</p>
                                    <button onClick={() => navigate('/search')}>
                                        Найти оборудование
                                    </button>
                                </div>
                            ) : (
                                orders.map(order => {
                                    const status = getStatusLabel(order.status);
                                    return (
                                        <div key={order.id} className="profile-order-card">
                                            <div className="profile-order-header">
                                                <span className="profile-order-id">
                                                    Заказ #{order.id.slice(-6).toUpperCase()}
                                                </span>
                                                <span className={`profile-order-status ${status.class}`}>
                                                    {status.text}
                                                </span>
                                            </div>
                                            <p className="profile-order-event">
                                                {order.eventType} — {order.eventCity}
                                            </p>
                                            <div className="profile-order-items">
                                                {order.items.map((item, i) => (
                                                    <span key={i} className="profile-order-item">
                                                        {item.equipment.name} ×{item.quantity}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="profile-order-footer">
                                                <span className="profile-order-total">
                                                    {order.totalPrice.toLocaleString('ru-RU')} ₽
                                                </span>
                                                <span className="profile-order-date">
                                                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}