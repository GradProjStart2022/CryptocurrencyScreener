import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { searchObjValue } from "../model/search_const.js";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

const TDWidgetRedirectPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRender, setIsRender] = useState(false);
  const navigate = useNavigate();

  /** 트레이딩뷰 위젯이 던져주는 암호화폐 코드 */
  let tvwidgetsymbol = searchParams.get("tvwidgetsymbol");

  /**
   * 검색바 렌더링과 동시에 변수가 로드됨
   * 해당 변수에서 코드와 동일한 객체를 찾아 로드한 후
   * 페이지 리다이렉트
   */
  useEffect(() => {
    if (isRender) {
      let user_clicked_coin = searchObjValue.find((value) => {
        return value.tradingview_market_code === tvwidgetsymbol;
      });

      navigate(`/chart/${user_clicked_coin.tradingview_upbit_code}`, {
        state: { coin: user_clicked_coin },
      });
    }
  }, [isRender]);

  return (
    <div className="App">
      <SideNavBar />
      <div className="content-outer">
        <div className="top-bar">
          <SearchBar setIsRender={setIsRender} />
          <LoginInfo />
        </div>
        <div className="content-view">
          <p>잠시만 기다려주세요...</p>
        </div>
      </div>
    </div>
  );
};

export default TDWidgetRedirectPage;
