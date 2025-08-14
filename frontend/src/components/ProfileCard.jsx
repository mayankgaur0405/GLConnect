import { Link } from "react-router-dom";

export default function ProfileCard({ user }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "10px"
      }}
    >
      <h3>{user.name}</h3>
      <p style={{ color: "#555" }}>@{user.username}</p> {/* ✅ Username display */}
      <p>
        {user.course} - {user.branch} | Year {user.year}
      </p>
      <Link to={`/profile/${user._id}`}>View Profile</Link>
    </div>
  );
}
