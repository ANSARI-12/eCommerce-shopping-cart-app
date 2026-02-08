import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

function Navbar({ cartCount, user }) {
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${API_BASE}/users/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-white text-lg hover:text-gray-200">
        Shopping Cart
      </Link>

      <div className="flex space-x-4">
        <Link
          to="/"
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
        >
          Home
        </Link>
        {user?.role === "admin" && (
          <Link
            to="/add-item"
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
          >
            Add Item
          </Link>
        )}
        {user?.role !== "admin" && (
          <>
            <Link
              to="/cart"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
            >
              Cart ({cartCount})
            </Link>
            <Link
              to="/wishlist"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
            >
              Wishlist
            </Link>
            <Link
              to="/orders"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
            >
              Order History
            </Link>
          </>
        )}
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
