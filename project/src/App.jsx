import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Signup from './pages/Signup';
import Restaurants from './pages/Restaurants';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import ProtectRoutes from './components/ProtectRoutes';
import Admin from './pages/Admin';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <BrowserRouter>
      <CartProvider>
        <div className="app">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<ProtectRoutes><Home /></ProtectRoutes>} />
              <Route path="/search" element={<ProtectRoutes><SearchPage /></ProtectRoutes>} />
              <Route path="/restaurants" element={<ProtectRoutes><Restaurants /></ProtectRoutes>} />
              <Route path="/offers" element={<ProtectRoutes><Offers /></ProtectRoutes>} />
              <Route path="/restaurant/:id" element={<ProtectRoutes><RestaurantDetails /></ProtectRoutes>} />
              <Route path="/cart" element={<ProtectRoutes><Cart /></ProtectRoutes>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<ProtectRoutes><Profile /></ProtectRoutes>} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
