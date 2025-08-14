import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    name: "",
    collegeId: "",
    course: "",
    branch: "",
    year: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Something went wrong";
      alert(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} />

      <input name="name" placeholder="Full Name" onChange={handleChange} />
      <input
        name="collegeId"
        placeholder="College ID"
        onChange={handleChange}
      />
      <input name="course" placeholder="Course" onChange={handleChange} />
      <input name="branch" placeholder="Branch" onChange={handleChange} />
      <input
        name="year"
        type="number"
        placeholder="Year"
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button type="submit">Register</button>
    </form>
  );
}
