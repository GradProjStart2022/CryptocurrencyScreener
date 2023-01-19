import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="nav-list">
        <div className="testbox"></div>
        <div className="testbox"></div>
        <div className="testbox"></div>
        <div className="testbox"></div>
        <div className="testbox"></div>
      </div>
      <div className="content-outer">
        <div className="top-bar">
          <div className="search-bar">
            <i className="fa fa-search"></i>
            <input
              type="text"
              className="form-control form-input"
              placeholder="Search..."
            />
          </div>

          <div className="account-area">
            {/* <button className="login-btn">로그인</button> */}

            <div className="user-noti"></div>
            <div className="account-info">
              <img src={""} alt={"사진"} className="acc-profile"></img>
              <span className="acc-name">계정명</span>
            </div>
          </div>
        </div>
        <div className="content-view">
          <p>영역구분 테스트용 텍스트</p>
        </div>
      </div>
    </div>
  );
}

export default App;
