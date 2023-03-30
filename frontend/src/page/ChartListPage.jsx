import { useState } from "react";

import {
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import UserFilterList from "../component/UserFilterList.jsx";

/**
 * 필터링된 종목이 없을때 안내하는 UI 요소를 반환할 예정
 * @param {any} props react props
 * @returns 필터 없을 때 안내하는 UI 요소
 */
const NoCrypto = (props) => {
  // todo: 종목 정보 영역의 flex 레이아웃 연동하기(배열 0번)
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
 * 필터 미선택시 전체 종목이 표시되고
 * 필터 선택시 필터링된 종목이 표시되는 화면
 * @param {any} props react props
 * @returns 필터선택 및 종목 UI 화면
 */
const ChartListPage = (props) => {
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

  const table_container_sx = {
    minWidth: 650,
  };
  const table_sx = {
    marginTop: 3,
    marginBottom: 3,
  };

  // 복합필터 선택 폼
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

  // 종목 정렬 방법 변수 todo: 필터링된 종목과 연계
  const [howSort, setHowSort] = useState("");
  const handleChange = (event) => {
    setHowSort(event.target.value);
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

          <Grid
            container
            spacing={2}
            sx={{ marginLeft: "12px", marginTop: "24px", minHeight: "90%" }}
          >
            {/* 사용자 필터 목록 영역 */}
            <UserFilterList
              filterList={filterlist_testarr}
              isSettings={false}
            />
            {/* 종목 정보 영역 */}
            <Grid item xs={10}>
              <Card
                sx={{
                  // todo: 종목 없을때 0번, 종목 있을때 1번 되게하기
                  display: ["flex", "block"][1],
                  justifyContent: ["center", "flex-start"][1],
                  alignItems: ["center", "stretch"][1],
                  height: "72vh",
                }}
              >
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
                        value={howSort}
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

                  <TableContainer component={Paper} sx={table_container_sx}>
                    <Table sx={table_sx} aria-label="stock table">
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
