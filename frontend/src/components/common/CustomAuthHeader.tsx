import { Link } from "react-router-dom";

const CustomAuthHeader = ({ pathname }: { pathname: string }) => {
  return (
    <div className="login-header-wrapper">
      {(() => {
        switch (pathname) {
          case "/login":
          case "/":
            return (
              <Link className="login-btn" to="/register">
                Register
              </Link>
            );
          case "/register":
            return (
              <Link className="login-btn" to="/">
                Log in
              </Link>
            );
          default:
            return;
        }
      })()}
    </div>
  );
};

export default CustomAuthHeader;
