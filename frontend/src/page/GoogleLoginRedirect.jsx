import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CircularProgress } from "@mui/material";

import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

/**
 * 구글 로그인 리다이렉트 페이지
 * @param {*} param0 react-router-dom의 history props
 * @returns 사용자 안내용 페이지 요소 반환
 */
export const GoogleLoginRedirect = () => {
  const navigate = useNavigate();

  // 쿼리 스트링 인가코드 획득
  let code = new URL(window.location.href).searchParams.get("code");
  console.log("code :>> ", code);

  if (code !== null) {
    alert("code :>> ", code);
    navigate("/");
  }

  useEffect(() => {}, []);

  return (
    <div className="App">
      <SideNavBar />
      <div className="content-outer">
        <div className="top-bar">
          <SearchBar />
        </div>
        <div
          className="content-view"
          style={{
            display: "flex",
            justifyContentL: "center",
            alignItems: "center",
          }}
        >
          <p>로그인중입니다...</p>
          <CircularProgress />
        </div>
      </div>
    </div>
  );
};
