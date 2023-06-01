import axios from "axios";
import { addBookmark } from "../redux/store.js";

const ATTENTION_URL = "http://localhost:8000/users/api/attention/";

/**
 * 서버로 사용자 관심 암호화폐 추가하는 함수
 * @param {number} user_id 사용자ID번호
 * @param {string} crypname_kr 암호화폐 이름
 * @param {string} symbol 암호화폐 코드
 * @param {Dispatch<AnyAction>} dispatch RTK dispatcher
 * @returns {Promise<boolean>} 성공여부
 */
const addBookmarkServer = async (user_id, crypname_kr, symbol, dispatch) => {
  let return_success = false;
  let resp;
  let attention_data = new FormData();
  attention_data.append("user", user_id);
  attention_data.append("cryptoname", crypname_kr);
  attention_data.append("symbol", symbol);
  try {
    console.log(user_id);
    console.log(crypname_kr);
    console.log(symbol);
    resp = await axios.post(`${ATTENTION_URL}`, attention_data);

    if (resp.status === 200 || resp.status === 201) {
      let data = resp.data;
      dispatch(addBookmark(data));
      return_success = true;
    }
  } catch (error) {
    console.log("addBookmark error :>> ", error);
    return_success = false;
  } finally {
    return Promise.resolve(return_success);
  }
};

export default addBookmarkServer;
