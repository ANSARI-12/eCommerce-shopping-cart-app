import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Heart, Trash2 } from "lucide-react";
import shoesImg from "../assets/shoe.jpeg";
import watchImg from "../assets/watch.jpeg";
import bagImg from "../assets/schoolBag.jpeg";
const API_BASE = "https://ecommerce-shopping-cart-app.onrender.com/api";

function ItemList({ addToCart, addToWishlist, user }) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const handleDelete = async (itemId) => {
    if (!token) return;
    try {
      await axios.delete(`${API_BASE}/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${API_BASE}/items`);
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);

        // Dummy fallback data
        setItems([
          {
            _id: "1",
            name: "Shoes",
            price: 2000,
            image: shoesImg,
          },
          {
            _id: "2",
            name: "Watch",
            price: 1500,
            image: watchImg,
          },
          {
            _id: "3",
            name: "Bag",
            price: 1000,
            image: bagImg,
          },
        ]);
      }
    };

    fetchItems();
  }, []);

  // 🔎 Search filter
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Search */}
      {user?.role !== "admin" && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white outline-none"
          />
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          // Handle image path safely
          const imageSrc =
            typeof item.image === "string"
              ? item.image.startsWith("http")
                ? item.image
                : item.image.startsWith("/")
                ? item.image
                : `https://ecommerce-shopping-cart-app.onrender.com/images/${item.image}`
              : item.image;

          return (
            <div
              key={item._id}
              className="bg-gray-800 text-white p-4 rounded shadow hover:shadow-lg transition"
            >
              <img
                src={imageSrc}
                alt={item.name}
                className="w-full h-40 object-cover rounded"
              />

              <h2 className="font-bold mt-2">{item.name}</h2>

              <p className="text-gray-300">₹ {item.price}</p>

              {user?.role === "admin" && (
                <p className="text-gray-300">Quantity: {item.quantity}</p>
              )}

              {/* Buttons */}
              <div className="flex space-x-2 mt-3">
                {user?.role !== "admin" && (
                  <>
                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                    >
                      <ShoppingCart size={16} />
                      Cart
                    </button>
                    <button
                      onClick={() => addToWishlist(item._id)}
                      className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      <Heart size={16} />
                      Wishlist
                    </button>
                  </>
                )}

                {user?.role === "admin" && (
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ItemList;
