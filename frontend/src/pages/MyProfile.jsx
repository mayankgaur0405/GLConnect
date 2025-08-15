import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for redirect
import api from "../api";

// ✅ Helper to decode JWT
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [newSection, setNewSection] = useState({
    type: "topic",
    title: "",
    resources: [{ name: "", type: "", url: "" }],
  });

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let userId = localStorage.getItem("userId");

  // ✅ Fallback: extract from token if not in localStorage
  if (!userId && token) {
    const payload = parseJwt(token);
    if (payload?.id) {
      userId = payload.id;
      localStorage.setItem("userId", userId);
    }
  }

  // ✅ Fetch logged in user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !userId) {
        console.warn("User not logged in, redirecting...");
        navigate("/login");
        return;
      }

      try {
        const res = await api.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("❌ Profile fetch failed:", err);
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/login");
        }
      }
    };
    fetchProfile();
  }, [navigate, token, userId]);

  // ✅ Add new section
  const handleAddSection = async () => {
    try {
      const res = await api.post(
        `/users/${userId}/sections`,
        newSection,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev) => ({
        ...prev,
        sections: [...prev.sections, res.data.section],
      }));
      setNewSection({
        type: "topic",
        title: "",
        resources: [{ name: "", type: "", url: "" }],
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete section
  const handleDeleteSection = async (sectionId) => {
    try {
      await api.delete(`/users/${userId}/sections/${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser((prev) => ({
        ...prev,
        sections: prev.sections.filter((s) => s._id !== sectionId),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Profile</h1>
      <p>
        {user.name} (@{user.username})
      </p>

      <h2>Sections</h2>
      {user.sections && user.sections.length > 0 ? (
        user.sections.map((section) => (
          <div
            key={section._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{section.title}</h3>
            <p>Type: {section.type}</p>
            <button onClick={() => handleDeleteSection(section._id)}>
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No sections yet.</p>
      )}

      <h2>Add New Section</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>Type: </label>
        <select
          value={newSection.type}
          onChange={(e) =>
            setNewSection({ ...newSection, type: e.target.value })
          }
        >
          <option value="topic">Topic</option>
          <option value="semester">Semester</option>
        </select>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Title: </label>
        <input
          type="text"
          value={newSection.title}
          onChange={(e) =>
            setNewSection({ ...newSection, title: e.target.value })
          }
        />
      </div>
      <div>
        <h4>Resources</h4>
        {newSection.resources.map((res, idx) => (
          <div key={idx} style={{ marginBottom: "5px" }}>
            <input
              type="text"
              placeholder="Name"
              value={res.name}
              onChange={(e) => {
                const updated = [...newSection.resources];
                updated[idx].name = e.target.value;
                setNewSection({ ...newSection, resources: updated });
              }}
            />
            <input
              type="text"
              placeholder="Type (pdf/link)"
              value={res.type}
              onChange={(e) => {
                const updated = [...newSection.resources];
                updated[idx].type = e.target.value;
                setNewSection({ ...newSection, resources: updated });
              }}
            />
            <input
              type="text"
              placeholder="URL"
              value={res.url}
              onChange={(e) => {
                const updated = [...newSection.resources];
                updated[idx].url = e.target.value;
                setNewSection({ ...newSection, resources: updated });
              }}
            />
          </div>
        ))}
      </div>
      <button onClick={handleAddSection}>Add Section</button>
    </div>
  );
}