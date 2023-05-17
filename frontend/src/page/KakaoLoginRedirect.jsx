import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, isNil } from "lodash-es";

import { CircularProgress } from "@mui/material";

import getServerUID from "../logic/getServerUID.js";
import getUserFilter from "../logic/getUserFilterFromServer.js";
import getUserFilterSettings from "../logic/getUserFilterSettings.js";
import {
  setAccname,
  setEmail,
  setToken,
  setImg,
  clearUser,
  clearUserFilter,
} from "../redux/store.js";

import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

const fail_login = (navigate) => {
  // 로그인 실패하면 로그인화면으로 돌려보냄
  alert("로그인에 실패했습니다.");
  navigate("/login", { replace: true });
};

const fail_login = (navigate) => {
  // 로그인 실패하면 로그인화면으로 돌려보냄
  alert("로그인에 실패했습니다.");
  navigate("/login", { replace: true });
};

/**
 * 카카오 로그인 리다이렉트 페이지
 * @param {any} props react props
 * @returns 사용자 안내용 페이지 요소 반환
 */
export const KakaoLoginRedirect = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const redux_filter_list = useSelector(
    (state) => state.userFilter.filter_list
  );

  const [code, setCode] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [listSuccess, setListSuccess] = useState(false);

  // query string 추출 - 페이지 이동시 1회 실행
  useEffect(() => {
    let temp_code = new URL(window.location.href).searchParams.get("code"); // 토큰이 넘어올 것임
    if (isNil(temp_code) && isEmpty(temp_code)) {
      fail_login(navigate);
    } else {
      setCode(temp_code);
    }
  }, []);

  // 토큰 추출 - code 변경시 실행
  useEffect(() => {
    if (!isEmpty(code)) {
      let jsoncode = JSON.parse(code); // 넘어온 JSON String을 object 변환

      // refresh token만 따서 localStorage에 저장
      let refresh_token = jsoncode?.refresh_token;
      localStorage.setItem("refresh_token", refresh_token);

      // access token만 따서 redux store에 저장
      let access_token = jsoncode?.access_token;
      setAccessToken(access_token);
      dispatch(setToken(access_token));
    }
  }, [code]);

  // 카카오 계정 정보 받아오기 및 복합필터 목록 불러오기
  useEffect(() => {
    const kakaoAndFilter = async () => {
      let kakao_data = "";
      let temp_email = "";
      let temp_username = "";
      let temp_userimg = "";
      let is_success = false;

      try {
        // 카카오에 계정 기본 정보 요청
        let resp = await axios.get("https://kapi.kakao.com/v2/user/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        kakao_data = resp.data?.kakao_account;
        temp_email = kakao_data?.email;
        temp_username = kakao_data?.profile?.nickname;
        temp_userimg = kakao_data?.profile?.profile_image_url;

        // 계정 이름, 이메일, 사진 URL redux store에 저장
        dispatch(setAccname(temp_username));
        dispatch(setEmail(temp_email));
        dispatch(setImg(temp_userimg));

        // 이메일 통해 DB UID 불러오기
        is_success = await getServerUID(temp_email, dispatch);

        // 사용자 필터 목록 불러오기
        is_success = await getUserFilter(temp_email, dispatch);
        setListSuccess(is_success);
      } catch (error) {
        // 카카오 서버 계정 정보 받아오는 작업 실패시
        alert("로그인 후처리 작업에 실패했습니다.\n다시 로그인해 주세요.");
        console.log("KakaoLoginRedirect err :>> ", error);
        dispatch(clearUserFilter());
        dispatch(clearUser());
        navigate("/login", { replace: true });
      }
    };

    if (!isEmpty(accessToken)) {
      kakaoAndFilter();
    }
  }, [accessToken]);

  // 필터정보목록에 대한 상세정보 갱신 로직
  useEffect(() => {
    if (listSuccess) {
      let is_success = false;
      redux_filter_list.forEach(async (value) => {
        is_success = await getUserFilterSettings(value.id, dispatch);
      });

      // 모든 작업 완료 후 홈으로 화면 전환시켜줌
      navigate("/", { replace: true });
    }
  }, [listSuccess]);

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
          }}>
          <p>로그인중입니다...</p>
          <CircularProgress />
        </div>
      </div>
    </div>
  );
};
