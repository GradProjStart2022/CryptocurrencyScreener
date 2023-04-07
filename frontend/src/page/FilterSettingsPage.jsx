import { useState } from "react";

import {
  Box,
  Button,
  Card,
  FormControlLabel,
  Grid,
  Modal,
  Paper,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import BasicFilterComponent from "../component/BasicFilterList.jsx";
import UserFilterList from "../component/UserFilterList.jsx";
import FilterSelectTabs from "./modal/FilterSelectTabs.jsx";

/**
 * 당장 선택한 필터가 없을 때 안내하는 UI 요소를 반환할 예정
 * @param {any} props react props
 * @returns 필터 없을 때 안내하는 UI 요소
 */
const NoFilter = (props) => {
  // todo: 필터 세부 정보 영역의 flex 레이아웃 연동하기(배열 0번)
  return (
    <Typography variant="body1" component="div">
      <p>
        필터를 선택해 속성을 보거나
        <br />+ 버튼을 눌러 새 필터를 생성하세요
      </p>
    </Typography>
  );
};

/**
 * 필터상세설정페이지 UI요소 뱉어내는 함수
 * @param {any} props react props
 * @returns 필터상세설정페이지 UI 요소
 */
const FilterSettingsPage = (props) => {
  // 기본필터 탭 열고 닫는 변수
  const [openBFilter, setOpenBFilter] = useState(false);
  const handleBFliterOpen = () => setOpenBFilter(true);
  const handleBFliterClose = () => setOpenBFilter(false);

  // 복합필터 선택 폼: 사용자 복합필터의 라디오버튼
  let filterlist_testarr = [];
  for (let index = 0; index < 10; index++) {
    filterlist_testarr.push(
      <FormControlLabel
        key={index}
        value={`test${index}`}
        control={<Radio />}
        label={`test${index}`}
      />
    );
  }

  // 편집화면 기본필터: 복합필터에 속해있는 기본필터들 표시
  let basic_testarr = [];
  for (let index = 0; index < 9; index++) {
    basic_testarr.push(
      <BasicFilterComponent code="A" name="RSI" oper="=" value1="1000" />
    );
  }
  for (let index = 0; index < 9; index++) {
    basic_testarr.push(
      <BasicFilterComponent
        code="A"
        name="RSI"
        oper="="
        value1="1000"
        value2="2000"
      />
    );
  }

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
            {/* 사용자 필터 목록 영역 */}
            <UserFilterList filterList={filterlist_testarr} isSettings={true} />
            {/* 필터 세부 정보 영역 */}
            <Grid item xs={10}>
              <Card
                sx={{
                  // todo: 필터 선택 안했을때 0번, 선택했을때 1번 되게하기
                  display: ["flex", "block"][1],
                  justifyContent: ["center", "flex-start"][1],
                  alignItems: ["center", "stretch"][1],
                  height: "72vh",
                }}
              >
                {/* <NoFilter/> */}
                {/* 필터이름 영역 */}
                <Typography
                  component="div"
                  sx={{ height: "10%", width: "100%" }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant={"h6"} component="div">
                      필터 이름
                    </Typography>
                    <TextField
                      id="filter-name"
                      variant="outlined"
                      size="small"
                      sx={{ width: "80%", marginLeft: "12px" }}
                    />
                  </Paper>
                </Typography>
                {/* 조건식 영역 */}
                <Typography
                  component="div"
                  sx={{ height: "10%", width: "100%" }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant={"h6"} component="div">
                      조건식
                    </Typography>
                    <TextField
                      id="filter-name"
                      variant="outlined"
                      size="small"
                      defaultValue="A or B"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ width: "70%", marginLeft: "12px" }}
                    />
                    <Button variant="outlined" size="small">
                      괄호 삭제
                    </Button>
                    <Button variant="contained" size="small">
                      괄호 추가
                    </Button>
                  </Paper>
                </Typography>
                {/* 기본필터들 영역 */}
                <Typography
                  component="div"
                  sx={{ height: "80%", width: "100%" }}
                >
                  <Paper elevation={1} sx={{ height: "100%", width: "100%" }}>
                    <div
                      style={{
                        height: "8%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0px 1vw 0px 1vw",
                      }}
                    >
                      <Typography variant="h6" component="div">
                        필터제목의 필터 목록
                      </Typography>
                      {/* 필터 조회시에 나타나는 편집 버튼
                      <Button variant="contained" size="small">
                        편집
                      </Button> */}
                      <Button
                        onClick={handleBFliterOpen}
                        variant="contained"
                        size="small"
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                      <Modal open={openBFilter} onClose={handleBFliterClose}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "10%",
                            left: "10%",
                            width: "80%",
                            height: "80%",
                            bgcolor: "#ffffff",
                          }}
                        >
                          <FilterSelectTabs
                            handleBFliterClose={handleBFliterClose}
                          />
                        </Box>
                      </Modal>
                    </div>
                    {/* 필터에 있는 기본필터들 컴포넌트 */}
                    <Box
                      sx={{
                        height: "80%",
                        padding: "0px 4vw 0px 4vw",
                        overflow: "auto",
                      }}
                    >
                      {basic_testarr}
                    </Box>
                    <div
                      style={{
                        height: "12%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <Button variant="text" size="small">
                        초기화
                      </Button>
                      <Button variant="outlined" size="small">
                        취소
                      </Button>
                      <Button variant="contained" size="small">
                        저장
                      </Button>
                    </div>
                  </Paper>
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
