import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle, linkText, linkPath }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        </div>
        {children}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {linkText}{" "}
            <Link
              to={linkPath}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {linkPath === "/login" ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 