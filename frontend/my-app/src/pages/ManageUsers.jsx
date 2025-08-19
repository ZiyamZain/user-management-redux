import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await axios.get("http://localhost:5001/api/admin/users");
    setUsers(data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5001/api/admin/users/${id}`);
    fetchUsers();
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-5 w-full">
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
        <input
          type="text"
          placeholder="Search users..."
          className="p-2 border rounded mb-4"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/admin/create-user"
          className="bg-green-500 text-white p-2 rounded"
        >
          Add User
        </Link>
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) =>
                user.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((user) => (
                <tr key={user._id} className="border">
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2 space-x-2">
                    <Link
                      to={`/admin/edit-user/${user._id}`}
                      className="bg-blue-500 text-white p-1 rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;
