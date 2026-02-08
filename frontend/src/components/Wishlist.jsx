import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://ecommerce-shopping-cart-app.onrender.com/api";

function Wishlist({ addToCart }) {
  const [wishlist, setWishlist] = useState({ items: [] });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${API_BASE}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const removeFromWishlist = async (itemId) => {
    try {
      await axios.delete(`${API_BASE}/wishlist/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item._id !== itemId),
      }));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {wishlist.items.length === 0 ? (
        <p className="text-white text-3xl text-center pt-40 font-bold">
          Your wishlist is empty.
        </p>
      ) : (
        wishlist.items.map((item) => (
          <div
            key={item._id}
            className="bg-gray-800 text-white p-4 rounded shadow"
          >
            <img
              src={
                item.image
                  ? `http://localhost:3000/images/${item.image
                      .split("/")
                      .pop()}`
                  : "https://via.placeholder.com/150"
              }
              alt={item.name}
              className="w-full h-40 object-cover"
            />
            <h2 className="font-bold mt-2">{item.name}</h2>
            <p>₹ {item.price}</p>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => addToCart(item._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;
