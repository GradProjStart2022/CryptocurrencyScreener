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
import { KakaoLoginRedirect } from "./page/KakaoLoginRedirect";
import { GoogleLoginRedirect } from "./page/GoogleLoginRedirect";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      {/* 로그인 페이지 및 후처리 페이지 */}
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
      {/* 사용자별 즐겨찾기 목록 페이지 */}
      <Route path="/bookmark/:id" element={<BookmarkPage />} />
      {/* 없는 경로들 404 페이지 처리 */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
