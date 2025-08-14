import { useState } from "react";
import api from "../api";

export default function SearchBar({ setResults }) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");

  const handleSearch = async () => {
    try {
      const res = await api.get(`/users/search`, {
        params: { username, name, collegeId, branch, year }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <input
        type="text"
        placeholder="Username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="text"
        placeholder="Name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="College ID..."
        value={collegeId}
        onChange={(e) => setCollegeId(e.target.value)}
      />

      <select value={branch} onChange={(e) => setBranch(e.target.value)}>
        <option value="">All Branches</option>
        <option value="CSE">CSE</option>
        <option value="IT">IT</option>
        <option value="ECE">ECE</option>
        <option value="ME">ME</option>
        <option value="CE">CE</option>
      </select>

      <select value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="">All Years</option>
        <option value="1">1st Year</option>
        <option value="2">2nd Year</option>
        <option value="3">3rd Year</option>
        <option value="4">4th Year</option>
      </select>

      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
