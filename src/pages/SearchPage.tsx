import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';

interface Category {
    id: string;
    name: string;
}

const CITIES = [
    'Москва',
    'Санкт-Петербург',
    'Киров',
    'Казань',
    'Нижний Новгород',
    'Екатеринбург',
    'Новосибирск',
    'Краснодар',
    'Владивосток',
    'Ростов-на-Дону',
];

export default function SearchPage() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [city, setCity] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [deliveryOnly, setDeliveryOnly] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Загружаем доступные категории с бэкенда
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://91.107.123.64:3000/categories');
                if (!response.ok) throw new Error('Ошибка загрузки категорий');
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                console.error(err);
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const validateForm = (): boolean => {
        if (!city) {
            setValidationError('Пожалуйста, выберите город');
            return false;
        }
        if (!categoryId) {
            setValidationError('Пожалуйста, выберите категорию');
            return false;
        }
        setValidationError(null);
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Собираем параметры в URLSearchParams
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set('search', searchTerm.trim());
        if (city) params.set('city', city);
        if (categoryId) params.set('categoryId', categoryId);
        if (minPrice !== '') params.set('minPrice', minPrice);
        if (maxPrice !== '') params.set('maxPrice', maxPrice);
        if (deliveryOnly) params.set('delivery', 'true');

        navigate(`/results?${params.toString()}`);
    };

    return (
        <div className="search-page">
            <h1>Найти оборудование</h1>
            <form className="search-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="searchTerm">Поиск по названию или описанию</label>
                    <input
                        id="searchTerm"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Например: Микрофон"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="city">Город <span className="required">*</span></label>
                    <select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
                        <option value="" disabled>Выберите город</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="category">Категория <span className="required">*</span></label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        disabled={loadingCategories}
                    >
                        <option value="" disabled>
                            {loadingCategories ? 'Загрузка...' : 'Выберите категорию'}
                        </option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="minPrice">Минимальная цена (₽)</label>
                    <input
                        id="minPrice"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="maxPrice">Максимальная цена (₽)</label>
                    <input
                        id="maxPrice"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="100 000 000"
                    />
                </div>

                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={deliveryOnly}
                            onChange={(e) => setDeliveryOnly(e.target.checked)}
                        />
                        Только с доставкой
                    </label>
                </div>

                <button type="submit" className="submit-button">Искать</button>
            </form>

            {validationError && <div className="error-message">{validationError}</div>}
        </div>
    );
}