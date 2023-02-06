import { Card, Grid, Typography } from "@mui/material";
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
          <div style={{ marginLeft: "12px", marginTop: "24px" }}>
            <h1>필터 설정</h1>
          </div>
          <Grid
            container
            spacing={2}
            sx={{ marginLeft: "12px", marginTop: "24px", minHeight: "90%" }}
          >
            <Grid item xs={2}>
              <Card>
                <Typography variant="h6" component="div">
                  사용자 필터 목록
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={10}>
              <Card
                sx={{
                  display: "flex",
                  alignContent: "center",
                  flexDirection: "center",
                }}
              >
                <Typography variant="body1" component="div">
                  필터를 선택해 속성을 보거나
                  <br />+ 버튼을 눌러 새 필터를 생성하세요
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default FilterSettingsPage;
