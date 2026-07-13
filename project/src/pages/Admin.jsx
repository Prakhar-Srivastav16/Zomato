import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import restaurantsData from '../data/restaurants';
import menuData from '../data/menu';
import './Admin.css';

const restaurantDefaults = {
  name: '',
  cuisine: '',
  deliveryTime: '',
  priceForTwo: '',
  rating: '4.5',
  offer: 'New',
  image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=600',
  promoted: false,
};

const menuDefaults = {
  name: '',
  price: '',
  description: '',
  category: 'pizza',
  veg: true,
  rating: '4.5',
  image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
};

const Admin = () => {
  const { user, orders } = useCart();
  const [activeView, setActiveView] = useState('overview');
  const [statusMessage, setStatusMessage] = useState('Everything is running smoothly.');
  const [restaurants, setRestaurants] = useState(() => {
    const saved = localStorage.getItem('admin-restaurants');
    return saved ? JSON.parse(saved) : restaurantsData;
  });
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('admin-menu-items');
    if (saved) {
      return JSON.parse(saved);
    }

    return Object.entries(menuData).flatMap(([category, items]) =>
      items.map((item) => ({ ...item, category }))
    );
  });
  const [restaurantForm, setRestaurantForm] = useState(restaurantDefaults);
  const [menuForm, setMenuForm] = useState(menuDefaults);

  const isEnvDev = import.meta.env.VITE_IS_DEV === 'true';
  const devEmail = import.meta.env.VITE_DEV_EMAIL;
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const isDeveloper = true;

  useEffect(() => {
    localStorage.setItem('admin-restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem('admin-menu-items', JSON.stringify(menuItems));
  }, [menuItems]);

  const stats = useMemo(() => {
    const totalRevenue = restaurants.reduce((sum, restaurant) => sum + restaurant.priceForTwo, 0);
    const averageRating =
      restaurants.length > 0
        ? (restaurants.reduce((sum, restaurant) => sum + restaurant.rating, 0) / restaurants.length).toFixed(1)
        : '0.0';

    return {
      totalRestaurants: restaurants.length,
      totalMenuItems: menuItems.length,
      totalOrders: Array.isArray(orders) ? orders.length : 0,
      averageRating,
      revenueEstimate: totalRevenue,
    };
  }, [menuItems.length, orders, restaurants]);

  if (!isDeveloper) {
    return <Navigate to="/" replace />;
  }

  const handleRestaurantSubmit = (event) => {
    event.preventDefault();

    const newRestaurant = {
      id: Date.now(),
      name: restaurantForm.name,
      cuisine: restaurantForm.cuisine.split(',').map((item) => item.trim()),
      deliveryTime: Number(restaurantForm.deliveryTime),
      priceForTwo: Number(restaurantForm.priceForTwo),
      rating: Number(restaurantForm.rating),
      offer: restaurantForm.offer,
      image: restaurantForm.image,
      promoted: restaurantForm.promoted,
      menu: [],
    };

    setRestaurants((prev) => [newRestaurant, ...prev]);
    setRestaurantForm(restaurantDefaults);
    setActiveView('restaurants');
    setStatusMessage(`${newRestaurant.name} was added to the restaurant catalog.`);
  };

  const handleMenuSubmit = (event) => {
    event.preventDefault();

    const newItem = {
      id: `admin-${Date.now()}`,
      name: menuForm.name,
      price: Number(menuForm.price),
      description: menuForm.description,
      category: menuForm.category,
      veg: menuForm.veg,
      rating: Number(menuForm.rating),
      image: menuForm.image,
    };

    setMenuItems((prev) => [newItem, ...prev]);
    setMenuForm(menuDefaults);
    setActiveView('menu');
    setStatusMessage(`${newItem.name} was added to the menu editor.`);
  };

  const handleDeleteRestaurant = (restaurantId) => {
    setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== restaurantId));
    setStatusMessage('Restaurant removed from the admin catalog.');
  };

  const handleDeleteMenuItem = (itemId) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    setStatusMessage('Menu item removed from the admin catalog.');
  };

  const handleTogglePromotion = (restaurantId) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === restaurantId ? { ...restaurant, promoted: !restaurant.promoted } : restaurant
      )
    );
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'restaurants', label: 'Restaurants' },
    { key: 'menu', label: 'Menu' },
    { key: 'orders', label: 'Orders' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div>
          <p className="admin-eyebrow">Developer control center</p>
          <h1>All-purpose admin panel</h1>
          <p>Manage restaurants, menu items, and customer orders from one polished workspace.</p>
        </div>
        <div className="admin-hero-actions">
          <span className="admin-pill active">Live</span>
          <span className="admin-pill">Local storage</span>
        </div>
      </div>

      <div className="admin-status-bar">
        <span>{statusMessage}</span>
        <span>Signed in as {user?.name || 'admin'}</span>
      </div>

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`admin-tab ${activeView === tab.key ? 'active' : ''}`}
            onClick={() => setActiveView(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeView === 'overview' && (
        <div className="admin-grid">
          <div className="admin-card stats-card">
            <h3>Total restaurants</h3>
            <p className="admin-card-value">{stats.totalRestaurants}</p>
          </div>
          <div className="admin-card stats-card">
            <h3>Total menu items</h3>
            <p className="admin-card-value">{stats.totalMenuItems}</p>
          </div>
          <div className="admin-card stats-card">
            <h3>Orders today</h3>
            <p className="admin-card-value">{stats.totalOrders}</p>
          </div>
          <div className="admin-card stats-card">
            <h3>Average rating</h3>
            <p className="admin-card-value">{stats.averageRating} ★</p>
          </div>

          <div className="admin-card wide-card">
            <h3>Quick actions</h3>
            <div className="admin-quick-actions">
              <button onClick={() => setActiveView('restaurants')}>Add restaurant</button>
              <button onClick={() => setActiveView('menu')}>Add menu item</button>
              <button onClick={() => setActiveView('orders')}>Review orders</button>
            </div>
          </div>

          <div className="admin-card wide-card">
            <h3>Recent orders</h3>
            <div className="admin-list">
              {orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="admin-list-item">
                    <div>
                      <strong>{order.restaurantName || 'Restaurant'}</strong>
                      <p>{order.items?.map((item) => item.name).join(', ') || 'Order placed'}</p>
                    </div>
                    <span className="admin-badge">{order.status || 'Delivered'}</span>
                  </div>
                ))
              ) : (
                <p className="admin-empty-state">No orders have been placed yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeView === 'restaurants' && (
        <div className="admin-grid admin-grid-two">
          <div className="admin-card">
            <h3>Add restaurant</h3>
            <form onSubmit={handleRestaurantSubmit} className="admin-form">
              <input value={restaurantForm.name} onChange={(event) => setRestaurantForm({ ...restaurantForm, name: event.target.value })} placeholder="Restaurant name" required />
              <input value={restaurantForm.cuisine} onChange={(event) => setRestaurantForm({ ...restaurantForm, cuisine: event.target.value })} placeholder="Cuisine (comma separated)" required />
              <input value={restaurantForm.deliveryTime} onChange={(event) => setRestaurantForm({ ...restaurantForm, deliveryTime: event.target.value })} placeholder="Delivery time" type="number" required />
              <input value={restaurantForm.priceForTwo} onChange={(event) => setRestaurantForm({ ...restaurantForm, priceForTwo: event.target.value })} placeholder="Price for two" type="number" required />
              <input value={restaurantForm.rating} onChange={(event) => setRestaurantForm({ ...restaurantForm, rating: event.target.value })} placeholder="Rating" step="0.1" type="number" required />
              <input value={restaurantForm.offer} onChange={(event) => setRestaurantForm({ ...restaurantForm, offer: event.target.value })} placeholder="Offer text" required />
              <input value={restaurantForm.image} onChange={(event) => setRestaurantForm({ ...restaurantForm, image: event.target.value })} placeholder="Image URL" required />
              <label className="admin-toggle">
                <input type="checkbox" checked={restaurantForm.promoted} onChange={(event) => setRestaurantForm({ ...restaurantForm, promoted: event.target.checked })} />
                Highlight as promoted
              </label>
              <button type="submit">Save restaurant</button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Restaurant catalog</h3>
            <div className="admin-list">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="admin-list-item admin-list-item-stack">
                  <div>
                    <strong>{restaurant.name}</strong>
                    <p>{restaurant.cuisine?.join(', ') || 'Cuisine pending'}</p>
                  </div>
                  <div className="admin-list-actions">
                    <button className="admin-inline-btn" onClick={() => handleTogglePromotion(restaurant.id)}>
                      {restaurant.promoted ? 'Demote' : 'Promote'}
                    </button>
                    <button className="admin-inline-btn danger" onClick={() => handleDeleteRestaurant(restaurant.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'menu' && (
        <div className="admin-grid admin-grid-two">
          <div className="admin-card">
            <h3>Add menu item</h3>
            <form onSubmit={handleMenuSubmit} className="admin-form">
              <input value={menuForm.name} onChange={(event) => setMenuForm({ ...menuForm, name: event.target.value })} placeholder="Dish name" required />
              <input value={menuForm.price} onChange={(event) => setMenuForm({ ...menuForm, price: event.target.value })} placeholder="Price" type="number" required />
              <input value={menuForm.description} onChange={(event) => setMenuForm({ ...menuForm, description: event.target.value })} placeholder="Description" required />
              <select value={menuForm.category} onChange={(event) => setMenuForm({ ...menuForm, category: event.target.value })}>
                <option value="pizza">Pizza</option>
                <option value="burger">Burger</option>
                <option value="biryani">Biryani</option>
                <option value="chinese">Chinese</option>
                <option value="southIndian">South Indian</option>
                <option value="northIndian">North Indian</option>
                <option value="dessert">Dessert</option>
                <option value="drinks">Drinks</option>
                <option value="rolls">Rolls</option>
                <option value="pasta">Pasta</option>
              </select>
              <input value={menuForm.rating} onChange={(event) => setMenuForm({ ...menuForm, rating: event.target.value })} placeholder="Rating" step="0.1" type="number" required />
              <input value={menuForm.image} onChange={(event) => setMenuForm({ ...menuForm, image: event.target.value })} placeholder="Image URL" required />
              <label className="admin-toggle">
                <input type="checkbox" checked={menuForm.veg} onChange={(event) => setMenuForm({ ...menuForm, veg: event.target.checked })} />
                Vegetarian
              </label>
              <button type="submit">Save menu item</button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Menu editor</h3>
            <div className="admin-list">
              {menuItems.map((item) => (
                <div key={item.id} className="admin-list-item admin-list-item-stack">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </div>
                  <div className="admin-list-actions">
                    <span className="admin-badge">₹{item.price}</span>
                    <button className="admin-inline-btn danger" onClick={() => handleDeleteMenuItem(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'orders' && (
        <div className="admin-card">
          <h3>Customer orders</h3>
          <div className="admin-list">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="admin-list-item admin-list-item-stack">
                  <div>
                    <strong>{order.restaurantName || 'Restaurant'}</strong>
                    <p>{order.items?.map((item) => item.name).join(', ') || 'No items listed'}</p>
                  </div>
                  <div className="admin-list-actions">
                    <span className="admin-badge">{order.status || 'Delivered'}</span>
                    <span className="admin-badge muted">₹{order.total || 0}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="admin-empty-state">No orders have been placed yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
