/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Grid } from "@mui/material";
import { CryptoCurrencyMarket, MiniChart } from "react-ts-tradingview-widgets";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
        }}
      >
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
    <div style={{ display: "flex" }}>
      {bookmarks.map((data, index) => (
        <MiniChart key={index} symbol={data.symbol} width="95%" />
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
  const navigate = useNavigate();
  const data = props.data;

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
              {/* todo: 로그인 되었을때 연동 확인 및 디자인 필요 */}
              {uid !== -1 ? (
                <LoginBookmark />
              ) : (
                <NotLogin navigate={navigate} />
              )}
              <MiniChart
                colorTheme="light"
                locale="kr"
                width="100%"
              ></MiniChart>
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
