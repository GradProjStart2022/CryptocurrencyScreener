import { Routes, Route } from "react-router-dom";

import "./App.css";

import LoginInfo from "./component/LoginInfo.jsx";
import SearchBar from "./component/SearchBar.jsx";
import SideNavBar from "./component/SideNavbar.jsx";
import { Page404 } from "./page/404";
import { GoogleLoginRedirect } from "./page/GoogleLoginRedirect";
import { KakaoLoginRedirect } from "./page/KakaoLoginRedirect";
import SigninPage from "./page/Signin.jsx";

function App() {
  const MainPage = (props) => {
    return (
      <div className="App">
        <SideNavBar />
        <div className="content-outer">
          <div className="top-bar">
            <SearchBar />
            <LoginInfo />
          </div>
          <div className="content-view">
            <p>영역구분 테스트용 텍스트</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login">
        <Route index element={<SigninPage />} />
        <Route path="kakao_complete" element={<KakaoLoginRedirect />} />
        <Route path="google_complete" element={<GoogleLoginRedirect />} />
      </Route>

      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
