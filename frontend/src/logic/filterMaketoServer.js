import axios from "axios";
import { isNil } from "lodash-es";
import getUserFilter from "./getUserFilterFromServer.js";

const FILTER_SERVER_URL = "http://127.0.0.1:8000/filter/api/filter/";

/**
 * 프론트에 최적화된 필터 정보 object 배열에서 필요한 요소만 가져와서
 * formData로 만들어 서버에 필터 정보 전송해 제작하는 함수
 * @param {object[]} completeBasicFilter 프론트에서 사용하는 기본필터 정보 배열
 * @param {number} filter_id 복합필터 ID 값
 * @returns {Promise<boolean>} 성공여부
 */
const filterDataCustom = async (completeBasicFilter, filter_id) => {
  let modified_filter_form = null;
  let return_success = true;

  try {
    completeBasicFilter.forEach(async (value) => {
      modified_filter_form = new FormData();
      modified_filter_form.append("indicator", value.indicator);
      modified_filter_form.append("name", value.name);
      modified_filter_form.append("sign", value.oper);
      modified_filter_form.append("value1", value.value1);
      // todo: 추후 서버에서 value2 null 버그 픽스예정
      modified_filter_form.append(
        "value2",
        isNil(value.value2) ? -1 : value.value2
      );

      await axios.post(
        `${FILTER_SERVER_URL}${filter_id}/settings/`,
        modified_filter_form
      );
    });
  } catch (error) {
    return_success = false;
    await axios.delete(`${FILTER_SERVER_URL}${filter_id}/`);
  } finally {
    return Promise.resolve(return_success);
  }
};

/**
 * 서버에 정보 전송해 복합필터 초기화하고 내부 기본필터들 초기화하는 함수
 * @param {object[]} completeBasicFilter 사용자가 완성한 기본 필터 정보(프론트에 최적화됨)
 * @param {string} filterExp 필터 표현식(A&B...)
 * @param {string} inputFilterName 필터 이름
 * @param {string} user_email 사용자 이메일
 * @param {number} uid DB 사용자 UID
 * @param {number[]} filled_id 반환할 생성된 필터ID 배열(for pass by ref)
 * @param {Dispatch<AnyAction>} dispatch RTK Dispatcher
 * @returns {Promise<boolean>}} 성공여부
 */
const filterMake = async (
  completeBasicFilter,
  filterExp,
  inputFilterName,
  user_email,
  uid,
  filled_id,
  dispatch
) => {
  /** @type Promise<any> */
  let resp = null;
  let return_success = true;

  try {
    let filter_init_form = new FormData();
    filter_init_form.append("user_id", uid);
    filter_init_form.append("name", inputFilterName);
    filter_init_form.append("expression", filterExp);
    filter_init_form.append("alarm", false);
    filter_init_form.append("time", 60);

    resp = await axios.post(FILTER_SERVER_URL, filter_init_form);
    filled_id[0] = resp.data.id;

    return_success = await filterDataCustom(completeBasicFilter, filled_id[0]);

    return_success = await getUserFilter(user_email, dispatch);
  } catch (error) {
    console.log("error :>> ", error);
    // alert("사이트에 문제가 발생했습니다.");
    return_success = false;
  } finally {
    return Promise.resolve(return_success);
  }
};

export default filterMake;
