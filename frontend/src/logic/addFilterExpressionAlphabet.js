import { isNull } from "lodash-es";

/**
 * 생성 인덱스 순서를 받아 필터 표현식용 알파벳 반환해주는 함수
 * @param {number} index 생성 순서
 * @param {string|null} last_alpha 마지막 알파벳, 신규생성이 아닐경우만 의미있는 값 삽입
 * @returns {string} A~ZZ까지의 알파벳
 */
const addAlphabet = (index, last_alpha) => {
  if (isNull(last_alpha)) {
    // 필터 신규 제작시
    if (index < 26) {
      // A ~ Z
      return String.fromCharCode(65 + index);
    } else {
      // AA ~ ZZ
      let alpha_code = new Array(2);
      alpha_code[0] = index / 26;
      alpha_code[1] = index % 26;
      return String.fromCharCode(65 + alpha_code[0], 65 + alpha_code[1]);
    }
  } else {
    // 기존 필터 알파벳 변경시
    // TODO 중간에 빠진거 채울지 새거부터 할지
    return String();
  }
};

export default addAlphabet;
