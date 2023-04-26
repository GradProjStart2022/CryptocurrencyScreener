import axios from "axios";
import { isNil } from "lodash-es";

import { addUserFilterData } from "../redux/store.js";
import localCSVFetch from "./localCSVFetch.js";
import { basicFilterArr } from "../model/basic_filter_const.js";

const FILTER_SETTINGS_URL_PREFIX = "http://127.0.0.1:8000/filter/api/filter/";
const FILTER_SETTINGS_URL_SUBFIX = "/settings/";

const indicatorToKRName = (indicator) => {
  let return_value = "";

  localCSVFetch("basic_filter_name.csv", basicFilterArr)
    .then((resp) => {
      let match_basic = basicFilterArr.find((value) => {
        return value.abbreviation === indicator;
      });

      return_value = match_basic.name_kr;
    })
    .catch((err) => {
      console.log("err :>> ", err);
      return_value = "";
    })
    .finally(() => {
      return return_value;
    });
};

/**
 * 해당 필터ID에 대한 기본필터 설정들 가져와 redux store에 저장하는 함수
 * @param {number} id DB filter ID
 * @param {Dispatch<AnyAction>} dispatch RTK dispatcher
 * @returns {Promise<boolean>} 성공여부 + promise 객체
 */
const getUserFilterSettings = async (id, dispatch) => {
  let return_success = true;
  let refined_data = {
    filter_id: id,
    exp_alpha_list: [],
    settings: [],
  };

  axios
    .get(`${FILTER_SETTINGS_URL_PREFIX}${id}${FILTER_SETTINGS_URL_SUBFIX}`)
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
          name_kr: indicatorToKRName(value.indicator),
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
