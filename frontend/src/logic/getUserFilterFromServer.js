import axios from "axios";
import { setUserFilterList } from "../redux/store.js";

const GET_FILTER_LIST_URL = "http://127.0.0.1:8000/filter/api/filter/";

/**
 * 사용자 이메일 받아서 서버에서 필터 목록 가져온 뒤에 redux store에 저장하는 함수
 * @param {string} email 사용자 이메일
 * @param {Dispatch<AnyAction>} dispatch RTK dispatcher
 * @returns {Promise<boolean>} 성공여부 + promise 객체
 */
const getUserFilter = async (email, dispatch) => {
  let return_success = false;

  try {
    let resp = await axios.get(`${GET_FILTER_LIST_URL}?email=${email}`);
    console.log("resp :>> ", resp);
    let filter_list = resp.data;
    console.log("filter_list :>> ", filter_list);
    dispatch(setUserFilterList(filter_list));
    return_success = true;
  } catch (error) {
    console.log("getUserFilter error :>> ", error);
    dispatch(setUserFilterList([]));
  } finally {
    return Promise.resolve(return_success);
  }
};

export default getUserFilter;