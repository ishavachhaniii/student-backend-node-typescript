import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";
import StudentForm from "./components/StudentForm";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import StudentList from "./components/Home";
import StudentUpdate from "./components/UpdateStudent";
import ProtectedRoute from "./components/ProtectedRoute"; 
import ViewStudent from "./components/ViewStudent";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
    <Routes>
      <Route path="/school/signup" element={<SignUp />} />
      <Route path="/school/signin" element={<SignIn />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <StudentList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/update/:studentId"
        element={
          <ProtectedRoute>
            <StudentUpdate />
          </ProtectedRoute>
        }
      />
    <Route
        path="/student/:studentId"
        element={
          <ProtectedRoute>
            <ViewStudent />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
  );
}

export default App;
