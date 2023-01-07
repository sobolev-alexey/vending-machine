import { Link } from "react-router-dom";

const CustomAuthHeader = ({ pathname }: { pathname: string }) => {
  return (
    <div className="login-header-wrapper">
      {(() => {
        switch (pathname) {
          case "/login":
          case "/buyer":
          case "/":
            return (
              <span>
                or&nbsp;
                <Link className="login-btn" to="/register">
                  Register
                </Link>
              </span>
            );
          case "/register":
            return (
              <span>
              or&nbsp;
                <Link className="login-btn" to="/">
                  Log in
                </Link>
              </span>
            );
          default:
            return;
        }
      })()}
    </div>
  );
};

export default CustomAuthHeader;
