import { useEffect, useState } from "react";

import { Box, Button, Grid, Typography, Tabs, Tab } from "@mui/material";

import SelectWithText from "../../component/basic_filter/SelectWithText.jsx";
import localCSVFetch from "../../logic/localCSVFetch.js";
import { basicFilterArr } from "../../model/basic_filter_const.js";

const SELECT_MENU_LIST = [
  "작음",
  "작거나 같음",
  "큼",
  "크거나 같음",
  "사이",
  "외부 값",
  "같음",
  "같지 않음",
];

/**
 * 기본 필터 컴포넌트를 생성하고 배열에 삽입하는 함수
 * @param {JSX.element[]} component_arr 렌더링할 컴포넌트가 삽입되는 배열
 * @param {object[]} info_arr 기본 필터 정보 배열
 * @param {object[]} basic_value 핸들링 변수 object 배열 state
 * @param {React.Dispatch<React.SetStateAction<any[]>>} setBasicValue 핸들링 변수 setter
 */
const basicComponentInit = (
  component_arr,
  info_arr,
  basic_value,
  setBasicValue
) => {
  for (let index = 0; index < info_arr.length; index++) {
    const element = info_arr[index];
    component_arr.push(
      <SelectWithText
        idx={index}
        customKey={`basic_filter_select_${index}`}
        filterName={element?.name_kr}
        selectMenu={SELECT_MENU_LIST}
        filterType={element?.type}
        valueObj={basic_value}
        valueSetter={setBasicValue}
      />
    );
  }
};

/**
 * 컴포넌트에 필요한 핸들링 변수를 초기화하는 함수
 * @param {number} length 필요한 컴포넌트 수
 * @returns {object[]} 초기화가 완료된 handling 요소 object 배열
 */
const basicValueInit = (length) => {
  let temp_init_state = [];
  for (let index = 0; index < length; index++) {
    temp_init_state.push({
      idx: index,
      is_used: false,
      oper_kor: SELECT_MENU_LIST[0],
      value1: 0,
      value2: 0,
    });
  }

  return temp_init_state;
};

/**
 * 기본필터 설정용 탭패널 컴포넌트 함수
 * @param {any} props react props
 * @returns 탭패널 요소 UI 컴포넌트
 */
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ overflow: "scroll" }}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

/**
 * 기본필터 설정 탭 컴포넌트 함수
 * @param {any} props react props
 * @returns 기본필터 설정 전체 탭 컴포넌트
 */
const FilterSelectTabs = (props) => {
  // 어느 탭인지 확인하는 변수
  const [tabValue, setTabValue] = useState(0);
  // 기본 필터 컴포넌트 렌더링용 저장 변수
  const [basicComponentList, setBasicComponentList] = useState([]);
  // 기본 필터 컴포넌트 입력 요소 핸들링용 변수
  const [basicValueHandle, setBasicValueHandle] = useState([]);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  let new_comp_list = [];
  /** CSV파일 해독 후 기본 필터들의 핸들링 변수 생성 */
  useEffect(() => {
    const awaitCSV = async () => {
      await localCSVFetch("basic_filter_name.csv", basicFilterArr);
      let basic_obj_arr = basicValueInit(basicFilterArr.length);
      setBasicValueHandle(basic_obj_arr);
    };
    awaitCSV();
  }, []);

  /** 핸들링 변수를 포함해 기본 필터들 컴포넌트 생성 */
  useEffect(() => {
    basicComponentInit(
      new_comp_list,
      basicFilterArr,
      basicValueHandle,
      setBasicValueHandle
    );
    setBasicComponentList(new_comp_list);
  }, [basicValueHandle]);

  return (
    <Box sx={{ overflow: "scroll" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {/* 탭쪽 필터 설정 버튼 */}
        <Typography
          variant="body1"
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 8px 8px 8px",
          }}
        >
          <span>필터 선택</span>
          <span>
            <Button
              variant="text"
              onClick={() => {
                basicValueInit(setBasicValueHandle, basicFilterArr.length);
              }}
            >
              선택 초기화
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                props.handleBFliterClose();
              }}
            >
              취소
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                props.handleBFliterClose();
              }}
            >
              확인
            </Button>
          </span>
        </Typography>
        {/* 탭 버튼 */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic filter custom tabs"
        >
          <Tab label="전체" />
          <Tab label="서술적" />
          <Tab label="기술적" />
          <Tab label="나의 필터" />
          <Tab label="추천 필터" />
        </Tabs>
      </Box>
      {/* 전체 필터 영역 */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ height: "68vh", overflow: "scroll" }}>
          <Grid
            container
            spacing={0}
            sx={{
              height: "100%",
              maxHeight: "100%",
              alignContent: "start",
              overflow: "scroll",
            }}
          >
            {basicComponentList}
          </Grid>
        </Box>
      </TabPanel>
      {/* 서술적 필터 영역 */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ height: "68vh", overflow: "scroll" }}>
          <Grid
            container
            spacing={0}
            sx={{
              height: "100%",
              maxHeight: "100%",
              alignContent: "start",
              overflow: "scroll",
            }}
          >
            {basicComponentList.filter((elem) => {
              return elem?.props.filterType === "descriptive";
            })}
          </Grid>
        </Box>
      </TabPanel>
      {/* 기술적 필터 영역 */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ height: "68vh", overflow: "scroll" }}>
          <Grid
            container
            spacing={0}
            sx={{
              height: "100%",
              maxHeight: "100%",
              alignContent: "start",
              overflow: "scroll",
            }}
          >
            {basicComponentList.filter((elem) => {
              return elem?.props.filterType === "technical";
            })}
          </Grid>
        </Box>
      </TabPanel>
      {/* 나의 필터 영역 */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ height: "68vh", overflow: "scroll" }}>
          <Grid
            container
            spacing={0}
            sx={{
              height: "100%",
              maxHeight: "100%",
              alignContent: "start",
              overflow: "scroll",
            }}
          >
            {/* todo: 필터링 로직 해서 컴포넌트 넣기 */}
          </Grid>
        </Box>
      </TabPanel>
      {/* 추천 필터 영역 */}
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ height: "68vh", overflow: "scroll" }}>
          <Grid
            container
            spacing={0}
            sx={{
              height: "100%",
              maxHeight: "100%",
              alignContent: "start",
              overflow: "scroll",
            }}
          >
            {/* todo: 필터링 로직 해서 컴포넌트 넣기 */}
          </Grid>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default FilterSelectTabs;

// 체크표시선택모듈용 임시 변수
// const sampleNames = [
//   "Oliver Hansen",
//   "Van Henry",
//   "April Tucker",
//   "Ralph Hubbard",
//   "Omar Alexander",
//   "Carlos Abbott",
//   "Miriam Wagner",
//   "Bradley Wilkerson",
//   "Virginia Andrews",
//   "Kelly Snyder",
// ];
// {/* 체크표시모듈 */}
// <CheckOnly filterName="체크만할요소" />
// {/* 셀렉트+텍스트 입력 */}
// <SelectWithText
//   filterName="셀렉트 + 텍스트입력"
//   selectMenu={}
// />
// {/* 체크표시선택 */}
// <CheckWithSelect
//   filterName="체크표시선택모듈: 미완"
//   checkList={sampleNames}
// />
// {/* 슬라이더 */}
// <SlideValue
//   filterName="슬라이더컨트롤"
//   valStart={10}
//   valEnd={1000}
//   minDist={10}
// />
