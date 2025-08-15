import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);

        if (
          res.data.followers?.some((uid) => uid.toString() === currentUserId)
        ) {
          setIsFollowing(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id, currentUserId]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await api.post(
          `/users/unfollow/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser((prev) => ({
          ...prev,
          followers: prev.followers.filter((uid) => uid !== currentUserId),
        }));
      } else {
        await api.post(
          `/users/follow/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser((prev) => ({
          ...prev,
          followers: [...prev.followers, currentUserId],
        }));
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>
        {user.name} <span style={{ color: "gray" }}>@{user.username}</span>
      </h1>
      <p>
        {user.course} - {user.branch} | Year {user.year}
      </p>
      <p>
        {user.followers?.length || 0} Followers | {user.following?.length || 0}{" "}
        Following
      </p>

      {currentUserId !== user._id && (
        <button onClick={handleFollowToggle}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      <h2 style={{ marginTop: "20px" }}>Resources</h2>
      {user.sections && user.sections.length > 0 ? (
        user.sections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: "20px" }}>
            <h3>{section.title}</h3>

            {/* 🔹 Agar semester hai toh subjects dikhao */}
            {section.type === "semester" ? (
              section.subjects.map((subj, sIdx) => (
                <div
                  key={sIdx}
                  style={{ marginLeft: "20px", marginBottom: "10px" }}
                >
                  <h4>{subj.name}</h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: "10px",
                    }}
                  >
                    {subj.resources.map((res, rIdx) => (
                      <div
                        key={rIdx}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          padding: "10px",
                        }}
                      >
                        <h5>{res.name}</h5>
                        <p>Type: {res.type}</p>
                        <a href={res.url} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              /* 🔹 Agar topic hai toh sidhe resources dikhao */
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "10px",
                }}
              >
                {section.resources.map((res, rIdx) => (
                  <div
                    key={rIdx}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "10px",
                    }}
                  >
                    <h4>{res.name}</h4>
                    <p>Type: {res.type}</p>
                    <a href={res.url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No resources added yet.</p>
      )}
    </div>
  );
}
