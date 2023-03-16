import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";

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
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";

/**
 * 화면설계서 6슬라이드 종목 전체가 나오는 화면
 * @param {*} props
 * @returns
 */
const ChartListPage = (props) => {
  const [openBFilter, setOpenBFilter] = useState(false);
  const handleBFliterOpen = () => setOpenBFilter(true);
  const handleBFliterClose = () => setOpenBFilter(false);

  const rows = [
    {
      id: 1,
      name: "삼성전자",
      code: "005930",
      price: 82000,
      change: -500,
      percent: -0.61,
    },
    {
      id: 2,
      name: "SK하이닉스",
      code: "000660",
      price: 120000,
      change: 1000,
      percent: 0.84,
    },
    {
      id: 3,
      name: "카카오",
      code: "000999",
      price: 80000,
      change: 1000,
      percent: 0.85,
    },
    // ... 더 많은 데이터
  ];

  const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 650,
    },
    tableContainer: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
  }));

  const classes = useStyles();

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

  //select
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const menuProps = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "right",
    },
    getContentAnchorEl: null,
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
            <h1>현재 적용중인 필터:</h1>
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
                  <div
                    style={{
                      marginLeft: "25px",
                      marginTop: "10px",
                      verticalAlign: "middle",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h2>종목</h2>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <InputLabel id="demo-simple-select-label">
                        이름순 오름
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={value}
                        onChange={handleChange}
                        MenuProps={menuProps}
                      >
                        <MenuItem value={10}>이름순 오름</MenuItem>
                        <MenuItem value={20}>이름순 내림</MenuItem>
                        <MenuItem value={30}>가격순 오름</MenuItem>
                        <MenuItem value={40}>가격순 내림</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <TableContainer
                    component={Paper}
                    className={classes.tableContainer}
                  >
                    <Table className={classes.table} aria-label="stock table">
                      <TableHead>
                        <TableRow>
                          <TableCell>종목명</TableCell>
                          <TableCell align="right">종목코드</TableCell>
                          <TableCell align="right">현재가</TableCell>
                          <TableCell align="right">전일대비</TableCell>
                          <TableCell align="right">등락률</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.code}</TableCell>
                            <TableCell align="right">
                              {row.price.toLocaleString()}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{
                                color: row.change >= 0 ? "red" : "blue",
                              }}
                            >
                              {row.change.toLocaleString()}
                              {row.change >= 0 ? (
                                <ArrowDropUp fontSize="small" />
                              ) : (
                                <ArrowDropDown fontSize="small" />
                              )}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{
                                color: row.percent >= 0 ? "red" : "blue",
                              }}
                            >
                              {row.percent.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                              %
                              {row.percent >= 0 ? (
                                <ArrowDropUp fontSize="small" />
                              ) : (
                                <ArrowDropDown fontSize="small" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* <Paper
                    elevation={1}
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  ></Paper> */}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ChartListPage;
