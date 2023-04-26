import { useEffect, useState } from "react";
import { isEmpty } from "lodash-es";
import { useDispatch, useSelector } from "react-redux";

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

import filterMake from "../logic/filterMaketoServer.js";
import getUserFilterSettings from "../logic/getUserFilterSettings.js";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import BasicFilterComponent from "../component/BasicFilterList.jsx";
import UserFilterList from "../component/UserFilterList.jsx";
import FilterSelectTabs from "./modal/FilterSelectTabs.jsx";
import filterMake from "../logic/filterMaketoServer.js";
import { useDispatch, useSelector } from "react-redux";
import getUserFilter from "../logic/getUserFilterFromServer.js";

/**
 * 필터 편집내역 취소 함수
 * @param {boolean} isCreate 생성모드인지 확인
 * @param {*} setInputFilterName 필터이름 state setter
 * @param {*} setFilterExp 복합필터 표현식 state setter
 * @param {*} setCompleteBasicFilter 기본필터 정보 배열 state setter
 * @param {*} basicFilterCompArr 기본필터 렌더링 배열 state setter
 */
const filterCleanup = (
  isCreate,
  setInputFilterName,
  setFilterExp,
  setCompleteBasicFilter,
  setBasicFilterCompArr
) => {
  if (isCreate) {
    setInputFilterName("");
    setFilterExp("");
    setCompleteBasicFilter([]);
    // basicFilterCompArr.length = 0;
    setBasicFilterCompArr([]);
  } else {
    // todo: 기존 필터 저장 내역과 연동
  }
};

/**
 * 당장 선택한 필터가 없을 때 안내하는 UI 요소를 반환
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
  const dispatch = useDispatch();
  /** @type {string} */
  const user_email = useSelector((state) => state.user.email);
  /** @type {number} */
  const uid = useSelector((state) => state.user.uid);
  /** @type {object[]} */
  const redux_filter_list = useSelector(
    (state) => state.userFilter.filter_list
  );
  /** @type {object[]} */
  const redux_filter_data = useSelector(
    (state) => state.userFilter.filter_data
  );

  const redux_userFilterSelector = useSelector((state) => state.userFilter);

  // 기본필터 탭 열고 닫는 state 변수
  const [openBFilter, setOpenBFilter] = useState(false);
  const handleBFliterOpen = () => setOpenBFilter(true);
  const handleBFliterClose = () => setOpenBFilter(false);

  // 필터 만들기 버튼 클릭 여부 확인 state
  const [isCreate, setIsCreate] = useState(false);

  // UserFilterList 클릭 필터 확인용 넘겨주기 state -> 0번 ID는 클릭한 것 없음
  const [filterListClickID, setFilterListClickID] = useState(0);

  // 사용자가 입력하는 복합필터 이름 state
  const [inputFilterName, setInputFilterName] = useState("");

  // 해당 복합필터의 편집용 조건식 state
  const [filterExp, setFilterExp] = useState("");

  // 현 기본필터 정보 배열
  const [completeBasicFilter, setCompleteBasicFilter] = useState([]);

  // 복합 필터에 대한 기본필터 렌더링 요소
  const [basicFilterCompArr, setBasicFilterCompArr] = useState([]);

  // 체크한 복합 필터가 바뀔 때마다 정보 불러와서 기본필터정보 렌더링 요소 변경
  useEffect(() => {
    if (filterListClickID !== 0) {
      let filter_data = redux_filter_list.find((value) => {
        return value.id === Number(filterListClickID);
      });

      let filter_settings_data = redux_filter_data.find((value) => {
        return value.filter_id === Number(filterListClickID);
      });

      let temp_comparr = [];
      filter_settings_data.settings.forEach((elem) => {
        temp_comparr.push(
          <BasicFilterComponent
            code={elem.name}
            name={elem.name_kr}
            oper={elem.oper}
            value1={elem.value1}
            value2={elem.value2}
          />
        );
      });
      setFilterExp(filter_data?.expression);
      setInputFilterName(filter_data?.name);
      setBasicFilterCompArr(temp_comparr);
    }
  }, [filterListClickID]);

  // 생성에 대한 기본필터 state 변경될 때마다 기본필터 렌더링 요소 변경
  useEffect(() => {
    let temp_exp = [];
    setBasicFilterCompArr([]);
    let temp_comparr = [];

    completeBasicFilter.forEach((elem) => {
      temp_exp.push(elem.name);

      temp_comparr.push(
        <BasicFilterComponent
          code={elem.name}
          name={elem.name_kr}
          oper={elem.oper}
          value1={elem.value1}
          value2={elem.value2}
        />
      );
    });

    setFilterExp(temp_exp.join("&"));
    setBasicFilterCompArr(temp_comparr);
  }, [completeBasicFilter]);

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
            sx={{ marginLeft: "12px", marginTop: "24px", minHeight: "90%" }}>
            {/* 사용자 필터 목록 영역 */}
            <UserFilterList
              isSettings={true}
              filterListClickID={filterListClickID}
              setFilterListClickID={setFilterListClickID}
              setCreateMode={setIsCreate}
            />
            {/* 필터 세부 정보 영역 */}
            <Grid item xs={10}>
              <Card
                sx={{
                  // 필터 선택 안했을때 0번, 선택했을때 1번 되어 레이아웃 조정됨
                  display: ["flex", "block"][
                    filterListClickID === 0 && !isCreate ? 0 : 1
                  ],
                  justifyContent: ["center", "flex-start"][
                    filterListClickID === 0 && !isCreate ? 0 : 1
                  ],
                  alignItems: ["center", "stretch"][
                    filterListClickID === 0 && !isCreate ? 0 : 1
                  ],
                  height: "72vh",
                }}>
                {/* 필터 선택 여부에 따라 안내 멘트 혹은 편집 컴포넌트를 출력 */}
                {filterListClickID === 0 && !isCreate ? (
                  <NoFilter />
                ) : (
                  <>
                    {/* 필터이름 영역 시작 */}
                    <Typography
                      component="div"
                      sx={{ height: "10%", width: "100%" }}>
                      <Paper
                        elevation={1}
                        sx={{
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}>
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
                      sx={{ height: "10%", width: "100%" }}>
                      <Paper
                        elevation={1}
                        sx={{
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}>
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
                        {/* todo: 텍스트 긁어서 구문분석하는 라이브러리 추가 및 긁은 텍스트에 대응한 핸들러 기능 추가 */}
                        <Button variant="outlined" size="small">
                          {"& <-> |"}
                        </Button>
                        <Button variant="contained" size="small">
                          괄호 추가/삭제
                        </Button>
                      </Paper>
                    </Typography>
                    {/* 조건식 영역 끝 */}
                    {/* 기본필터들 영역 시작 */}
                    <Typography
                      component="div"
                      sx={{ height: "80%", width: "100%" }}>
                      <Paper
                        elevation={1}
                        sx={{ height: "100%", width: "100%" }}>
                        <div
                          style={{
                            height: "8%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0px 1vw 0px 1vw",
                          }}>
                          <Typography variant="h6" component="div">
                            {isEmpty(inputFilterName)
                              ? "이름없는 필터"
                              : inputFilterName}
                            의 필터 목록
                          </Typography>
                          <Button
                            onClick={handleBFliterOpen}
                            variant="contained"
                            size="small">
                            <AddIcon fontSize="small" />
                          </Button>
                          <Modal
                            open={openBFilter}
                            onClose={handleBFliterClose}>
                            <Box
                              sx={{
                                position: "absolute",
                                top: "10%",
                                left: "10%",
                                width: "80%",
                                height: "80%",
                                bgcolor: "#ffffff",
                              }}>
                              <FilterSelectTabs
                                handleBFliterClose={handleBFliterClose}
                                isCreate={isCreate}
                                filterListClickID={filterListClickID}
                                completeBasicFilter={completeBasicFilter}
                                setCompleteBasicFilter={setCompleteBasicFilter}
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
                          }}>
                          {basicFilterCompArr}
                        </Box>
                        {/* 필터에 있는 기본필터들 컴포넌트 끝 */}
                        <div
                          style={{
                            height: "12%",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => {
                              // todo: 편집한거 정리만 하는 코드 정상작동 확인
                              filterCleanup(
                                isCreate,
                                setInputFilterName,
                                setFilterExp,
                                setCompleteBasicFilter,
                                setBasicFilterCompArr
                              );
                            }}>
                            초기화
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              // todo: 편집한거 정리하는 코드 정상작동 확인
                              filterCleanup(
                                isCreate,
                                setInputFilterName,
                                setFilterExp,
                                setCompleteBasicFilter,
                                setBasicFilterCompArr
                              );
                              setFilterListClickID(0);
                              setIsCreate(false);
                            }}>
                            취소
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={async () => {
                              // todo: 편집한거 저장하는 코드 정상작동 확인
                              let is_success = false;
                              let filter_id = [];
                              try {
                                if (isCreate) {
                                  is_success = await filterMake(
                                    completeBasicFilter,
                                    filterExp,
                                    inputFilterName,
                                    user_email,
                                    uid,
                                    filter_id,
                                    dispatch
                                  );
                                  if (is_success) {
                                    console.log("filter_id :>> ", filter_id);
                                    is_success = await getUserFilterSettings(
                                      filter_id[0],
                                      dispatch
                                    );
                                  }
                                } else {
                                  // todo: 편집하는 함수 제작
                                }
                                switch (is_success) {
                                  case true:
                                    alert("생성되었습니다.");
                                    filterCleanup(
                                      isCreate,
                                      setInputFilterName,
                                      setFilterExp,
                                      setCompleteBasicFilter,
                                      setBasicFilterCompArr
                                    );
                                    setFilterListClickID(0);
                                    setIsCreate(false);
                                    break;
                                  case false:
                                  default:
                                    alert("생성중 문제가 발생했습니다.");
                                    break;
                                }
                              } catch (error) {
                                console.log("error :>> ", error);
                              }
                            }}>
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
