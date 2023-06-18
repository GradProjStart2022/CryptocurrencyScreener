import { useEffect, useState } from "react";
import { cloneDeep, isEmpty } from "lodash-es";

import { Box, Button, Grid, Typography, Tabs, Tab } from "@mui/material";

import SELECT_MENU_LIST from "../../model/const/SELECT_MENU_LIST.js";
import SELECT_MENU_OPER from "../../model/const/SELECT_MENU_OPER.js";
import { basicFilterArr } from "../../model/basic_filter_const.js";
import localCSVFetch from "../../logic/localCSVFetch.js";
import basicValueInit from "../../logic/basicValueInit.js";
import addAlphabet from "../../logic/addFilterExpressionAlphabet.js";

import SelectWithText from "../../component/basic_filter/SelectWithText.jsx";
import { TabPanel } from "../../component/TabPanel.jsx";

const listTabSxCss = {
  height: "100%",
  maxHeight: "100%",
  alignContent: "start",
  overflow: "scroll",
};

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
        // selectMenu={SELECT_MENU_LIST}
        filterType={element?.type}
        valueObj={basic_value}
        valueSetter={setBasicValue}
      />
    );
  }
};

/**
 * 기본필터 설정 탭 컴포넌트 함수
 * @param {any} props react props
 * @returns 기본필터 설정 전체 탭 컴포넌트
 */
const FilterSelectTabs = (props) => {
  /** 생성상태 확인 state(기존필터 편집시 false)
   * @type {boolean} */
  const isCreate = props.isCreate;

  /** 클릭 필터 ID 확인용 변수
   * @type {number} */
  const filterListClickID = props.filterListClickID;

  /** 상위 컴포넌트 필터 설정 페이지에서 가져온 기본 필터 객체 배열 state
   * @type {object[]} */
  const completeFilter = props.completeBasicFilter;
  /** @type {React.Dispatch<React.SetStateAction<object[]>>} */
  const setCompleteFilter = props.setCompleteBasicFilter;

  /** top5 필터 리스트 (이름, 카운트만 가짐)
   * @type {object[]} */
  const topFiveList = props.topFiveList;

  // 어느 탭인지 확인하는 변수
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 기본 필터 컴포넌트 렌더링용 저장 변수
  const [basicComponentList, setBasicComponentList] = useState([]);

  // 기본 필터 컴포넌트 입력 요소 핸들링용 변수
  const [basicValueHandle, setBasicValueHandle] = useState([]);

  let new_basic_comp_list = [];
  /** CSV파일 해독 후 기본 필터들의 핸들링 변수 생성 */
  useEffect(() => {
    const awaitCSV = async () => {
      await localCSVFetch("basic_filter_name.csv", basicFilterArr);
      let basic_obj_arr = basicValueInit(basicFilterArr.length);
      if (filterListClickID === 0 && isEmpty(completeFilter)) {
        setBasicValueHandle(basic_obj_arr);
      } else {
        // basic_obj_arr과 기존 필터 데이터(completeFilter) 병합
        // TODO 편집시에는 지금 기존 필터 데이터 아무것도 안들어감
        completeFilter.forEach((value, _) => {
          if (value.is_used === true) {
            basic_obj_arr[value.idx] = cloneDeep(value);
          }
        });
        setBasicValueHandle(basic_obj_arr);
      }
    };
    awaitCSV();
  }, []);

  /** 핸들링 변수를 포함해 기본 필터들 컴포넌트 생성 */
  useEffect(() => {
    if (!isEmpty(basicValueHandle)) {
      basicComponentInit(
        new_basic_comp_list,
        basicFilterArr,
        basicValueHandle,
        setBasicValueHandle
      );
      setBasicComponentList(new_basic_comp_list);
    }
  }, [basicValueHandle]);

  return (
    <Box sx={{ overflow: "scroll" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {/* 탭쪽 필터 설정 버튼 시작 */}
        <Typography
          variant="body1"
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 8px 8px 8px",
          }}>
          <span>필터 선택</span>
          <span>
            <Button
              variant="text"
              onClick={() => {
                let basic_obj_arr = [];
                if (isCreate) {
                  basic_obj_arr = basicValueInit(basicFilterArr.length);
                } else {
                  // basic_obj_arr과 기존 필터 데이터(completeFilter) 병합
                  // TODO 혹시나 기존 필터 데이터 다를 경우 병합 로직 수정
                  basic_obj_arr = basicValueInit(basicFilterArr.length);
                  completeFilter.forEach((value, _) => {
                    if (value.is_used === true) {
                      basic_obj_arr[value.idx] = cloneDeep(value);
                    }
                  });
                }
                setBasicValueHandle(basic_obj_arr);
              }}>
              선택 초기화
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                let basic_obj_arr = [];
                if (isCreate) {
                  basic_obj_arr = basicValueInit(basicFilterArr.length);
                } else {
                  // basic_obj_arr과 기존 필터 데이터(completeFilter) 병합
                  // todo: 혹시나 기존 필터 데이터 다를 경우 병합 로직 수정
                  basic_obj_arr = basicValueInit(basicFilterArr.length);
                  completeFilter.forEach((value, _) => {
                    if (value.is_used === true) {
                      basic_obj_arr[value.idx] = cloneDeep(value);
                    }
                  });
                }
                setBasicValueHandle(basic_obj_arr);
                props.handleBFliterClose();
              }}>
              취소
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                // TODO basicValueHandle 건드려서 사용된 거 체크하고 object 만든 후 completeFilter props 갱신
                let temp_basic_complete = [];
                let last_alpha = null;
                let gen_idx = 0;
                if (!isCreate) {
                  // todo: 필터 수정에 대해 알파벳 어떻게 부여할지 결정
                  // last_alpha = "Z"
                }
                basicValueHandle.forEach((value) => {
                  if (value.is_used) {
                    let will_codename_value = cloneDeep(value);
                    will_codename_value.name = addAlphabet(gen_idx, last_alpha);
                    temp_basic_complete.push(will_codename_value);
                    gen_idx++;

                    if (
                      value.oper !== SELECT_MENU_OPER[4] &&
                      value.oper !== SELECT_MENU_OPER[5]
                    ) {
                      will_codename_value.value2 = null;
                    }
                  }
                });
                setCompleteFilter(temp_basic_complete);
                props.handleBFliterClose();
              }}>
              확인
            </Button>
          </span>
        </Typography>
        {/* 탭쪽 필터 설정 버튼 끝 */}
        {/* 탭 버튼 시작 */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic filter custom tabs">
          <Tab label="전체" />
          <Tab label="서술적" />
          <Tab label="기술적" />
          <Tab label="나의 필터" />
          <Tab label="TOP5 필터" />
        </Tabs>
        {/* 탭 버튼 끝 */}
      </Box>
      {/* 전체 필터 영역 시작 */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ height: "68vh", overflow: "scroll" }}>
          <Grid container spacing={0} sx={listTabSxCss}>
            {basicComponentList}
          </Grid>
        </Box>
      </TabPanel>
      {/* 전체 필터 영역 끝 */}
      {/* 서술적 필터 영역 시작 */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ height: "68vh", overflow: "scroll" }}>
          <Grid container spacing={0} sx={listTabSxCss}>
            {basicComponentList.filter((elem) => {
              return elem?.props.filterType === "descriptive";
            })}
          </Grid>
        </Box>
      </TabPanel>
      {/* 서술적 필터 영역 끝 */}
      {/* 기술적 필터 영역 시작 */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ height: "68vh", overflow: "scroll" }}>
          <Grid container spacing={0} sx={listTabSxCss}>
            {basicComponentList.filter((elem) => {
              return elem?.props.filterType === "technical";
            })}
          </Grid>
        </Box>
      </TabPanel>
      {/* 기술적 필터 영역 끝 */}
      {/* 나의 필터 영역 시작 */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ height: "68vh", overflow: "scroll" }}>
          <Grid container spacing={0} sx={listTabSxCss}>
            {/* todo: 필터링 로직 맞는지 점검 */}
            {basicComponentList.filter((elem) => {
              return elem?.props.valueObj?.is_used === true;
            })}
          </Grid>
        </Box>
      </TabPanel>
      {/* 나의 필터 영역 끝 */}
      {/* TOP5 필터 영역 시작 */}
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ height: "68vh", overflow: "scroll" }}>
          <Grid container spacing={0} sx={listTabSxCss}>
            {/* TODO: 필터링 로직 정상작동 확인 */}
            {basicComponentList.filter((elem) => {
              let abb = elem?.props.valueObj?.abbreviation;
              return topFiveList.find((value) => value.indicator === abb);
            })}
          </Grid>
        </Box>
      </TabPanel>
      {/* 추천 필터 영역 끝 */}
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
