import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ProfileCard from "../components/ProfileCard";
import api from "../api";

export default function Home() {
  const [results, setResults] = useState([]);
  const [randomUsers, setRandomUsers] = useState([]);

  // Fetch random users
  const fetchRandom = async () => {
    try {
      const res = await api.get("/users/random", { params: { limit: 6 } });
      setRandomUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRandom();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Find Peers</h1>
      <SearchBar setResults={setResults} />

      {results.length > 0 ? (
        <>
          <h2>Search Results</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
            {results.map((user) => (
              <ProfileCard key={user._id} user={user} />
            ))}
          </div>
        </>
      ) : (
        <>
          <h2>Random Students</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
            {randomUsers.map((user) => (
              <ProfileCard key={user._id} user={user} />
            ))}
          </div>
          <button
            style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
            onClick={fetchRandom}
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}
