import { useState } from "react";

import {
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Tabs,
  Tab,
  Checkbox,
  Select,
  MenuItem,
  Slider,
  ListItemText,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import SwapVertIcon from "@mui/icons-material/SwapVert";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

/**
 * 기본필터 설정용 탭패널 컴포넌트 함수
 * @param {any} props react props
 * @returns 탭패널 요소 컴포넌트
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

  // 값쪽 셀렉트 임시로 체크하는 변수
  const [condition, setCondition] = useState("미만");
  const handleConditionChange = (event) => {
    setCondition(event.target.value);
  };

  // 슬라이더 구간 임시로 정하는 변수
  const minDistance = 10;
  const [sliderVal, setSliderVal] = useState([0, Number.MAX_SAFE_INTEGER]);
  const handleSliderChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setSliderVal([
        Math.min(newValue[0], sliderVal[1] - minDistance),
        sliderVal[1],
      ]);
    } else {
      setSliderVal([
        sliderVal[0],
        Math.max(newValue[1], sliderVal[0] + minDistance),
      ]);
    }
  };

  // 체크표시모듈용 임시 변수
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
  const [filterNames, setFilterNames] = useState([]);
  const handleFilterNames = (event) => {
    const {
      target: { value },
    } = event;
    setFilterNames(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

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
            {/* 체크표시모듈 (컴포넌트 모듈화 필요) */}
            <Grid item xs={6} sx={{ height: "48px" }}>
              <Box
                sx={{
                  height: "48px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" component="span">
                  체크표시모듈
                </Typography>
                <Checkbox />
              </Box>
            </Grid>
            {/* 셀렉트+텍스트 입력 (컴포넌트 모듈화 필요) */}
            <Grid item xs={6} sx={{ height: "48px" }}>
              <Box
                sx={{
                  height: "48px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" component="span">
                  셀렉트+텍스트입력
                </Typography>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FormControl size="small">
                    <Select
                      value={condition}
                      onChange={handleConditionChange}
                      displayEmpty
                    >
                      <MenuItem value="미만">미만</MenuItem>
                      <MenuItem value="작거나 같음">작거나 같음</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField variant="outlined" size="small" />
                </span>
              </Box>
            </Grid>
            {/* 체크표시선택 (컴포넌트 모듈화 필요) */}
            <Grid item xs={6} sx={{ height: "48px" }}>
              <Box
                sx={{
                  height: "48px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" component="span">
                  체크표시모듈(미완)
                </Typography>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "40%",
                  }}
                >
                  <FormControl size="small" sx={{ width: "100%" }}>
                    <Select
                      value={filterNames}
                      onChange={handleFilterNames}
                      renderValue={(selected) => selected.join(", ")}
                      multiple
                      displayEmpty
                      sx={{ width: "100%" }}
                    >
                      {sampleNames.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={filterNames.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </span>
              </Box>
            </Grid>
            {/* 슬라이더 (컴포넌트 모듈화 필요) */}
            <Grid item xs={6} sx={{ height: "48px" }}>
              <Box
                sx={{
                  height: "48px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" component="span">
                  슬라이더
                </Typography>
                <span
                  style={{
                    maxWidth: "50%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    value={sliderVal[0]}
                    inputProps={{ readOnly: true }}
                  />
                  <Slider
                    value={sliderVal}
                    onChange={handleSliderChange}
                    valueLabelDisplay="off"
                    disableSwap
                  />
                  <TextField
                    size="small"
                    value={sliderVal[1]}
                    inputProps={{ readOnly: true }}
                  />
                </span>
              </Box>
            </Grid>
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

const FilterSettingsPage = (props) => {
  const [openBFilter, setOpenBFilter] = useState(false);
  const handleBFliterOpen = () => setOpenBFilter(true);
  const handleBFliterClose = () => setOpenBFilter(false);

  // 복합필터 선택 폼
  let filterlist_testarr = [];
  for (let index = 0; index < 24; index++) {
    filterlist_testarr.push(
      <FormControlLabel
        key={index}
        value={`test${index}`}
        control={<Radio />}
        label={`test${index}`}
      />
    );
  }

  // 편집화면 기본필터 (모듈화 필요)
  let basic_testarr = [];
  for (let index = 0; index < 16; index++) {
    basic_testarr.push(
      <Grid
        container
        spacing={0.5}
        sx={{
          height: "48px",
          backgroundColor: "#D9D9D9",
        }}
      >
        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ff0000",
          }}
        >
          <Typography variant="body2" component="span">
            A
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#0000ff",
          }}
        >
          <Typography variant="body2" component="span">
            기본필터이름
          </Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#00ff00",
          }}
        >
          <Typography variant="body2" component="span">
            연산자
          </Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#999999",
          }}
        >
          <Typography variant="body2" component="span">
            설정값
          </Typography>
        </Grid>
        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#222222",
          }}
        >
          <IconButton size="small">
            <ClearIcon />
          </IconButton>
        </Grid>
        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#444444",
          }}
        >
          <IconButton size="small">
            <SwapVertIcon />
          </IconButton>
        </Grid>
      </Grid>
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
          {/* 사용자 필터 목록 영역 */}
          <Grid
            container
            spacing={2}
            sx={{ marginLeft: "12px", marginTop: "24px", minHeight: "90%" }}
          >
            <Grid item xs={2}>
              <Card sx={{ height: "72vh" }}>
                <Typography variant="h6" component="div" sx={{ height: "20%" }}>
                  <span
                    style={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    사용자
                    <br />
                    필터 목록
                    <Button variant="contained" size="small">
                      <AddIcon fontSize="small" />
                    </Button>
                  </span>
                </Typography>
                {/* 사용자 필터 라디오그룹 목록 영역 */}
                <Paper
                  elevation={0}
                  sx={{
                    maxHeight: "80%",
                    overflow: "auto",
                    padding: "4px 8px 4px 8px",
                  }}
                >
                  <FormControl>
                    <RadioGroup>{filterlist_testarr}</RadioGroup>
                  </FormControl>
                </Paper>
              </Card>
            </Grid>
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
                {/* <Typography variant="body1" component="div">
                  todo: noFilter 컴포넌트화 및 card flex 레이아웃 연동하기
                   <p>
                    필터를 선택해 속성을 보거나
                    <br />+ 버튼을 눌러 새 필터를 생성하세요
                  </p>
                  
                </Typography> */}
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
                      justifyContent: "space-between",
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
                      sx={{ width: "80%", marginLeft: "12px" }}
                    />
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
