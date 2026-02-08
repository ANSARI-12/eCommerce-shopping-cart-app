import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ItemList from "./components/ItemList";
import Cart from "./components/Cart";
import OrderHistory from "./components/OrderHistory";
import AddItem from "./components/AddItem";
import Wishlist from "./components/Wishlist";

const API_BASE = "http://localhost:3000/api";

function App() {
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/carts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const addToCart = async (itemId) => {
    try {
      await axios.post(
        `${API_BASE}/carts`,
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const addToWishlist = async (itemId) => {
    try {
      await axios.post(
        `${API_BASE}/wishlist`,
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error adding to wishlist:", err);
    }
  };

  const handleItemAdded = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <BrowserRouter>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <div className="bg-gray-900 min-h-screen">
          <Navbar cartCount={cart?.items?.length || 0} user={user} />
          <Routes>
            <Route
              path="/"
              element={
                <ItemList
                  addToCart={addToCart}
                  addToWishlist={addToWishlist}
                  user={user}
                />
              }
            />
            <Route
              path="/add-item"
              element={<AddItem onItemAdded={handleItemAdded} />}
            />
            <Route
              path="/cart"
              element={
                <Cart cart={cart} setCart={setCart} fetchCart={fetchCart} />
              }
            />
            <Route
              path="/wishlist"
              element={<Wishlist addToCart={addToCart} />}
            />
            <Route path="/orders" element={<OrderHistory />} />
          </Routes>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
