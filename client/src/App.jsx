import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import Home from "./components/chatHome/Home";

function App() {
  const auth = useSelector((state) => state.auth.isAuthenticate);

  return (
    <>
      <Routes>
        {!auth && <Route path="/" element={<Login />} />}
        <Route path="/signup" element={<Signup />} />
        {auth && <Route path="/home" element={<Home />} />}
        {!auth ? (
          <Route path="*" element={<Navigate to="/" />} />
        ) : (
          <Route path="*" element={<Navigate to="/home" />} />
        )}
      </Routes>
    </>
  );
}

export default App;
