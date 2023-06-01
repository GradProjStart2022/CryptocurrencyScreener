/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Grid } from "@mui/material";
import {
  CryptoCurrencyMarket,
  MiniChart,
  TickerTape,
} from "react-ts-tradingview-widgets";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { isEmpty } from "lodash-es";
import { useEffect, useState } from "react";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import { setBookmark } from "../redux/store.js";

const ATTENTION_URL = "http://localhost:8000/users/api/attention/";
const CHART_REDIRECT_URL = "http://localhost:3000/chart/tdview_widget";

const reqLoginCss = css({
  background: "rgba(34,34,34,0.2)",
  height: "30vh",
  margin: "12px 0px 12px 0px",
  display: "flex",
  flexDirection: "column",
  alignContent: "center",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  borderRadius: "4px",
});

/**
 * 비로그인시 즐겨찾기를 대체하는 컴포넌트
 * @param {any} props react props
 * @returns 로그인 안내 UI 컴포넌트
 */
const NotLogin = (props) => {
  const navigate = props.navigate;
  return (
    <div css={reqLoginCss}>
      <h3>로그인하고 관심 종목을 등록해보세요</h3>
      <div style={{ width: "2vw", height: "2vw" }} />
      <button
        type="button"
        className="login-btn"
        onClick={() => {
          navigate("/login");
          // navigate("/testpage");
        }}>
        로그인
        {/* 테스트페이지 */}
      </button>
    </div>
  );
};

/**
 * 로그인시 즐겨찾기 표시하는 컴포넌트
 * @param {any} props react props
 * @returns 즐겨찾기 요소 UI 컴포넌트
 */
const LoginBookmark = (props) => {
  const bookmarks = useSelector((state) => state.userBookmark.bookmarks);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {bookmarks.map((data, index) => (
        <div key={index} style={{ margin: "15px" }}>
          <MiniChart symbol={data.symbol} width="99%" />
        </div>
      ))}
    </div>
  );
};

/**
 * 메인화면 UI 요소 뱉어내는 함수
 * @param {any} props react props
 * @returns 메인화면 UI
 */
const MainPage = (props) => {
  // let [isLogin, setIsLogin] = useState(false);
  let uid = useSelector((state) => state.user.uid);
  let email = useSelector((state) => state.user.email);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (uid !== -1) {
      // 로그인이 되었을 때 즐겨찾기 정보를 가져오는 코드
      axios
        .get(`${ATTENTION_URL}?email=${email}`) // 즐겨찾기 정보를 가져오는 API 호출
        .then((response) => {
          console.log(response.data);
          dispatch(setBookmark(response.data)); // 가져온 즐겨찾기 정보를 redux store에 저장
        })
        .catch((err) => {
          console.log("MainPage UseEffect err>>>", err);
          alert("즐겨찾기 조회에 문제가 있습니다.\n다시 접속해주세요.");
          navigate("/", { replace: true });
        });
    }
  }, [uid, dispatch]);

  return (
    <div className="App">
      <SideNavBar />
      <div className="content-outer">
        <div className="top-bar">
          <SearchBar />
          <LoginInfo />
        </div>
        <div className="content-view">
          <Grid
            container
            spacing={2}
            sx={{ marginLeft: "12px", marginTop: "24px" }}>
            <Grid item xs={9}>
              {/* todo: 로그인 되었을때 연동 확인 및 디자인 필요 */}
              {uid !== -1 ? (
                <LoginBookmark />
              ) : (
                <NotLogin navigate={navigate} />
              )}
              <div style={{ marginTop: "10%" }}>
                <TickerTape
                  colorTheme="light"
                  displayMode="compact"
                  locale="kr"
                ></TickerTape>
              </div>
            </Grid>
            <Grid item xs={3} sx={{ marginTop: "12px" }}>
              <CryptoCurrencyMarket
                width="100%"
                largeChartUrl={CHART_REDIRECT_URL}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
