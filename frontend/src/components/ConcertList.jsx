import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

function ConcertList({ addToCart }) {
  const [concerts, setConcerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/concerts`);
        setConcerts(res.data);
      } catch (err) {
        console.error("Error fetching concerts:", err);
        setConcerts([]);
      }
    };
    fetchConcerts();
  }, []);

  const filteredConcerts = concerts.filter(
    (concert) =>
      concert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concert.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search concerts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredConcerts.map((concert) => (
          <div
            key={concert._id}
            className="bg-gray-800 text-white p-4 rounded shadow"
          >
            <img
              src={
                concert.image
                  ? `http://localhost:3000/images/${concert.image
                      .split("/")
                      .pop()}`
                  : "https://via.placeholder.com/150"
              }
              alt={concert.name}
              className="w-full h-40 object-cover"
            />
            <h2 className="font-bold mt-2">{concert.name}</h2>
            <p className="text-sm text-gray-300">by {concert.artist}</p>
            <p className="text-sm">Venue: {concert.venue}</p>
            <p className="text-sm">
              Date: {new Date(concert.date).toLocaleDateString()}
            </p>
            <p>₹ {concert.price}</p>
            <button
              onClick={() => addToCart(concert._id)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Book Ticket
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConcertList;
