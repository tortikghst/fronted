import React, { useState, useEffect } from 'react';

function App() {
  // Состояния
  const [ordersVisible, setOrdersVisible] = useState(false);
  const [favoritesVisible, setFavoritesVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Данные пользователя
  const [user, setUser] = useState({ name: 'Загрузка...', email: 'Загрузка...' });

  // Базовый URL API
  const API_URL = 'http://91.107.123.64:3000/api';

  // ============ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ ============
  const loadUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/user/profile`);
      if (!response.ok) throw new Error('Ошибка загрузки профиля');
      const data = await response.json();
      setUser({
        name: data.name || data.fullName || data.username || 'Пользователь',
        email: data.email || 'email@example.com'
      });
    } catch (err) {
      console.error('Ошибка загрузки пользователя:', err);
      // Демо-данные, если сервер не отвечает
      setUser({ name: 'Иван Иванович', email: 'ivan@event.ru' });
    }
  };

  // ============ ЗАКАЗЫ (GET /orders) ============
  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders`);
      if (!response.ok) throw new Error('Ошибка загрузки заказов');
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.log('Ошибка:', err);
    } finally {
      setLoading(false);
    }
  };

  // ============ ИЗБРАННОЕ (GET /favorites) ============
  const loadFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/favorites`);
      if (!response.ok) throw new Error('Ошибка загрузки избранного');
      const data = await response.json();
      setFavorites(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.log('Ошибка:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные пользователя при запуске
  useEffect(() => {
    loadUserProfile();
  }, []);

  // Функции показа/скрытия
  const showOrders = () => {
    setOrdersVisible(true);
    setFavoritesVisible(false);
    loadOrders();
  };

  const hideOrders = () => {
    setOrdersVisible(false);
  };

  const showFavorites = () => {
    setFavoritesVisible(true);
    setOrdersVisible(false);
    loadFavorites();
  };

  const hideFavorites = () => {
    setFavoritesVisible(false);
  };

  // Статус заказа на русском
  const getStatusText = (status) => {
    switch(status) {
      case 'CREATED': return ' Создан';
      case 'CONFIRMED': return ' Подтверждён';
      case 'COMPLETED': return ' Выполнен';
      case 'CANCELLED': return ' Отменён';
      default: return '⚪ ' + (status || 'Неизвестно');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>ЛИЧНЫЙ КАБИНЕТ</h1>
      
      <p><strong>{user.name}</strong></p>
      <p>{user.email}</p>
      
      <hr />
      
      {/* ============ МОИ ЗАКАЗЫ ============ */}
      <div>
        <h3> МОИ ЗАКАЗЫ</h3>
        
        {!ordersVisible ? (
          <button onClick={showOrders}>Показать заказы</button>
        ) : (
          <button onClick={hideOrders}>Скрыть заказы</button>
        )}
        
        {loading && <p>Загрузка...</p>}
        {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
        
        {ordersVisible && (
          <div style={{ marginTop: '15px', marginLeft: '20px' }}>
            {orders.length === 0 && !loading ? (
              <p>Нет заказов</p>
            ) : (
              orders.map(order => (
                <div key={order.id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                  <p><strong>{order.eventType || 'Мероприятие'}</strong></p>
                  <p>{order.eventDate || 'Дата не указана'} • {order.eventCity || 'Город не указан'}</p>
                  <p>Бюджет: {order.budget ? order.budget + ' руб' : 'Не указан'}</p>
                  <p>Статус: {getStatusText(order.status)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <hr />
      
      {/* ============ ИЗБРАННОЕ ============ */}
      <div>
        <h3> ИЗБРАННОЕ</h3>
        
        {!favoritesVisible ? (
          <button onClick={showFavorites}>Показать избранное</button>
        ) : (
          <button onClick={hideFavorites}>Скрыть избранное</button>
        )}
        
        {loading && <p>Загрузка...</p>}
        
        {favoritesVisible && (
          <div style={{ marginTop: '15px', marginLeft: '20px' }}>
            {favorites.length === 0 && !loading ? (
              <p>Нет избранного оборудования</p>
            ) : (
              favorites.map(item => (
                <div key={item.id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                  <p><strong>{item.name || 'Оборудование'}</strong></p>
                  <p>Поставщик: {item.supplier || 'Не указан'}</p>
                  <p>Цена: {item.price ? item.price + ' руб/сут' : 'Не указана'}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <hr />
      
      <div>
        <button> Выйти из аккаунта</button>
      </div>
    </div>
  );
}

export default App;