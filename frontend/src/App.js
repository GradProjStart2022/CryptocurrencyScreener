import { Routes, Route } from "react-router-dom";

import "./App.css";

import MainPage from "./page/MainPage.jsx";
import SigninPage from "./page/Signin.jsx";
import { Page404 } from "./page/404.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<SigninPage />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
