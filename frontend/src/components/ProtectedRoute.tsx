import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("Token");
    if (!isLoggedIn) {
      navigate("/school/signin");
    }
  }, []);

  return <>{children}</>;
}

export default ProtectedRoute;

// import { ReactNode, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// interface ProtectedProps {
//   children: ReactNode;
// }

// function ProtectedRoute({ children }: ProtectedProps) {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem("Token");
//     const currentPath = window.location.pathname;

//     if (!isLoggedIn && currentPath !== "/school/signin") {
//       navigate("/school/signin");
//     }
//   }, [navigate]);

//   return <>{children}</>;
// }

// export default ProtectedRoute;