import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get(`/users/search?username=&id=${id}`);
      setUser(res.data[0]);
    };
    fetchUser();
  }, [id]);

  const handleFollow = async () => {
    try {
      await api.post(
        `/api/users/follow/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Followed!");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{user.username}</h2>
      <p>{user.department} - Year {user.year}</p>
      <button onClick={handleFollow}>Follow</button>
    </div>
  );
}
