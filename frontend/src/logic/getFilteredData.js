import axios from "axios";
import { isEmpty } from "lodash-es";

const SCREEN_PRICE_URL = "http://127.0.0.1:8000/price/screening/";
const PRICE_DATA_URL = "http://127.0.0.1:8000/price/prices/";

/**
 * 필터링된 종목의 세부 가격 데이터를 가져오는 함수
 * @param {object[]} price_data 사전에 가져온 필터링된 종목 object 배열
 * @param {string[]} symbol_ids 필터링된 종목의 내부 식별용 ID가 저장된 배열
 */
const getFilteredPrice = async (price_data, symbol_ids) => {
  try {
    let resp = await axios.get(PRICE_DATA_URL, {
      params: {
        symbol_ids: JSON.stringify(symbol_ids),
      },
    });
    resp.data.forEach((elem, index) => {
      price_data[index] = {
        ...elem,
        ...price_data[index],
      };
    });
  } catch (error) {
    console.log("getFilteredPrice error :>> ", error);
    price_data.forEach((elem, index) => {
      price_data[index] = {
        OPEN: -1,
        CLOSE: -1,
        VOLUME: -1,
        ...elem,
      };
    });
  }
};

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
      price_data = [
        {
          id: 1,
          name_kr: "Error",
          name_en: "Error",
          symbol_id: 0,
          ticker: "Error",
          OPEN: -1,
          CLOSE: -1,
          VOLUME: -1,
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
          OPEN: -1,
          CLOSE: -1,
          VOLUME: -1,
        },
      ];
      return_success = false;
    } else {
      /** @type {string[]} */
      let symbol_ids = [];

      // 필터링 데이터 정상 수신
      resp.data.forEach((elem, index) => {
        symbol_ids.push(elem.symbol_id);
        price_data.push({
          id: index,
          ...elem,
        });
      });

      await getFilteredPrice(price_data, symbol_ids);

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
        OPEN: -1,
        CLOSE: -1,
        VOLUME: -1,
      },
    ]);
    return_success = false;
  } finally {
    return return_success;
  }
};

export default getFilteredData;
