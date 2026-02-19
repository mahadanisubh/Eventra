import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return <Navigate to="/loginuser" replace />;
  }

  try {
    const user = JSON.parse(storedUser);

    if (user.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    console.error("Invalid user data");
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;
