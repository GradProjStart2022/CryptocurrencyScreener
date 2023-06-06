import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { isEmpty } from "lodash-es";

import { Grid } from "@mui/material";

import { setBookmark } from "../redux/store.js";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import BookmarkCoin from "../component/BookmarkCoin.jsx";
import { setBookmark } from "../redux/store.js";

const ATTENTION_URL = "http://localhost:8000/users/api/attention/";

const BookmarkPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let user_email = useSelector((state) => state.user.email);
  /** @type {object[]} */
  let bookmarks = useSelector((state) => state.userBookmark.bookmarks);

  // TODO useEffetct 내부 로직 로그인 직후로 옮기기(로그인 직후 홈화면 즐겨찾기 대응)
  useEffect(() => {
    /* 
      로그인이랑 연동해서
      1. 로그인 정보 redux store에 없으면 로그인 페이지 가라고 안내
      2. 로그인 이메일 해당 정보에서 빼오기
     */

    // 처음 접속할때 북마크 목록 받아오기
    if (!isEmpty(user_email)) {
      axios
        .get(`${ATTENTION_URL}?email=${user_email}`)
        .then((resp) => {
          dispatch(setBookmark(resp.data));
          // setBookmark(response.data);
        })
        .catch((err) => {
          console.log("BookmarkPage UseEffect err>>>", err);
          alert("즐겨찾기 조회에 문제가 있습니다.\n다시 접속해주세요.");
          navigate("/", { replace: true });
        });
    }
  }, []);

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
                  <BookmarkCoin key={index} data={data} bookmark_id={data.id} />
                );
              })
            ) : !isEmpty(user_email) ? (
              // 종목의 길이가 없는 상황: 대체 요소 렌더링
              <div>
                관심 종목이 없습니다
                <br />
                종목 상세페이지에서 관심 종목을 추가해보세요
              </div>
            ) : (
              <div>로그인을 먼저 해주세요</div>
            )}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default BookmarkPage;
