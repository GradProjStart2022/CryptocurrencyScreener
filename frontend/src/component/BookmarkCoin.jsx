import { MiniChart } from "react-ts-tradingview-widgets";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Grid, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import removeBookmark from "../logic/removeBookmark.js";

/**
 * 즐겨찾는 종목 컴포넌트
 * @param {any} props react props
 * @returns 즐겨찾는 종목 UI 요소
 */
const BookmarkCoin = (props) => {
  // const removeBookmark = props.removeBookmark;
  const data = props.data;
  const bookmark_id = props.bookmark_id;

  let user_email = useSelector((state) => state.user.email);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Grid item xs={4}>
      <IconButton
        aria-label="star"
        color="secondary"
        onClick={async () => {
          let return_success = await removeBookmark(
            data.symbol,
            bookmark_id,
            user_email,
            dispatch
          );
          if (!return_success) {
            navigate(0); // 오류나면 새로고침
          }
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

export default BookmarkCoin;
