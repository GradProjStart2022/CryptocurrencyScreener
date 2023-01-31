import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

/**
 * 화면설계서 6슬라이드 종목 전체가 나오는 화면
 * @param {*} props
 * @returns
 */
const ChartListPage = (props) => {
  return (
    <div className="App">
      <SideNavBar />
      <div className="content-outer">
        <div className="top-bar">
          <SearchBar />
          <LoginInfo />
        </div>
        <div className="content-view">
          <p>화면설계서 6번 화면 제작 예정</p>
        </div>
      </div>
    </div>
  );
};

export default ChartListPage;
