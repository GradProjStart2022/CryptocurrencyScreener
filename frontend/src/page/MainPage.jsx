/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Grid } from "@mui/material";
import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import { CryptoCurrencyMarket, MiniChart } from "react-ts-tradingview-widgets";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
 * 화면설계서 2슬라이드 메인화면
 * @param {*} props
 * @returns
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
                // largeChartUrl="localhost:3000/chart"
                // height={testheight}
              />
            </Grid>
            <Grid item xs={3} sx={{ marginTop: "12px" }}>
              <CryptoCurrencyMarket
                width="100%"
                largeChartUrl="localhost:3000/chart"
                // height="100%"
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
