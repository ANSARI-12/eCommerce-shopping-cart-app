import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://ecommerce-shopping-cart-app.onrender.com/api";

function AddItem({ onItemAdded }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [useExisting, setUseExisting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${API_BASE}/images`);
        setExistingImages(res.data);
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    };
    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("quantity", quantity);
    if (useExisting && selectedImage) {
      formData.append("existingImage", selectedImage);
    } else if (image) {
      formData.append("image", image);
    }

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`${API_BASE}/items`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Item added successfully!");
      setName("");
      setPrice("");
      setDescription("");
      setQuantity("");
      setImage(null);
      setSelectedImage("");
      setUseExisting(false);
      if (onItemAdded) onItemAdded(res.data);
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            rows="3"
          />
        </div>
        <div>
          <label className="block mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block mb-1">
            <input
              type="checkbox"
              checked={useExisting}
              onChange={(e) => setUseExisting(e.target.checked)}
              className="mr-2"
            />
            Use existing image
          </label>
          {useExisting ? (
            <select
              value={selectedImage}
              onChange={(e) => setSelectedImage(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="">Select an image</option>
              {existingImages.map((img) => (
                <option key={img} value={img}>
                  {img}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
}

export default AddItem;
