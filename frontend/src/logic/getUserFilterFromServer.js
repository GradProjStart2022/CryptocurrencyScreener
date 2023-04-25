import axios from "axios";
import { setUserFilterList } from "../redux/store";

const GET_FILTER_LIST_URL = "http://127.0.0.1:8000/filter/api/filter/";

/**
 * 사용자 이메일 받아서 서버에서 필터 목록 가져온 뒤에 redux store에 저장하는 함수
 * @param {string} email 사용자 이메일
 * @param {Dispatch<AnyAction>} dispatch RTK dispatcher
 */
const getUserFilter = (email, dispatch) => {
  axios
    .get(`${GET_FILTER_LIST_URL}?email=${email}`)
    .then((resp) => {
      console.log("resp :>> ", resp);
      let filter_list = resp.data;
      dispatch(setUserFilterList(filter_list));
    })
    .catch((error) => {
      console.log("getUserFilter error :>> ", error);
      dispatch(setUserFilterList([]));
    });
};

export default getUserFilter;
