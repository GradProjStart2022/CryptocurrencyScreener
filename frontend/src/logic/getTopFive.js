import axios from "axios";
import { cloneDeep, isEmpty } from "lodash-es";

const TOP5_SERVER_URL = `${process.env.REACT_APP_API_ROOT}/filter/top5/`;

/**
 * TOP5 지표 가져오는 로직
 * @returns {Promise<object[]>} "top_five" 키 값의 많이 사용된 지표 5가지 목록 배열
 */
const getTopFive = async () => {
  let rtn_dat = [];

  try {
    let resp = await axios.get(TOP5_SERVER_URL);
    let top_five = resp?.data?.top_five;

    if (isEmpty(top_five)) {
      rtn_dat = [{ indicator: "empty", count: -1 }];
    } else {
      rtn_dat = cloneDeep(top_five);
    }
  } catch (error) {
    console.log("getTopFive error :>> ", error);
    rtn_dat = [{ indicator: "error", count: -1 }];
  } finally {
    return Promise.resolve(rtn_dat);
  }
};

export default getTopFive;
