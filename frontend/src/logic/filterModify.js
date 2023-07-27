import axios from "axios";
import getUserFilter from "./getUserFilterFromServer";

const FILTER_SERVER_URL = `${process.env.REACT_APP_API_ROOT}/filter/api/filter/`;

/**
 * 필터 기본 정보 수정 함수
 * @param {number} filter_id 필터ID
 * @param {number} uid 사용자번호
 * @param {string} u_email 사용자이메일
 * @param {string} f_name 필터이름
 * @param {string} f_exp 필터조건식
 * @param {Dispatch<AnyAction>} dispatch RTK dispatcher
 * @returns {Promise<boolean>} 성공여부
 */
const filterModify = async (
  filter_id,
  uid,
  u_email,
  f_name,
  f_exp,
  dispatch
) => {
  try {
    let mod_dat = new FormData();
    mod_dat.append("user_id", uid);
    mod_dat.append("name", f_name);
    mod_dat.append("expression", f_exp);

    await axios.patch(`${FILTER_SERVER_URL}${filter_id}/`, mod_dat);

    await getUserFilter(u_email, dispatch);
    return Promise.resolve(true);
  } catch (error) {
    console.log("filterModify error :>> ", error);
    return Promise.resolve(false);
  }
};

export default filterModify;
