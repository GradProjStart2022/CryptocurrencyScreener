import axios from "axios";

const ALARM_URL = `${process.env.REACT_APP_API_ROOT}/alarm/`;

/**
 * 서버에서 알람 목록 받아오는 함수
 * @param {number} user_id 사용자 ID 번호
 * @param {React.Dispatch<React.SetStateAction<never[]>>} setAlarmState 내부 알람 모델 state setter
 * @returns {Promise<boolean>} 성공여부
 */
const getAlarm = async (user_id, setAlarmState) => {
  try {
    let resp = await axios.get(ALARM_URL, {
      params: {
        id: user_id,
      },
    });
    setAlarmState(resp.data);
    return true;
  } catch (error) {
    return false;
  }
};

export default getAlarm;
