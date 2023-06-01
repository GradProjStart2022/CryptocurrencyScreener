import { searchObjValue } from "../model/search_const.js";

/**
 * 검색창 엔터키 핸들링 해서 해당 종목으로 라우팅 시켜주는 함수
 * @param {React.KeyboardEvent<HTMLDivElement>} event 브라우저 이벤트 객체
 * @param {string} userTypingDat 사용자가 검색창에 타이핑한 글자
 * @param {string} userClickedDat 사용자가 검색창 요소중 클릭한 글자
 * @param {NaviagteFunction} navigate useNavigate hook
 */
const searchEnterkeyHandle = (
  event,
  userTypingDat,
  userClickedDat,
  navigate
) => {
  if (event.key === "Enter") {
    if (userClickedDat === null || userTypingDat !== userClickedDat) {
      // TODO 현재 사용자 친화적이지 않은 UX
      alert(
        "이름을 정확히 입력해 주세요.\n밑 이름에서 이미 엔터를 눌렀다면 한번만 더 눌러주세요."
      );
    } else {
      // 어떤 종목으로 가야 하는지 찾기
      let routing_obj = searchObjValue.find((value) => {
        return value.name === userClickedDat;
      });
      // 가야 하는 종목 주소에 넣고 종목 객체 넘겨주기
      navigate(`/chart/${routing_obj?.tradingview_upbit_code}`, {
        state: { coin: routing_obj },
      });
    }
  }
};

export default searchEnterkeyHandle;
