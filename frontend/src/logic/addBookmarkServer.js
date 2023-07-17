import axios from "axios";
import { addBookmark } from "../redux/store.js";

const ATTENTION_URL = "http://localhost:8000/users/api/attention/";

/**
 * 사용자가 누른 암호화폐를 서버 즐겨찾기에 추가하는 함수
 * @param {number} uid 사용자ID번호
 * @param {string} crypname_kr 암호화폐 한국어 이름
 * @param {string} symbol 암호화폐 코드
 * @param {import("@reduxjs/toolkit").Dispatch<import("@reduxjs/toolkit").AnyAction>} dispatch RTK dispatcher
 * @returns {Promise<boolean>} 성공여부
 */
const addBookmarkServer = async (uid, crypname_kr, symbol, dispatch) => {
  let attention_data = new FormData();
  attention_data.append("user", uid);
  attention_data.append("cryptoname", crypname_kr);
  attention_data.append("symbol", symbol);

  try {
    let resp = await axios.post(`${ATTENTION_URL}`, attention_data);

    let data = resp.data;
    dispatch(addBookmark(data));
    return Promise.resolve(true);
  } catch (error) {
    console.log("addBookmark error :>> ", error);
    return Promise.reject(false);
  }
};

export default addBookmarkServer;
