import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 shadow">
      <h1 className="text-xl font-bold">Dev2Gether</h1>
      
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/my-profile">My Profile</Link> {/* 👈 Ye add karna hai */}
      </div>
    </nav>
  );
}
