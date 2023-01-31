import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

const BookmarkPage = (props) => {
  return (
    <div className="App">
      <SideNavBar />
      <div className="content-outer">
        <div className="top-bar">
          <SearchBar />
          <LoginInfo />
        </div>
        <div className="content-view">
          <p>화면정의서 15슬라이드 즐겨찾기 페이지 제작 예정</p>
        </div>
      </div>
    </div>
  );
};

export default BookmarkPage;
