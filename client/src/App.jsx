import { Routes, Route } from "react-router-dom";

import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
