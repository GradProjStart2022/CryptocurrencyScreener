import { Routes, Route } from "react-router-dom";

import "./App.css";

import { Page404 } from "./page/404.jsx";
import MainPage from "./page/MainPage.jsx";
import SigninPage from "./page/Signin.jsx";
import ChartListPage from "./page/ChartListPage.jsx";
import ChartPage from "./page/ChartPage.jsx";
import FilterSettingsPage from "./page/FilterSettingsPage.jsx";
import AlarmSettingsPage from "./page/AlarmSettingsPage.jsx";
import BookmarkPage from "./page/BookmarkPage.jsx";

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
      <Route path="/chart">
        {/* todo: 전체 종목에 대한 정보 표시 페이지 생성 */}
        <Route index element={<ChartListPage />} />
        {/* todo: 종목코드를 URL param으로 가지는 종목별 페이지 생성 */}
        <Route path="종목코드" element={<ChartPage />} />
      </Route>
      {/* todo: 필터 설정 화면 생성 */}
      <Route path="/filter/:id" element={<FilterSettingsPage />} />
      {/* todo: 필터에 따른 알람 설정 화면 생성 */}
      <Route path="/alarm/:id" element={<AlarmSettingsPage />} />
      {/* todo: 사용자별 즐겨찾기 종목 페이지 생성 */}
      <Route path="/bookmark/:id" element={<BookmarkPage />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
      
  );
}

export default App;
