import axios from "axios";

const ALARM_URL = `${process.env.REACT_APP_API_ROOT}/alarm/`;

// TODO 정상동작 여부 확인
/**
 * 안 읽은 알람 읽음 상태로 바꿔주는 함수
 * @param {number} alarm_id 알람 ID 번호
 * @returns {Promise<boolean>} 성공 여부
 */
const readAlarm = async (alarm_id) => {
  try {
    await axios.patch(
      ALARM_URL,
      {},
      {
        params: {
          a: alarm_id,
        },
      }
    );
    return true;
  } catch (error) {
    return false;
  }
};

export default readAlarm;
