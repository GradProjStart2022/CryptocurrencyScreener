import axios from "axios";

const FILTER_INIT_URL = "http://127.0.0.1:8000/filter/api/filter/";

/**
 * 프론트에 최적화된 필터 정보 object 배열에서 필요한 요소만 가져오는 함수
 * @param {object[]} completeBasicFilter 프론트에서 사용하는 기본필터 정보 배열
 * @returns 서버로 전송할 object 배열
 */
const filterDataCustom = (completeBasicFilter) => {
  let modified_filter_data = [];
  completeBasicFilter.forEach((value) => {
    modified_filter_data.push({
      name: value.name,
      sign: value.oper,
      value1: value.value1,
      value2: value.value2,
    });
  });
  return modified_filter_data;
};

const filterMake = async (completeBasicFilter, filterExp, inputFilterName) => {
  let settings_table_data = JSON.stringify(
    filterDataCustom(completeBasicFilter)
  );

  try {
    let resp = await axios.post(FILTER_INIT_URL, {
      name: inputFilterName,
      expression: filterExp,
    });
    // todo: 가져오는 데이터 가지고 필터id 사용해 필터 설정 만들기

    await axios.post(
      `${FILTER_INIT_URL}/<filter_id>/settings`,
      settings_table_data
    );
  } catch (error) {
    console.log("error :>> ", error);
  }
};

export default filterMake;
