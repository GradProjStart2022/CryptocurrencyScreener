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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import { useEffect, useState } from "react";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const FilterSelectTabs = (props) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="전체" />
          <Tab label="서술적" />
          <Tab label="파이낸셜" />
          <Tab label="기술적" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        전체
      </TabPanel>
      <TabPanel value={value} index={1}>
        서술적
      </TabPanel>
      <TabPanel value={value} index={2}>
        파이낸셜
      </TabPanel>
      <TabPanel value={value} index={3}>
        기술적
      </TabPanel>
    </Box>
  );
};

const FilterSettingsPage = (props) => {
  const [openBFilter, setOpenBFilter] = useState(false);
  const handleBFliterOpen = () => setOpenBFilter(true);
  const handleBFliterClose = () => setOpenBFilter(false);

  let testarr = [];
  for (let index = 0; index < 24; index++) {
    testarr.push(
      <FormControlLabel
        key={index}
        value={`test${index}`}
        control={<Radio />}
        label={`test${index}`}
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
                    <RadioGroup>{testarr}</RadioGroup>
                  </FormControl>
                </Paper>
              </Card>
            </Grid>
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
                      {/* <Button variant="contained" size="small">
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
                    <div style={{ height: "80%" }}></div>
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
