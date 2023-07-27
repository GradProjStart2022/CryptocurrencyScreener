import axios from "axios";

const FILTER_SERVER_URL = `${process.env.REACT_APP_API_ROOT}/filter/api/filter/`;

/**
 * 필터에 대해 변경된 알람 설정
 * patch로 변경하는 함수
 * @param {number} uid 사용자 ID
 * @param {object[]} filter_list 사용자 복합필터 배열
 * @param {object} switchStates 웹사이트, 텔레그램 설정 상태 객체
 * @param {object} selectValues 알람 수신 간격 설정 객체
 * @returns {Promise<boolean>} 성공 여부
 */
const setAlarmSettings = async (
  uid,
  filter_list,
  switchStates,
  selectValues
) => {
  try {
    let body_form = null;
    for (let index = 0; index < filter_list.length; index++) {
      const elem = filter_list[index];
      body_form = new FormData();
      body_form.append("uid", uid);
      body_form.append("time", selectValues[elem.id]);
      body_form.append("alarm", switchStates[`website-${elem.id}`]);
      // TODO API 변경 이후 텔레그램 설정 폼 데이터 추가

      await axios.patch(FILTER_SERVER_URL + `${elem.id}/`, body_form);
      // if (resp.status !== 200) {
      //     throw new Error(`filter alarm settings error / ${resp.status} / ${resp.data}`);
      // }
    }
    return true;
  } catch (error) {
    console.log("setAlarmSettings error :>> ", error);
    return false;
  }
};

export default setAlarmSettings;
