import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

const FilterSettingsPage = (props) => {
  return (
    <div className="App">
      <SideNavBar />
      <div className="content-outer">
        <div className="top-bar">
          <SearchBar />
          <LoginInfo />
        </div>
        <div className="content-view">
          <p>화면설계서 9슬라이드 필터설정 제작 예정</p>
        </div>
      </div>
    </div>
  );
};

export default FilterSettingsPage;
