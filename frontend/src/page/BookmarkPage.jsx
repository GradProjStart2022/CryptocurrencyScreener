import { useState } from "react";
import { Grid, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { MiniChart } from "react-ts-tradingview-widgets";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

const BookmarkPage = (props) => {
  const SYMBOL = "즐겨찾는 종목 목록";

  let [idx, setIdx] = useState(0);
  const changeIdx = () => {
    console.log("idx :>> ", idx);
    switch (idx) {
      case 0:
        setIdx(1);
        break;
      case 1:
        setIdx(0);
        break;
      default:
        setIdx(0);
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
          <Grid container={true} spacing={1}>
            <Grid item xs={12}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <h1 style={{ display: "inline-block" }}>{SYMBOL}</h1>

                <IconButton
                  aria-label="star"
                  color="secondary"
                  onClick={changeIdx}
                >
                  {[<StarBorderIcon />, <StarIcon />][idx]}
                </IconButton>
              </span>
            </Grid>
          </Grid>

          <Grid container={true} spacing={2}>
            <Grid item xs>
              <MiniChart
                symbol="BINANCE:BTCUSDT"
                colorTheme="light"
                locale="kr"
                width="300"
                height="320"
              ></MiniChart>
            </Grid>
            <Grid item xs>
              <MiniChart
                colorTheme="light"
                width="300"
                height="320"
              ></MiniChart>
            </Grid>
            <Grid item xs>
              <MiniChart
                colorTheme="light"
                width="300"
                height="320"
              ></MiniChart>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="App">
  //     <SideNavBar />
  //     <div className="content-outer">
  //       <div className="top-bar">
  //         <SearchBar />
  //         <LoginInfo />
  //       </div>
  //       <div className="content-view">
  //         <p>화면정의서 15슬라이드 즐겨찾기 페이지 제작 예정</p>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default BookmarkPage;
