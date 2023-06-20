import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Grid } from "@mui/material";
import {
  AdvancedRealTimeChart,
  CompanyProfile,
  FundamentalData,
  TechnicalAnalysis,
} from "react-ts-tradingview-widgets";

import addBookmarkServer from "../logic/addBookmarkServer.js";
import removeBookmark from "../logic/removeBookmark.js";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import FavoriteButton from "../component/FavoriteButton.jsx";
/**
 * 종목별 화면 UI 요소 반환 함수
 * @returns 종목별 화면 UI
 */
const ChartPage = () => {
  const location = useLocation();
  // 검색 등에서 넣어둔 종목 객체 찾아오기
  const coin_obj = location.state?.coin;

  const dispatch = useDispatch();
  const user_email = useSelector((state) => state.user.email);
  const uid = useSelector((state) => state.user.uid);
  const bookmarks = useSelector((state) => state.userBookmark.bookmarks);

  /** 해당 종목의 즐겨찾기 여부 확인하는 변수 */
  const isFavorite = useMemo(() => {
    return (
      bookmarks.find((elem) => elem.cryptoname === coin_obj.name_kr) !==
      undefined
    );
  }, [bookmarks, coin_obj]);

  /** 해당 종목 즐겨찾기 정보 변수
   * @type {object} */
  const favorite_obj = useMemo(
    () => bookmarks.find((elem) => elem.cryptoname === coin_obj.name_kr),
    [bookmarks, coin_obj]
  );

  /**
   * 즐겨찾기 버튼 눌러 즐겨찾기 여부 바꾸는 함수
   */
  const handleBookmarkClick = async () => {
    try {
      let resp, msg;
      if (isFavorite) {
        resp = await removeBookmark(favorite_obj.id, user_email, dispatch);
        msg = "삭제되었습니다.";
      } else {
        resp = await addBookmarkServer(
          uid,
          coin_obj.name_kr,
          coin_obj.tradingview_upbit_code,
          dispatch
        );
        msg = "추가되었습니다.";
      }
      console.log("resp :>> ", resp);
      alert(msg);
    } catch (error) {
      alert("즐겨찾기 처리 중 문제가 발생했습니다.");
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
            sx={{ marginLeft: "12px", marginTop: "24px" }}>
            <Grid item xs={12}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <h1
                  style={{
                    display: "inline-block",
                  }}>{`${coin_obj?.name_kr}(${coin_obj?.name_en})`}</h1>
                {uid !== -1 && (
                  <FavoriteButton
                    isFavorite={isFavorite}
                    handleBookmarkClick={handleBookmarkClick}
                  />
                )}
              </span>
            </Grid>
          </Grid>

          <Grid container spacing={0} sx={{ marginLeft: "12px" }}>
            <Grid item xs>
              <AdvancedRealTimeChart
                symbol={coin_obj?.tradingview_upbit_code}
                locale="kr"
                width="100%"
              />
            </Grid>
          </Grid>
          <Grid container={true} spacing={2}>
            <Grid item xs={4}>
              <TechnicalAnalysis
                symbol={coin_obj?.tradingview_upbit_code}
                locale="kr"
                width={"100%"}
              />
            </Grid>
            <Grid item xs={4}>
              <CompanyProfile
                symbol={coin_obj?.tradingview_upbit_code}
                locale="kr"
                width={"100%"}
              />
            </Grid>
            <Grid item xs={4}>
              <FundamentalData
                symbol={coin_obj?.tradingview_upbit_code}
                locale="kr"
                width={"100%"}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
