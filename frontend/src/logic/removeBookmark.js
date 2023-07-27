import axios from "axios";

import { setBookmark } from "../redux/store.js";

const ATTENTION_URL = `${process.env.REACT_APP_API_ROOT}/users/api/attention/`;

/**
 * 트레이딩뷰 심볼 이름을 받아
 * 북마크 배열 요소 삭제 및 서버 delete 로직을 수행
 * @param {number} bookmark_id 삭제할 즐겨찾기 id
 * @param {string} user_email 사용자 email
 * @param {Dispatch<AnyAction>} dispatch RTK dispatcher
 * @returns {Promise<boolean>} 성공여부
 */
const removeBookmark = async (bookmark_id, user_email, dispatch) => {
  let resp;

  try {
    resp = await axios.delete(`${ATTENTION_URL}${bookmark_id}/`);

    resp = await axios.get(`${ATTENTION_URL}?email=${user_email}`);

    dispatch(setBookmark(resp.data));

    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(false);
  }
};

export default removeBookmark;
