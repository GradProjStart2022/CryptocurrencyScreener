import { useState } from "react";
import { Grid, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { MiniChart } from "react-ts-tradingview-widgets";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import { width } from "@mui/system";

const BookmarkPage = (props) => {
  const SYMBOL = "즐겨찾는 종목 목록";

  let [bookmark, setBookmark] = useState([0, 0, 0]);
  const changeBookmark = (idx) => {
    console.log("bookmark :>> ", bookmark);

    let tmp_book = [...bookmark];
    tmp_book[idx] = tmp_book[idx] ? 0 : 1;
    setBookmark(tmp_book);

    // switch (idx) {
    //   case 0:
    //     // setBookmark(1);
    //     tmp_book[0] = 1;
    //     break;
    //   case 1:
    //     setBookmark(0);
    //     break;
    //   case 2:
    //     setBookmark([...bookmark])
    //   default:
    //     setBookmark(0);
    //     break;
    // }
    console.log("bookmark 변경 :>> ", bookmark);
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
              <h1 style={{ display: "block" }}>{SYMBOL}</h1>
            </Grid>
          </Grid>
          <Grid container={true} spacing={2}>
            <Grid item xs>
              <div
                style={{
                  display: "inline",
                  alignItems: "center",
                  width: "300px",
                }}
              >
                <IconButton
                  aria-label="star"
                  color="secondary"
                  onClick={() => {
                    changeBookmark(0);
                  }}
                >
                  {[<StarBorderIcon />, <StarIcon />][bookmark[0]]}
                </IconButton>
              </div>
              <MiniChart
                symbol="BINANCE:BTCUSDT"
                colorTheme="light"
                locale="kr"
                width="300"
                height="300"
              ></MiniChart>
            </Grid>
            <Grid item xs>
              <div
                style={{
                  display: "inline",
                  alignItems: "center",
                }}
              >
                <IconButton
                  aria-label="star"
                  color="secondary"
                  onClick={() => {
                    changeBookmark(1);
                  }}
                >
                  {[<StarBorderIcon />, <StarIcon />][bookmark[1]]}
                </IconButton>
              </div>
              <MiniChart
                colorTheme="light"
                locale="kr"
                width="300"
                height="300"
              ></MiniChart>
            </Grid>
            <Grid item xs>
              <div
                style={{
                  display: "inline",
                  alignItems: "center",
                }}
              >
                <IconButton
                  aria-label="star"
                  color="secondary"
                  onClick={() => {
                    changeBookmark(2);
                  }}
                >
                  {[<StarBorderIcon />, <StarIcon />][bookmark[2]]}
                </IconButton>
              </div>
              <MiniChart
                colorTheme="light"
                locale="kr"
                width="300"
                height="300"
              ></MiniChart>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default BookmarkPage;
