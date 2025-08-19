import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5 fixed">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <ul>
        <li className="mb-3">
          <Link to="/admin" className="hover:text-gray-400">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="hover:text-gray-400">
            Manage Users
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
