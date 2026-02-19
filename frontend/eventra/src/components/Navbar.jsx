import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const logOut = () => {
    localStorage.clear();
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <nav>
      <Link to="/" className="logo">
        Eventra
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            {user.role === "admin" ? (
              <>
                <Link to="/user">My Profile</Link>
                <Link to="/admin">Admin Dashboard</Link>
              </>
            ) : (
              <Link to="/user">My Profile</Link>
            )}

            <button onClick={logOut} className="linkish">
              Logout ({user.name})
            </button>
          </>
        ) : (
          <>
            <Link to="/loginuser">Login</Link>
            <Link to="/createuser">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
