import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NavBar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  if (location.pathname === "/dashboard") {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <button className="btn btn-danger ms-auto" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                to={"/"}
                className="btn btn-primary nav-link "
                aria-current="page"
              >
                SignUp
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/login"} className="btn btn-primary nav-link ">
                SignIn
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
