import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function CreateUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5001/api/admin/users", user);
    navigate("/admin/users");
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-5 w-full">
        <h1 className="text-2xl font-bold mb-4">Add New User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Password"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
