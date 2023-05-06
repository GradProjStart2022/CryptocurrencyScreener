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
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";

import getFilteredData from "../logic/getFilteredData.js";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import UserFilterList from "../component/UserFilterList.jsx";

/** css const elements */
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
const table_container_sx = {
  minWidth: 650,
};
const table_sx = {
  marginTop: 3,
  marginBottom: 3,
};

const CoinTableColumn = (props) => {
  const row = props.row;

  return (
    <TableRow key={row.id}>
      {/* 이름 -> name_kr */}
      <TableCell component="th" scope="row">
        {row.name_kr}
      </TableCell>
      {/* 종목코드 -> ticker */}
      <TableCell align="right">{row.ticker}</TableCell>
      {/* 가격 -> 대응없음? */}
      <TableCell align="right">{/* {row.price.toLocaleString()} */}</TableCell>
      {/* (구)전일대비 -> 대응없음 */}
      <TableCell
        align="right"
        // style={{
        //   color: row.change >= 0 ? "red" : "blue",
        // }}
      >
        {/* {row.change.toLocaleString()}
        {row.change >= 0 ? (
          <ArrowDropUp fontSize="small" />
        ) : (
          <ArrowDropDown fontSize="small" />
        )} */}
      </TableCell>
      {/* (구)등락률 -> 대응없음 */}
      <TableCell
        align="right"
        // style={{
        //   color: row.percent >= 0 ? "red" : "blue",
        // }}
      >
        {/* {row.percent.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}
        %
        {row.percent >= 0 ? (
          <ArrowDropUp fontSize="small" />
        ) : (
          <ArrowDropDown fontSize="small" />
        )} */}
      </TableCell>
    </TableRow>
  );
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
 * @returns 필터선택 및 종목 UI 화면
 */
const ChartListPage = (props) => {
  /**
   * 예시 데이터
   * @type {object[]} */
  const rows = [
    {
      id: 1,
      name_kr: "삼성전자",
      ticker: "005930",
      price: 82000,
      change: -500,
      percent: -0.61,
    },
    {
      id: 2,
      name_kr: "SK하이닉스",
      ticker: "000660",
      price: 120000,
      change: 1000,
      percent: 0.84,
    },
    {
      id: 3,
      name_kr: "카카오",
      ticker: "000999",
      price: 80000,
      change: 1000,
      percent: 0.85,
    },
    // ... 더 많은 데이터
  ];

  // 종목 정렬 방법 state
  // todo: 필터링된 종목과 연계
  const [howSort, setHowSort] = useState("");
  const handleSortChange = (event) => {
    setHowSort(event.target.value);
  };

  // 시간 봉 테이블 지정 state
  // todo: 추후 Select 만들어서 연동
  const [barTable, setBarTable] = useState("30m");
  const handleBarTable = (event) => {
    setHowSort(event.target.value);
  };

  // 사용 데이터 지정 state
  // todo: 추후 Select 만들어서 연동
  const [dateRange, setDateRange] = useState(60);
  const handleDateRange = (event) => {
    setHowSort(event.target.value);
  };

  // // 사용자가 선택하는 복합필터 이름 state todo: 미사용 삭제예정 - 적용된 필터이름 미표시
  // const [uFilterName, setUFilterName] = useState("");

  // UserFilterList 클릭 필터 확인용 넘겨주기 state
  const [filterListClickID, setFilterListClickID] = useState(0);

  // 렌더링용 가격 데이터?
  const [priceData, setPriceData] = useState([]);

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
                      sx={{ height: "10%", width: "100%" }}>
                      <div
                        style={{
                          marginLeft: "25px",
                          marginTop: "10px",
                          verticalAlign: "middle",
                          display: "flex",
                          justifyContent: "space-between",
                        }}>
                        <h2>종목</h2>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                          <InputLabel id="sort-input-select-label">
                            이름순 오름
                          </InputLabel>
                          <Select
                            labelId="sort-select-label"
                            id="sort-howto-select"
                            value={howSort}
                            onChange={handleSortChange}
                            MenuProps={menuProps}>
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
                            {priceData.map((elem) => (
                              <CoinTableColumn row={elem} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Typography>
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
