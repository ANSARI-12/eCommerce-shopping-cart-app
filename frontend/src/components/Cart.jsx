import axios from "axios";

const API_BASE = "https://ecommerce-shopping-cart-app.onrender.com/api";

function Cart({ cart, setCart, fetchCart }) {
  const token = localStorage.getItem("token");

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_BASE}/carts/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const checkout = async () => {
    try {
      await axios.post(
        `${API_BASE}/orders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      fetchCart();
    } catch (err) {
      console.error("Error during checkout:", err);
      alert("Checkout failed. Please try again.");
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Your Cart</h2>
        <p className="text-white">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Your Cart</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cart.items.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 text-white p-4 rounded shadow"
          >
            <img
              src={item.itemId.image}
              alt={item.itemId.name}
              className="w-full h-32 object-cover mb-2"
            />
            <h3 className="font-bold">{item.itemId.name}</h3>
            <p>₹ {item.itemId.price}</p>
            <p>Quantity: {item.quantity}</p>
            <button
              onClick={() => removeFromCart(item.itemId._id)}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={checkout}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
      >
        Checkout
      </button>
    </div>
  );
}

export default Cart;
