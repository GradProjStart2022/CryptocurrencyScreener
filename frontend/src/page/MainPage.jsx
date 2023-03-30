/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Grid } from "@mui/material";
import { CryptoCurrencyMarket, MiniChart } from "react-ts-tradingview-widgets";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

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
 * @returns 비로그인시 즐겨찾기 대신 표시되는 UI 요소
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
        }}
      >
        로그인
      </button>
    </div>
  );
};

/**
 * 메인화면 UI 요소 뱉어내는 함수
 * @param {any} props react props
 * @returns 메인화면 UI
 */
const MainPage = (props) => {
  let [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

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
            sx={{ marginLeft: "12px", marginTop: "24px" }}
          >
            <Grid item xs={9}>
              {isLogin ? <div>로그인됨</div> : <NotLogin navigate={navigate} />}
              <MiniChart
                symbol="BTCKRW"
                width="100%"
                largeChartUrl={CHART_REDIRECT_URL}
              />
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
