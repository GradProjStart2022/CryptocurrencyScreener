import SELECT_MENU_LIST from "../model/const/SELECT_MENU_LIST.js";
import SELECT_MENU_OPER from "../model/const/SELECT_MENU_OPER.js";

/**
 * 컴포넌트에 필요한 핸들링 변수를 초기화하는 함수
 * @param {object[]} basicFilterArr 기본필터정보 redux store
 * @returns {object[]} 초기화가 완료된 handling 요소 object 배열
 */
const basicValueInit = (basicFilterArr) => {
  let temp_init_state = [];

  for (let index = 0; index < basicFilterArr.length; index++) {
    // 연산자 기호 데이터 추가
    temp_init_state.push({
      idx: index,
      is_used: false,
      indicator: basicFilterArr[index].abbreviation,
      oper_kor: SELECT_MENU_LIST[0],
      oper: SELECT_MENU_OPER[0],
      value1: 0,
      value2: 0,
      is_dual_value: false,
      name: "",
      name_kr: basicFilterArr[index].name_kr,
    });
  }

  return temp_init_state;
};

export default basicValueInit;
