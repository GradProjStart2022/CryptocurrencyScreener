import axios from "axios";
import { searchConstValue, searchObjValue } from "../model/search_const.js";

const SERVER_ALL_JONGMOK_ARRAY_URL =
  "http://127.0.0.1:8000/widget/search/?s=all";

/**
 * 서버에서 전체 암호화폐 목록을 받아와
 * 검색창 렌더링 변수 및 정보 변수에 넣어주는 함수
 *
 * 사실상의 return으로 search_const.js의 searchConstValue에 요소를 삽입
 *
 * @param 없음
 */
const getSearchComplete = async () => {
  if (searchObjValue.length === 0) {
    axios
      .get(SERVER_ALL_JONGMOK_ARRAY_URL)
      .then((resp) => {
        let jongmokJson = resp.data;

        jongmokJson.forEach((elem, index) => {
          let addStr = elem.name_kr + "/" + elem.name_en;

          searchObjValue.push({
            name: addStr,
            id: index,
            name_kr: elem.name_kr,
            name_en: elem.name_en,
            tradingview_market_code: elem.tradingview_market_code,
            tradingview_upbit_code: elem.tradingview_upbit_code,
            upbit_stock_code: elem.upbit_stock_code,
          });
          searchConstValue.push(addStr);
        });
      })
      .catch((err) => {
        // todo 에러처리 및 새로고침
        alert("내부에서 오류가 발생했습니다.\n사이트를 새로고침해주세요.");

        console.log("err :>> ", err);
      });
  }
};

export default getSearchComplete;
