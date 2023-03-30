import { useState } from "react";
import { useLocation } from "react-router-dom";

import { Grid, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  AdvancedRealTimeChart,
  CompanyProfile,
  FundamentalData,
  TechnicalAnalysis,
} from "react-ts-tradingview-widgets";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

/**
 * 종목별 화면 UI 요소 반환 함수
 * @param props react props
 * @returns 종목별 화면 UI
 */
const ChartPage = (props) => {
  // todo: 북마크 연동시 나머지 UI 요소들 리렌더링 막기
  // const { code } = useParams();
  const location = useLocation();
  // 검색 등에서 넣어둔 종목 객체 찾아오기
  const coin_obj = location.state?.coin;

  // todo: 사용자 북마크 연동
  let [isFavorite, setIsFavorite] = useState(0);
  const changeIdx = () => {
    console.log("Debug/isFavorite :>> ", isFavorite);
    switch (isFavorite) {
      case 0:
        setIsFavorite(1);
        break;
      case 1:
        setIsFavorite(0);
        break;
      default:
        setIsFavorite(0);
        break;
    }
  };

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
            container={true}
            spacing={1}
            sx={{ marginLeft: "12px", marginTop: "24px" }}
          >
            <Grid item xs={12}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <h1
                  style={{ display: "inline-block" }}
                >{`${coin_obj?.name_kr}(${coin_obj?.name_en})`}</h1>
                <IconButton
                  aria-label="star"
                  // todo: 색상 오버라이드
                  color="secondary"
                  onClick={changeIdx}
                >
                  {[<StarBorderIcon />, <StarIcon />][isFavorite]}
                </IconButton>
              </span>
            </Grid>
          </Grid>

          <Grid container spacing={0} sx={{ marginLeft: "12px" }}>
            <Grid item xs>
              <AdvancedRealTimeChart
                symbol={coin_obj?.tradingview_upbit_code}
                locale="kr"
                width="100%"
              ></AdvancedRealTimeChart>
            </Grid>
          </Grid>
          <Grid container={true} spacing={2}>
            <Grid item xs={4}>
              <TechnicalAnalysis
                symbol={coin_obj?.tradingview_upbit_code}
                locale="kr"
                width={"100%"}
              ></TechnicalAnalysis>
            </Grid>
            <Grid item xs={4}>
              <CompanyProfile
                symbol={coin_obj?.tradingview_upbit_code}
                locale="kr"
                width={"100%"}
              ></CompanyProfile>
            </Grid>
            <Grid item xs={4}>
              <FundamentalData
                symbol={coin_obj?.tradingview_upbit_code}
                locale="kr"
                width={"100%"}
              ></FundamentalData>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
