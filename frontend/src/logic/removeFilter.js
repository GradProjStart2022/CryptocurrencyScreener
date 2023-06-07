import axios from "axios";
import getUserFilter from "./getUserFilterFromServer.js";
import getUserFilterSettings from "./getUserFilterSettings.js";

const FILTER_API_URL = "http://127.0.0.1:8000/filter/api/filter/";

/**
 * 필터 삭제 후 내부 필터 데이터 갱신하는 함수
 * @param {number} filter_id 필터ID숫자
 * @param {string} user_email 사용자 이메일
 * @param {*} redux_filter_list 사용자 필터 목록 redux store
 * @param {*} dispatch RTK dispatcher
 * @returns {Promise<boolean>} 성공여부
 */
const removeFilter = async (
  filter_id,
  user_email,
  redux_filter_list,
  dispatch
) => {
  try {
    let resp = await axios.delete(`${FILTER_API_URL}${filter_id}/`);
    console.log("resp :>> ", resp);
    let rslt = await getUserFilter(user_email, dispatch);
    if (rslt) {
      redux_filter_list.forEach(async (value) => {
        rslt = await getUserFilterSettings(value.id, dispatch);
      });
    }
    return Promise.resolve(true);
  } catch (error) {
    console.log("removeFilter error :>> ", error);
    return Promise.resolve(false);
  }
};

export default removeFilter;
