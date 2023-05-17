import axios from "axios";
import { isEmpty } from "lodash-es";

const SCREEN_PRICE_URL = "http://127.0.0.1:8000/price/screening/";
/**
 * 서버에서 필터링된 종목 데이터 받아
 * 모델에 넣어주는 함수
 * @param {number} filter_id 필터ID
 * @param {string} used_bar_table 종목 봉 테이블 지정
 * @param {number} date_range 사용할 데이터 기간
 * @param {React.Dispatch<React.SetStateAction>} setPriceData 성공 데이터 setter
 * @returns {Promise<boolean>} 성공여부 Promise 객체
 */
const getFilteredData = async (
  filter_id,
  used_bar_table,
  date_range,
  setPriceData
) => {
  /** @type {boolean} */
  let return_success = false;
  /** @type {object[]} */
  let price_data = [];

  try {
    let resp = await axios.get(SCREEN_PRICE_URL, {
      params: {
        id: filter_id,
        table: used_bar_table,
        date_range: date_range,
      },
    });

    if (Object.keys(resp.data).includes("error")) {
      // 혹시나 200인데 error를 수신할 시
      console.log("getFilteredData none :>> ", resp.data);
      price_data = [
        {
          id: 1,
          name_kr: "Error",
          name_en: "Error",
          symbol_id: 0,
          ticker: "Error",
        },
      ];
      return_success = false;
    } else if (isEmpty(resp.data)) {
      // 아무 결과도 없을 경우
      price_data = [
        {
          id: 1,
          name_kr: "No Filter Data",
          name_en: "No Filter Data",
          symbol_id: 0,
          ticker: "No Filter Data",
        },
      ];
      return_success = false;
    } else {
      // 필터링 데이터 정상 수신
      resp.data.forEach((elem, index) => {
        price_data.push({
          id: index,
          ...elem,
        });
      });

      return_success = true;
    }
    setPriceData(price_data);
  } catch (error) {
    console.log("getFilteredData error :>> ", error);
    setPriceData([
      {
        id: 1,
        name_kr: "Error",
        name_en: "Error",
        symbol_id: 0,
        ticker: "Error",
      },
    ]);
    return_success = false;
  } finally {
    return return_success;
  }
};

export default getFilteredData;
