/**
 * 문자열 주고 비었는지 안비었는지 판단하는 함수
 * todo: lodash 설치 후 isEmpty()로 대체 후 삭제
 * @param {string} value 비었는지 체크할 문자열
 * @returns 해당 문자열이 비었는지 여부
 */
const isStrEmpty = (value) => {
  if (
    value === "" ||
    value == null ||
    value === undefined ||
    (value !== null && typeof value === "object" && !Object.keys(value).length)
  ) {
    return true;
  } else {
    return false;
  }
};

export default isStrEmpty;
