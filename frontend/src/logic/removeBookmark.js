import axios from "axios";

import { setBookmark } from "../redux/store.js";

const ATTENTION_URL = "http://localhost:8000/users/api/attention/";

/**
 * 트레이딩뷰 심볼 이름을 받아
 * 북마크 배열 요소 삭제 및 서버 delete 로직을 수행
 * @param {string} symbol 트레이딩뷰 위젯 로드용 심볼 이름
 * @param {number} bookmark_id 삭제할 즐겨찾기 id
 * @param {string} user_email 사용자 email
 * @param {Dispatch<AnyAction>} dispatch RTK dispatcher
 * @returns {Promise<boolean>} 성공여부
 */
const removeBookmark = async (symbol, bookmark_id, user_email, dispatch) => {
  let resp = undefined;
  let return_success = false;

  try {
    resp = await axios.delete(`${ATTENTION_URL}${bookmark_id}/`);

    if (resp?.status === 200 || resp?.status === 204) {
      resp = await axios.get(`${ATTENTION_URL}?email=${user_email}`);
      if (resp?.status === 200 || resp?.status === 204) {
        dispatch(setBookmark(resp.data));
        return_success = true;
      } else {
        return_success = false;
      }
    }
  } catch (error) {
    return_success = false;
  } finally {
    return Promise.resolve(return_success);
  }
};

export default removeBookmark;
