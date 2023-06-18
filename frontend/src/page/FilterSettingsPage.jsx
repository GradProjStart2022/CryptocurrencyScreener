import { useEffect, useRef, useState } from "react";
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
import removeFilter from "../logic/removeFilter.js";
import filterModify from "../logic/filterModify.js";
import getTopFive from "../logic/getTopFive.js";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import BasicFilterComponent from "../component/BasicFilterList.jsx";
import UserFilterList from "../component/UserFilterList.jsx";
import FilterSelectTabs from "./modal/FilterSelectTabs.jsx";

/**
 * 필터 편집내역 취소 함수
 * @param {boolean} isCreate 생성모드인지 확인
 * @param {React.Dispatch<React.SetStateAction<any>>} setInputFilterName 필터이름 state setter
 * @param {React.Dispatch<React.SetStateAction<any>>} setFilterExp 복합필터 표현식 state setter
 * @param {React.Dispatch<React.SetStateAction<any>>} setCompleteBasicFilter 기본필터 정보 배열 state setter
 * @param {React.Dispatch<React.SetStateAction<any>>} setBasicFilterCompArr 기본필터 렌더링 배열 state setter
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
    // TODO 현재 필터 삭제시 사용하게 작동
    setInputFilterName("");
    setFilterExp("");
    setCompleteBasicFilter([]);
    setBasicFilterCompArr([]);
  }
};

/**
 * 당장 선택한 필터가 없을 때 안내하는 UI 요소를 반환
 * @returns 필터 없을 때 안내하는 UI 요소
 */
const NoFilter = () => {
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
 * @returns 필터상세설정페이지 UI 요소
 */
const FilterSettingsPage = () => {
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

  // top5 필터 리스트
  const [topFiveList, setTopFiveList] = useState([]);

  const expInput = useRef();

  // 페이지 접속시 많이 사용한 지표를 갱신
  useEffect(() => {
    const waitfive = async () => {
      let dat = await getTopFive();
      setTopFiveList(dat);
    };
    waitfive();
  }, []);

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
            name={isEmpty(elem.name_kr) ? elem.indicator : elem.name_kr}
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

  function replaceSelectedText() {
    const selectionStart = expInput.current.selectionStart;
    const selectionEnd = expInput.current.selectionEnd;

    let selectedText = filterExp.slice(selectionStart, selectionEnd);
    let changed_val = "";
    if (selectedText === "&") {
      changed_val = "|";
    } else if (selectedText === "|") {
      changed_val = "&";
    } else {
      alert("올바른 연산자를 선택하세요.");
      return;
    }
    let new_filter_exp =
      filterExp.slice(0, selectionStart) +
      changed_val +
      filterExp.slice(selectionEnd);
    setFilterExp(new_filter_exp);
  }

  function handleButtonClick() {
    replaceSelectedText();
  }

  const handleFilterExpChange = (event) => {
    setFilterExp(event.target.value);
  };

  const handleSaveButtonClick = async () => {
    try {
      let is_success = false;
      let filter_id = [];

      if (isCreate) {
        // 새 필터 생성
        const updatedFilterExp = expInput.current.value;
        is_success = await filterMake(
          completeBasicFilter,
          updatedFilterExp,
          inputFilterName,
          user_email,
          uid,
          filter_id,
          dispatch
        );
        if (is_success) {
          console.log("filter_id:", filter_id);
          is_success = await getUserFilterSettings(filter_id[0], dispatch);
        }
      } else {
        // 필터 편집(딸린 기본 필터들은 수정 불가)
        is_success = await filterModify(
          filterListClickID,
          uid,
          user_email,
          inputFilterName,
          filterExp,
          dispatch
        );
      }

      if (is_success) {
        let success_msg = isCreate ? "생성되었습니다." : "수정되었습니다.";
        alert(success_msg); // 성공 메시지 표시
        filterCleanup(
          isCreate,
          setInputFilterName,
          setFilterExp,
          setCompleteBasicFilter,
          setBasicFilterCompArr
        );
        setFilterListClickID(0);
        setIsCreate(false);
      } else {
        alert("생성 실패"); // 실패 메시지 표시
      }
    } catch (error) {
      console.log("error:", error);
      alert("수행 중 오류가 발생했습니다.");
    }
  };

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
                          onChange={handleFilterExpChange}
                          inputRef={expInput}
                          sx={{ width: "70%", marginLeft: "12px" }}
                        />
                        {/* TODO 조건식 사용자 직접입력으로 변경 */}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleButtonClick}>
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
                        <div className="setpage-filterselect-area">
                          <Typography variant="h6" component="div">
                            {isEmpty(inputFilterName)
                              ? "이름없는 필터"
                              : inputFilterName}
                            의 필터 목록
                          </Typography>
                          {/* 생성할때만 기본 필터 추가 가능 */}
                          {isCreate && (
                            <Button
                              onClick={handleBFliterOpen}
                              variant="contained"
                              size="small">
                              <AddIcon fontSize="small" />
                            </Button>
                          )}
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
                                topFiveList={topFiveList}
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
                        <div className="setpage-modify-btnarea">
                          {!isCreate && (
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => {
                                if (window.confirm("삭제하시겠습니까?")) {
                                  let rslt = removeFilter(
                                    filterListClickID,
                                    user_email,
                                    redux_filter_list,
                                    dispatch
                                  );
                                  filterCleanup(
                                    isCreate,
                                    setInputFilterName,
                                    setFilterExp,
                                    setCompleteBasicFilter,
                                    setBasicFilterCompArr
                                  );
                                  let msg = rslt
                                    ? "삭제되었습니다."
                                    : "오류가 발생했습니다.";
                                  alert(msg);
                                  setFilterListClickID(0);
                                } else {
                                  alert("취소되었습니다.");
                                }
                              }}>
                              삭제
                            </Button>
                          )}
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => {
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
                            onClick={handleSaveButtonClick}>
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
