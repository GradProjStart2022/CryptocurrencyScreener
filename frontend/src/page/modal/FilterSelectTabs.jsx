import { useState } from "react";

import { Box, Button, Grid, Typography, Tabs, Tab } from "@mui/material";

import CheckOnly from "../../component/basic_filter/CheckOnly.jsx";
import SelectWithText from "../../component/basic_filter/SelectWithText.jsx";
import SlideValue from "../../component/basic_filter/SlideValue.jsx";
import CheckWithSelect from "../../component/basic_filter/CheckWithSelect.jsx";

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
      style={{ height: "100%" }}
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
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 체크표시선택모듈용 임시 변수
  const sampleNames = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];

  return (
    <Box sx={{ width: "100%" }}>
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
            <Button variant="text">선택 초기화</Button>
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
          <Tab label="파이낸셜" />
          <Tab label="기술적" />
          <Tab label="나의 필터" />
        </Tabs>
      </Box>
      {/* 전체 필터 영역 */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ height: "100%", overflow: "auto", maxHeight: "100%" }}>
          <Grid
            container
            spacing={0}
            sx={{ height: "100%", alignContent: "start" }}
          >
            {/* 체크표시모듈 */}
            <CheckOnly filterName="체크만할요소" />
            {/* 셀렉트+텍스트 입력 */}
            <SelectWithText
              filterName="셀렉트 + 텍스트입력"
              selectMenu={["미만", "작거나 같음", "큼"]}
            />
            {/* 체크표시선택 */}
            <CheckWithSelect
              filterName="체크표시선택모듈: 미완"
              checkList={sampleNames}
            />
            {/* 슬라이더 */}
            <SlideValue
              filterName="슬라이더컨트롤"
              valStart={10}
              valEnd={1000}
              minDist={10}
            />
          </Grid>
        </Box>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        서술적
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        파이낸셜
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        기술적
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        나의 필터
      </TabPanel>
    </Box>
  );
};

export default FilterSelectTabs;
