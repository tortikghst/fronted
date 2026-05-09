import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultPage.css';

interface Equipment {
    id: string;
    name: string;
    description: string | null;
    price: number;
    city: string;
    images: string;
    deliveryAvailable: boolean;
    categoryId: string | null;
}

export default function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);

    // Читаем параметры из URL
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const delivery = searchParams.get('delivery') === 'true';

    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFilteredEquipment = async () => {
            setLoading(true);
            setError(null);

            // Строим URL с теми же параметрами, что и в Swagger
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (city) params.set('city', city);
            if (categoryId) params.set('categoryId', categoryId);
            if (minPrice) params.set('minPrice', minPrice);
            if (maxPrice) params.set('maxPrice', maxPrice);
            if (delivery) params.set('delivery', 'true');

            const url = `http://91.107.123.64:3000/equipment?${params.toString()}`;
            console.log('📡 Запрос к API:', url);

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
                    }
                    if (response.status === 500) {
                        throw new Error('Ошибка на сервере. Попробуйте позже.');
                    }
                    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('✅ Получено:', data.length, 'записей');
                setEquipment(data);
            } catch (err) {
                console.error('❌ Ошибка:', err);
                setError(err instanceof Error ? err.message : 'Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredEquipment();
    }, [search, city, categoryId, minPrice, maxPrice, delivery]);

    if (loading) return <div className="results-page loading">⏳ Поиск оборудования...</div>;
    if (error) return <div className="results-page error">❌ {error}</div>;

    return (
        <div className="results-page">
            <h1>Результаты поиска</h1>
            {equipment.length === 0 ? (
                <div className="no-results">
                    😕 Ничего не найдено. Попробуйте изменить параметры поиска.
                </div>
            ) : (
                <>
                    <p className="found-count">Найдено: {equipment.length}</p>
                    <div className="products-grid">
                        {equipment.map(item => (
                            <div key={item.id} className="product-card">
                                <div className="product-image">
                                    {item.images ? (
                                        <img src={item.images} alt={item.name} />
                                    ) : (
                                        <div className="no-image">Нет фото</div>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h3>{item.name}</h3>
                                    {item.description && <p>{item.description.slice(0, 100)}...</p>}
                                    <div className="product-price">{item.price.toLocaleString()} ₽</div>
                                    <div className="product-city">🏙️ {item.city}</div>
                                    <div className="product-delivery">
                                        {item.deliveryAvailable ? '🚚 Доставка доступна' : '🏠 Самовывоз'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            <div className="back-button-wrapper">
                <button onClick={() => navigate('/')} className="back-button">
                    ← Вернуться к поиску
                </button>
            </div>
        </div>
    );
}