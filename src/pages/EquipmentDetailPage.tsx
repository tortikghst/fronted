// src/pages/EquipmentDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { equipmentApi } from '../api/equipmentApi';
import OrderModal from '../components/OrderModal';
import type { Equipment } from '../api/types';
import './EquipmentDetailPage.css';

export default function EquipmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [item, setItem] = useState<Equipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showOrder, setShowOrder] = useState(false);

    useEffect(() => {
        if (id) loadItem();
    }, [id]);

    const loadItem = async () => {
        try {
            const data = await equipmentApi.getById(id!);
            setItem(data);
        } catch (err) {
            console.error('Ошибка загрузки:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: 80, textAlign: 'center' }}>Загрузка...</div>;
    if (!item) return <div style={{ padding: 80, textAlign: 'center' }}>Товар не найден</div>;

    // ИСПРАВЛЕНО: правильная обработка images
    // API возвращает images как строку (один URL) или null/undefined
    let imagesArray: string[] = [];
    
    if (item.images) {
        // Если images - строка и не пустая
        if (typeof item.images === 'string' && item.images.trim()) {
            imagesArray = [item.images];
        }
        // Если вдруг images уже массив (на будущее)
        else if (Array.isArray(item.images)) {
            imagesArray = item.images;
        }
    }
    
    // Запасное изображение, если нет фото
    if (imagesArray.length === 0) {
        imagesArray = ['/src/image/ehf.png'];
    }

    return (
        <div className="detail-page">
            <header className="detail-header">
                <button className="detail-back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Назад
                </button>
                <h1 className="detail-logo">GostEvent</h1>
            </header>

            <div className="detail-content">
                <div className="detail-gallery">
                    <img
                        src={imagesArray[selectedImage]}
                        alt={item.name}
                        className="detail-main-image"
                        onError={(e) => {
                            // Если изображение не загрузилось, подставляем заглушку
                            (e.target as HTMLImageElement).src = '/src/image/ehf.png';
                        }}
                    />
                    {imagesArray.length > 1 && (
                        <div className="detail-thumbnails">
                            {imagesArray.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`${item.name} ${i + 1}`}
                                    className={`detail-thumb ${i === selectedImage ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(i)}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/src/image/ehf.png';
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="detail-info">
                    <h1 className="detail-name">{item.name}</h1>

                    <div className="detail-meta">
                        {item.category && (
                            <span className="detail-tag detail-tag--category">
                                {typeof item.category === 'object' ? item.category.name : item.category}
                            </span>
                        )}
                        <span className="detail-tag">📍 {item.city}</span>
                        {item.deliveryAvailable && <span className="detail-tag">🚚 Доставка</span>}
                    </div>

                    <p className="detail-description">{item.description}</p>

                    <div className="detail-price-block">
                        <p className="detail-price">
                            {item.price.toLocaleString('ru-RU')} ₽<span>/день</span>
                        </p>
                        {item.supplier && typeof item.supplier === 'object' && (
                            <div className="detail-supplier">
                                <p className="detail-supplier-name">{item.supplier.companyName}</p>
                                <p className="detail-supplier-city">{item.supplier.city}</p>
                            </div>
                        )}
                    </div>

                    <div className="detail-actions">
                        <button
                            className="detail-btn detail-btn--primary"
                            onClick={() => {
                                if (!isAuthenticated) {
                                    navigate('/login');
                                    return;
                                }
                                setShowOrder(true);
                            }}
                        >
                            🛒 Арендовать
                        </button>
                        <button
                            className="detail-btn detail-btn--secondary"
                            onClick={() => alert('В избранное!')}
                        >
                            ❤️ В избранное
                        </button>
                    </div>
                </div>
            </div>

            {showOrder && (
                <OrderModal
                    equipment={item}
                    onClose={() => setShowOrder(false)}
                    onSuccess={() => alert('Заказ создан!')}
                />
            )}
        </div>
    );
}