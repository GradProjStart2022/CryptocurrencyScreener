import * as Papa from "papaparse";

/**
 * public 폴더에 있는 csv 파일을 가져와 원하는 상수에 채우는 함수
 * @param {string} CSV_FLIE_NAME public 폴더에 있는 가져올 CSV 파일 이름
 * @param {object[]} TO_BE_FILLED_CONST_ARR CSV를 통해 채울 배열 상수 이름
 */
const localCSVFetch = async (CSV_FLIE_NAME, TO_BE_FILLED_CONST_ARR) => {
  try {
    if (TO_BE_FILLED_CONST_ARR.length === 0) {
      const resp = await fetch(`${process.env.PUBLIC_URL}/${CSV_FLIE_NAME}`);

      let tempCSVDecodeDat = Papa.parse(await resp.text(), { header: true });

      if (tempCSVDecodeDat.errors.length === 0) {
        let final_data = tempCSVDecodeDat.data;
        final_data.forEach((elem) => {
          TO_BE_FILLED_CONST_ARR.push(elem);
        });
      }
      return TO_BE_FILLED_CONST_ARR;
    } else {
      return [];
    }
  } catch (error) {
    console.log("localCSVFetch-error :>> ", error);
    return [];
  }
};

export default localCSVFetch;
