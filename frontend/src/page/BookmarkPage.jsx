import { useEffect, useState } from "react";
import { Grid, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { MiniChart } from "react-ts-tradingview-widgets";
import axios from "axios";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import { useNavigate } from "react-router-dom";

const ATTENTION_URL = "http://localhost:8000/users/api/attention/";

/**
 * 즐겨찾는 종목 컴포넌트
 * @param {*} props
 * @returns
 */
const BookmarkCoin = (props) => {
  // let bookmark = props.bookmark;
  const removeBookmark = props.removeBookmark;
  const data = props.data;

  return (
    <Grid item xs={4}>
      {/* <div
        style={{
          display: "inline",
          alignItems: "center",
          width: "300px",
        }}>
      </div> */}
      <IconButton
        aria-label="star"
        color="secondary"
        onClick={() => {
          removeBookmark(data.symbol);
        }}
      >
        <StarIcon />
      </IconButton>
      <MiniChart
        symbol={data.symbol}
        colorTheme="light"
        locale="kr"
        width="100%"
      ></MiniChart>
    </Grid>
  );
};

const BookmarkPage = (props) => {
  const navigate = useNavigate();
  let [bookmarks, setBookmark] = useState([]);

  useEffect(() => {
    let TEMP_EMAIL = "test@test.com";
    /* todo
      로그인이랑 연동해서
      1. 로그인 정보 redux store나 session storage에 없으면 로그인 페이지로 리다이렉트
      2. 로그인 이메일 해당 정보에서 빼오기
     */

    // 처음 접속할때 북마크 목록 받아오기
    axios
      .get(`${ATTENTION_URL}?email=${TEMP_EMAIL}`)
      .then((response) => {
        console.log(response);
        setBookmark(response.data);
      })
      .catch((err) => {
        console.log("err>>>", err);
        navigate("/", { replace: true });
      });
  }, []);

  /**
   * 트레이딩뷰 심볼 이름을 받아
   * 북마크 배열 요소 삭제 및 서버 delete 로직을 수행
   * @param {string} symbol 트레이딩뷰 위젯 로드용 심볼 이름
   */
  const removeBookmark = async (symbol) => {
    let resp = undefined;

    let remove_coin = bookmarks.find((element) => {
      return element?.symbol === symbol;
    });
    let delete_id = remove_coin?.id;
    if (delete_id) {
      resp = await axios.delete(`${ATTENTION_URL}${delete_id}/`);
    } else {
      console.log("err>>> delete_id: ", delete_id);
      navigate(0); // 오류나면 새로고침
    }

    if (resp?.status === 200 || resp?.status === 204) {
      let new_bookmarks = bookmarks.filter((element) => {
        return element?.symbol !== symbol;
      });
      setBookmark(new_bookmarks);
    } else {
      console.log("err>>> resp.status: ", resp.status);
      navigate(0); // 오류나면 새로고침
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
          {/* 제목영역 */}
          <Grid container={true} spacing={1}>
            <Grid item xs={12}>
              <h1 style={{ display: "block" }}>즐겨찾는 종목 목록</h1>
            </Grid>
          </Grid>
          {/* 즐겨찾는 종목 영역 */}
          <Grid container={true} spacing={4}>
            {/* 즐겨찾는 종목 동적 생성 */}
            {bookmarks.length !== 0 ? (
              // 종목의 길이가 true인 상황: 종목을 렌더링
              bookmarks.map((data, index) => {
                return (
                  <BookmarkCoin
                    key={index}
                    data={data}
                    removeBookmark={removeBookmark}
                  />
                );
              })
            ) : (
              // 종목의 길이가 없는 상황: 대체 요소 렌더링
              <div>
                관심 종목이 없습니다
                <br />
                종목 상세페이지에서 관심 종목을 추가해보세요
              </div>
            )}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default BookmarkPage;