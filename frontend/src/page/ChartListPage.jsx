import { useEffect, useState } from "react";
import { isEmpty } from "lodash-es";

import {
  Card,
  FormControl,
  Grid,
  Paper,
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

import getFilteredData from "../logic/getFilteredData.js";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import UserFilterList from "../component/UserFilterList.jsx";
import CoinTableRow from "../component/CoinTableRow.jsx";

/** css const elements */
const menu_props_css = {
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
const table_container_css = {
  minWidth: 650,
  height: "64vh",
};
const table_css = {
  marginTop: 3,
  marginBottom: 3,
  height: "max-content",
};

/**
 * 필터링된 종목이 없을때 안내하는 UI 요소
 * @returns 필터 없을 때 안내하는 컴포넌트
 */
const NoCrypto = () => {
  return (
    <Typography variant="body1" component="div">
      <p>
        좌측에 있는 필터를 선택해
        <br />
        해당 필터로 필터링된 암호화폐들을 확인하세요
      </p>
    </Typography>
  );
};

/**
 * 필터 미선택시 전체 종목이 표시되고
 * 필터 선택시 필터링된 종목이 표시되는 화면
 * @param {any} props react props
 * @returns 필터선택 및 종목 확인 및 선택 화면
 */
const ChartListPage = (props) => {
  // 종목 정렬 방법 state todo: 필터링된 종목과 연계
  const [howSort, setHowSort] = useState("");
  const handleSortChange = (event) => {
    setHowSort(event.target.value);
  };

  // 사용 데이터 기간 지정 state
  const [dateRange, setDateRange] = useState(60);
  const handleDateRange = (event) => {
    setDateRange(event.target.value);
  };

  // 시간 봉 테이블 지정 state
  const [barTable, setBarTable] = useState("240m");
  const handleBarTable = (event) => {
    console.log("typeof event.target.value :>> ", typeof event.target.value);
    setBarTable(event.target.value);
  };

  // UserFilterList 클릭 필터 확인용 넘겨주기 state
  const [filterListClickID, setFilterListClickID] = useState(0);

  // 렌더링용 가격 데이터 todo: 모델 독립?
  const [priceData, setPriceData] = useState([]);

  // 사용자가 선택하는 복합필터 이름 state todo: 선택한 필터와 연동
  const [uFilterName, setUFilterName] = useState("");

  // UserFilterList 클릭 필터 확인용 넘겨주기 state
  const [filterListClick, setFilterListClick] = useState(0);

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
  // 여기에 데이터 가져오는 코드 넣는중
  useEffect(() => {
    if (filterListClickID !== 0) {
      getFilteredData(filterListClickID, barTable, dateRange, setPriceData);
    }
  }, [filterListClickID, barTable, dateRange]);

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
            <Typography variant="h5">
              {filterListClickID === 0
                ? "적용중인 필터가 없습니다"
                : "현재 필터를 적용중입니다"}
            </Typography>
          </div>
          <Grid
            container
            spacing={2}
            sx={{ marginLeft: "12px", marginTop: "24px", minHeight: "90%" }}>
            {/* 사용자 필터 목록 영역 */}
            <UserFilterList
              isSettings={false}
              filterListClickID={filterListClickID}
              setFilterListClickID={setFilterListClickID}
            />
            {/* 종목 정보 영역 */}
            <Grid item xs={10}>
              <Card
                sx={{
                  // 필터 선택 안했을때 0번, 선택했을때 1번 레이아웃
                  display: ["flex", "block"][filterListClickID === 0 ? 0 : 1],
                  justifyContent: ["center", "flex-start"][
                    filterListClickID === 0 ? 0 : 1
                  ],
                  alignItems: ["center", "stretch"][
                    filterListClickID === 0 ? 0 : 1
                  ],
                  height: "72vh",
                }}>
                {filterListClickID === 0 ? (
                  <NoCrypto />
                ) : (
                  <>
                    <Typography
                      component="div"
                      sx={{ height: "8vh", width: "100%" }}>
                      <div
                        style={{
                          marginLeft: "25px",
                          marginTop: "10px",
                          verticalAlign: "middle",
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignContent: "center",
                        }}>
                        <Typography variant="h5" sx={{ m: 2 }}>
                          종목
                        </Typography>
                        {/* <h2>종목</h2> */}
                        <FormControl sx={{ m: 2, minWidth: 120 }} size="small">
                          <InputLabel id="filter-period-input-label">
                            종목 필터링 기간(일)
                          </InputLabel>
                          <Select
                            labelId="filter-period-input-label"
                            id="filter-period-select"
                            label="종목 필터링 기간(일)"
                            value={dateRange}
                            onChange={handleDateRange}
                            MenuProps={menu_props_css}>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={60}>60</MenuItem>
                            <MenuItem value={90}>90</MenuItem>
                            <MenuItem value={120}>120</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl sx={{ m: 2, minWidth: 120 }} size="small">
                          <InputLabel id="bong-range-select-label">
                            사용 봉 기간
                          </InputLabel>
                          <Select
                            labelId="bong-range-select-label"
                            id="sort-howto-select"
                            label="사용 봉 기간"
                            value={barTable}
                            onChange={handleBarTable}
                            MenuProps={menu_props_css}>
                            <MenuItem value="30m">30분</MenuItem>
                            <MenuItem value="60m">60분</MenuItem>
                            <MenuItem value="240m">240분</MenuItem>
                            <MenuItem value="1d">1일</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl sx={{ m: 2, minWidth: 120 }} size="small">
                          <InputLabel id="sort-input-select-label">
                            정렬 방식
                          </InputLabel>
                          <Select
                            labelId="sort-input-select-label"
                            id="sort-howto-select"
                            label="정렬 방식"
                            value={howSort}
                            onChange={handleSortChange}
                            MenuProps={menu_props_css}>
                            <MenuItem value={10}>이름순 오름</MenuItem>
                            <MenuItem value={20}>이름순 내림</MenuItem>
                            <MenuItem value={30}>가격순 오름</MenuItem>
                            <MenuItem value={40}>가격순 내림</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </Typography>

                    <TableContainer component={Paper} sx={table_container_css}>
                      <Table sx={table_css} aria-label="stock table">
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
                          {priceData.map((elem) => (
                            <CoinTableRow row={elem} />
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
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

export default ChartListPage;
