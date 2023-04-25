import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { isEmpty } from "lodash-es";

import { MiniChart } from "react-ts-tradingview-widgets";
import { Grid, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

const ATTENTION_URL = "http://localhost:8000/users/api/attention/";

/**
 * 즐겨찾는 종목 컴포넌트
 * @param {*} props react props
 * @returns 즐겨찾는 종목 UI 요소
 */
const BookmarkCoin = (props) => {
  const removeBookmark = props.removeBookmark;
  const data = props.data;

  return (
    <Grid item xs={4}>
      <IconButton
        aria-label="star"
        color="secondary"
        onClick={() => {
          removeBookmark(data.symbol);
        }}>
        <StarIcon />
      </IconButton>
      <MiniChart
        symbol={data.symbol}
        colorTheme="light"
        locale="kr"
        width="100%"></MiniChart>
    </Grid>
  );
};

const BookmarkPage = (props) => {
  const navigate = useNavigate();
  let user_email = useSelector((state) => state.user).email;
  let [bookmarks, setBookmark] = useState([]);

  // todo: useEffetct 내부 로직 로그인 직후로 옮기기(로그인 직후 홈화면 즐겨찾기 대응)
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
        .then((response) => {
          console.log(response);
          setBookmark(response.data);
        })
        .catch((err) => {
          // console.log("err>>>", err);
          navigate("/", { replace: true });
        });
    }
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
      // console.log("err>>> delete_id: ", delete_id);
      navigate(0); // 오류나면 새로고침
    }

    if (resp?.status === 200 || resp?.status === 204) {
      let new_bookmarks = bookmarks.filter((element) => {
        return element?.symbol !== symbol;
      });
      setBookmark(new_bookmarks);
    } else {
      // console.log("err>>> resp.status: ", resp.status);
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
