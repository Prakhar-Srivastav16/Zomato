import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { cartCount, user, logoutUser } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isEnvDev = import.meta.env.VITE_IS_DEV === 'true';
  const devEmail = import.meta.env.VITE_DEV_EMAIL;
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const isDeveloper = isEnvDev || isLocal || (user && devEmail && user.email === devEmail);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <nav className={`navbar ${scrolled || !isHome ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-text">Zomato</span>
          </Link>

          <div className="navbar-search-desktop">
            <form className="navbar-search-form" onSubmit={handleSearch}>
              <span className="navbar-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search restaurants, cuisines, dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="navbar-links">
            <button
              className="navbar-search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              🔍
            </button>
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <Link to="/restaurants" className="navbar-link">
              Restaurants
            </Link>
            <Link to="/offers" className="navbar-link">
              Offers
            </Link>
            <Link to="/orders" className="navbar-link">
              Orders
            </Link>
            {isDeveloper && (
              <Link to="/admin" className="navbar-link">
                Admin
              </Link>
            )}
            <Link to="/cart" className="navbar-link navbar-cart-link">
              <span className="navbar-cart-icon">🛒</span>
              {cartCount > 0 && <span className="navbar-cart-count">{cartCount}</span>}
            </Link>
            {user ? (
              <div className="navbar-user">
                <Link to="/profile" className="navbar-link navbar-profile">
                  <span className="navbar-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  {user.name.split(' ')[0]}
                </Link>
                <button className="navbar-logout" onClick={logoutUser}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="navbar-link navbar-login-btn">
                  Login
                </Link>
                <Link to="/signup" className="navbar-link navbar-signup-btn">
                  Sign Up
                </Link>
              </>
            )}
            <button
              className="navbar-darkmode-toggle"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀' : '☾'}
            </button>
          </div>

          <button
            className="navbar-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {searchOpen && (
          <div className="navbar-search-mobile">
            <form onSubmit={handleSearch}>
              <span className="navbar-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search restaurants, cuisines, dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        )}
      </nav>

      <div className={`navbar-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="navbar-mobile-link">Home</Link>
        <Link to="/restaurants" className="navbar-mobile-link">Restaurants</Link>
        <Link to="/offers" className="navbar-mobile-link">Offers</Link>
        <Link to="/orders" className="navbar-mobile-link">Orders</Link>
        {isDeveloper && <Link to="/admin" className="navbar-mobile-link">Admin</Link>}
        <Link to="/cart" className="navbar-mobile-link">
          Cart {cartCount > 0 && `(${cartCount})`}
        </Link>
        {user ? (
          <>
            <Link to="/profile" className="navbar-mobile-link">Profile</Link>
            <button className="navbar-mobile-link navbar-mobile-logout" onClick={logoutUser}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-mobile-link">Login</Link>
            <Link to="/signup" className="navbar-mobile-link">Sign Up</Link>
          </>
        )}
      </div>
      {menuOpen && <div className="navbar-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default Navbar;
