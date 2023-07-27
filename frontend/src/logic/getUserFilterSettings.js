import axios from "axios";
import { isEmpty, isNil } from "lodash-es";

import { addUserFilterData } from "../redux/store.js";

const FILTER_SERVER_URL = `${process.env.REACT_APP_API_ROOT}/filter/api/filter/`;
const FILTER_SERVER_SETTINGS_URL = "/settings/";

/**
 * api 필터 코드에서 한국어 필터 이름으로 변환하는 함수
 * @param {string} indicator api 내부 식별용 필터명
 * @param {object[]} basicFilterArr 기본필터변수 redux store 변수
 * @returns {string} 변환된 한국어 필터 이름
 */
const indicatorToKRName = (indicator, basicFilterArr) => {
  let return_value = "";

  let match_basic = basicFilterArr.find((value) => {
    return value.abbreviation === indicator;
  });

  if (!isEmpty(match_basic)) {
    return_value = match_basic?.name_kr;
  } else {
    return_value = "";
  }

  return return_value;
};

/**
 * 해당 필터ID에 대한 기본필터 설정들 가져와 사용자 필터 redux store에 저장하는 함수
 * @param {number} id DB filter ID
 * @param {import("react").Dispatch<import("@reduxjs/toolkit").AnyAction>} dispatch RTK dispatcher
 * @param {object[]} basicFilterArr 기본필터정보 redux Store 변수
 * @returns {Promise<boolean>} 성공여부 + promise 객체
 */
const getUserFilterSettings = async (id, dispatch, basicFilterArr) => {
  let return_success = true;
  let refined_data = {
    filter_id: id,
    exp_alpha_list: [],
    settings: [],
  };

  axios
    .get(`${FILTER_SERVER_URL}${id}${FILTER_SERVER_SETTINGS_URL}`)
    .then((resp) => {
      let data = resp.data;
      data.forEach((value) => {
        let val_isDualValue =
          isNil(value.value2) || value.value2 === -1 ? false : true;
        let new_data = {
          idx: null,
          id: value.id,
          is_used: true,
          indicator: value.indicator,
          oper_kor: undefined,
          oper: value.sign,
          value1: value.value1,
          value2: value.value2,
          is_dual_value: val_isDualValue,
          name: value.name,
          name_kr: indicatorToKRName(value.indicator, basicFilterArr),
        };

        refined_data.exp_alpha_list.push(value.name);
        refined_data.settings.push(new_data);
      });

      dispatch(addUserFilterData(refined_data));
    })
    .catch((error) => {
      console.log("getUserFilterSettings error :>> ", error);
      return_success = false;
    });

  return Promise.resolve(return_success);
};

export default getUserFilterSettings;

// idx: 로컬 데이터(병합 이전 우선 - basicValueInit 값)
// id: 서버 값
// is_used: true
// indicator: 서버 값
// oper_kor: 자체 연산
// oper: 서버 값(sign)
// value1: 서버 값
// value2: 서버 값
// is_dual_value: 자체 연산
// name: 서버 값
// name_kr: 로컬 데이터(병합 이전 우선 - basicValueInit 값)
