import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccname, setEmail, setToken, setImg } from "../redux/store.js";

import { CircularProgress } from "@mui/material";

import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

/**
 * 카카오 로그인 리다이렉트 페이지
 * @param {any} props react-router-dom의 history props
 * @returns 사용자 안내용 페이지 요소 반환
 */
export const KakaoLoginRedirect = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 페이지 이동시 1회 실행
  useEffect(() => {
    let code = new URL(window.location.href).searchParams.get("code"); // 토큰이 넘어올 것임

    if (code !== null) {
      let jsoncode = JSON.parse(code); // 넘어온 JSON String을 object 변환

      // refresh token만 따서 localStorage에 저장
      let refresh_token = jsoncode?.refresh_token;
      localStorage.setItem("refresh_token", refresh_token);

      // access token만 따서 redux store에 저장
      let access_token = jsoncode?.access_token;
      dispatch(setToken(access_token));

      // 토큰 받고 로그인됐으니 카카오 서버에서 계정 정보 받아옴
      axios
        .get("https://kapi.kakao.com/v2/user/me", {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((resp) => {
          // resp 데이터에서 이메일, 계정 이름, 사진 URL 추출
          let kakao_data = resp.data?.kakao_account;
          let temp_email = kakao_data?.email;
          let temp_username = kakao_data?.profile?.nickname;
          let temp_userimg = kakao_data?.profile?.profile_image_url;

          // 계정 이름, 사진 URL redux store에 저장
          dispatch(setAccname(temp_username));
          dispatch(setEmail(temp_email));
          dispatch(setImg(temp_userimg));

          // 모든 작업 완료 후 홈으로 화면 전환시켜줌
          navigate("/", { replace: true });
        })
        .catch((err) => {
          // 카카오 서버 계정 정보 받아오는 작업 실패시
          window.alert(
            "로그인 후처리 작업에 실패했습니다.\n다시 로그인해 주세요."
          );
          dispatch(setToken(""));
          console.log("err :>> ", err);
          navigate("/login", { replace: true });
        });
    } else {
      // 로그인 실패하면 로그인화면으로 돌려보냄
      window.alert("로그인에 실패했습니다.");
      navigate("/login", { replace: true });
    }
  }, []);

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
            justifyContent: "center",
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
