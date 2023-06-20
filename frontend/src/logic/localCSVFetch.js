import { isEmpty } from "lodash-es";
import * as Papa from "papaparse";
import { addFilterData, clearFilterData } from "../redux/store";

/**
 * public 폴더에 있는 csv 파일을 가져와 basicFilterName Redux Store에 채우는 함수
 * @param {string} CSV_FLIE_NAME public 폴더에 있는 가져올 CSV 파일 이름
 * @param {import("react").Dispatch<import("@reduxjs/toolkit").AnyAction>} dispatch RTK dispatcher
 * @param {object[]} basicFilterArr 기본필터정보 redux store
 * @returns {Promise<boolean>} 성공여부
 */
const localCSVFetch = async (CSV_FLIE_NAME, dispatch, basicFilterArr) => {
  let retn_dat = false;
  try {
    if (isEmpty(basicFilterArr)) {
      const resp = await fetch(`${process.env.PUBLIC_URL}/${CSV_FLIE_NAME}`);

      let tempCSVDecodeDat = Papa.parse(await resp.text(), { header: true });

      if (tempCSVDecodeDat.errors.length === 0) {
        let final_data = tempCSVDecodeDat.data;
        final_data.forEach((elem, index) => {
          dispatch(addFilterData(elem));
        });
      }
    }
    return Promise.resolve(true);
  } catch (error) {
    console.log("localCSVFetch error :>> ", error);
    dispatch(clearFilterData());
    return Promise.reject(false);
  }
};

export default localCSVFetch;
