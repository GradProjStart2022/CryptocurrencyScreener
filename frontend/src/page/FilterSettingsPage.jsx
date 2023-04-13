import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  Grid,
  Modal,
  Paper,
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
  // 기본필터 탭 열고 닫는 state 변수
  const [openBFilter, setOpenBFilter] = useState(false);
  const handleBFliterOpen = () => setOpenBFilter(true);
  const handleBFliterClose = () => setOpenBFilter(false);

  // 필터 만들기 버튼 클릭 여부 확인 state
  const [createMode, setCreateMode] = useState(false);

  // UserFilterList 클릭 필터 확인용 넘겨주기 state
  const [filterListClick, setFilterListClick] = useState(0);

  // 사용자가 입력하는 복합필터 이름 state
  const [inputFilterName, setInputFilterName] = useState("");

  // 해당 복합필터의 편집용 조건식 state
  const [filterExp, setFilterExp] = useState("");

  // todo: 얘 실제 필터에 대한 배열로 바꾸기
  let basic_testarr = [];
  useEffect(() => {
    if (filterListClick !== 0) {
      console.log("filterListCheck 값 바뀜");
      basic_testarr.length = 0;
      // 편집화면 복합필터에 속해있는 기본필터들 임시 표시 컴포넌트
      for (let index = 0; index < 9; index++) {
        basic_testarr.push(
          <BasicFilterComponent
            code="A"
            name={filterListClick.toString()}
            oper="="
            value1="1000"
          />
        );
      }
      for (let index = 0; index < 9; index++) {
        basic_testarr.push(
          <BasicFilterComponent
            code="A"
            name={filterListClick.toString()}
            oper="="
            value1="1000"
            value2="2000"
          />
        );
      }
    }
  }, [filterListClick]);

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
            <UserFilterList
              isSettings={true}
              filterListClick={filterListClick}
              setFilterListClick={setFilterListClick}
              setCreateMode={setCreateMode}
            />
            {/* 필터 세부 정보 영역 */}
            <Grid item xs={10}>
              <Card
                sx={{
                  // 필터 선택 안했을때 0번, 선택했을때 1번 되어 레이아웃 조정됨
                  display: ["flex", "block"][
                    filterListClick === 0 && !createMode ? 0 : 1
                  ],
                  justifyContent: ["center", "flex-start"][
                    filterListClick === 0 && !createMode ? 0 : 1
                  ],
                  alignItems: ["center", "stretch"][
                    filterListClick === 0 && !createMode ? 0 : 1
                  ],
                  height: "72vh",
                }}
              >
                {/* 필터 선택 여부에 따라 안내 멘트 혹은 편집 컴포넌트를 출력 */}
                {filterListClick === 0 && !createMode ? (
                  <NoFilter />
                ) : (
                  <>
                    {/* 필터이름 영역 시작 */}
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
                          value={inputFilterName}
                          sx={{ width: "80%", marginLeft: "12px" }}
                          onChange={(event) => {
                            setInputFilterName(event.target.value);
                          }}
                        />
                      </Paper>
                    </Typography>
                    {/* 필터이름 영역 끝 */}
                    {/* 조건식 영역 시작 */}
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
                          value={filterExp}
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{ width: "70%", marginLeft: "12px" }}
                        />
                        {/* todo: 텍스트 긁어서 구문분석하는 라이브러리 추가 및 긁은 텍스트에 대응한 핸들러 기능 추가*/}
                        <Button variant="outlined" size="small">
                          괄호 삭제
                        </Button>
                        <Button variant="contained" size="small">
                          괄호 추가
                        </Button>
                      </Paper>
                    </Typography>
                    {/* 조건식 영역 끝 */}
                    {/* 기본필터들 영역 시작 */}
                    <Typography
                      component="div"
                      sx={{ height: "80%", width: "100%" }}
                    >
                      <Paper
                        elevation={1}
                        sx={{ height: "100%", width: "100%" }}
                      >
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
                            {inputFilterName}의 필터 목록
                          </Typography>
                          {/* // 필터 조회시에 나타나는 편집 버튼? todo: 바로 편집모드로 들어가도 상관없을 듯?
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
                          <Modal
                            open={openBFilter}
                            onClose={handleBFliterClose}
                          >
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
                        {/* 필터에 있는 기본필터들 컴포넌트 시작 */}
                        <Box
                          sx={{
                            height: "80%",
                            padding: "0px 4vw 0px 4vw",
                            overflow: "auto",
                          }}
                        >
                          {basic_testarr}
                        </Box>
                        {/* 필터에 있는 기본필터들 컴포넌트 끝 */}
                        <div
                          style={{
                            height: "12%",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => {
                              console.log(
                                "초기화 버튼 누름 todo: 편집한거 정리만 하는 코드 넣기"
                              );
                            }}
                          >
                            초기화
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              // todo: 편집한거 정리하는 코드 넣기
                              setCreateMode(false);
                            }}
                          >
                            취소
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              // todo: 편집한거 저장하는 코드 넣기
                              setCreateMode(false);
                            }}
                          >
                            저장
                          </Button>
                        </div>
                      </Paper>
                    </Typography>
                    {/* 기본필터들 영역 끝 */}
                  </>
                )}
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default FilterSettingsPage;
