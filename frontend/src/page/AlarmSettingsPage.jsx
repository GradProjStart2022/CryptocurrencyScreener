import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

const AlarmSettingsPage = (props) => {
  return (
    <div className="App">
      <SideNavBar />
      <div className="content-outer">
        <div className="top-bar">
          <SearchBar />
          <LoginInfo />
        </div>
        <div className="content-view">
          <p>화면설계서 13슬라이드 알람설정페이지 제작 예정</p>
        </div>
      </div>
    </div>
  );
};

export default AlarmSettingsPage;
