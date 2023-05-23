import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  Button,
} from "@mui/material";

import setAlarmSettings from "../logic/setAlarmSettingsServer.js";
import getUserFilter from "../logic/getUserFilterFromServer.js";

import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import AlarmTableRow from "../component/AlarmTableRow.jsx";

const AlarmSettingsPage = (props) => {
  const dispatch = useDispatch();
  const filter_list = useSelector((state) => state.userFilter.filter_list);
  const uid = useSelector((state) => state.user.uid);
  const email = useSelector((state) => state.user.email);

  // 설정 변경 여부 확인 state
  const [isModify, setIsModify] = useState(false);
  // 취소버튼 클릭 확인 state
  const [clickCancel, setClickCancel] = useState(false);

  // 각 요소별 switch state
  const [switchStates, setSwitchStates] = useState({});

  // 스위치 UI요소에서 변경
  const handleSwitchChange = (id, type, setIsModify) => (event) => {
    setSwitchStates((prevSwitchStates) => ({
      ...prevSwitchStates,
      [`${type}-${id}`]: event.target.checked,
    }));
    setIsModify(true);
  };

  // 알림 간격 select state
  const [selectValues, setSelectValues] = useState({});

  // 간격 UI요소에서 변경
  const handleSelectChange = (id, setIsModify) => (event) => {
    setSelectValues((prevSelectValues) => ({
      ...prevSelectValues,
      [id]: event.target.value,
    }));
    setIsModify(true);
  };

  // 필터에 맞게 각 state 초기화
  useEffect(() => {
    setSwitchStates(
      // 알람 수신 상태
      Object.fromEntries(
        filter_list.flatMap(({ id, alarm }) => [
          [`website-${id}`, alarm],
          [`telegram-${id}`, false],
        ])
      )
    );
    setSelectValues(
      // 알람 간격 상태
      Object.fromEntries(filter_list.map(({ id, time }) => [id, time]))
    );
    setClickCancel(false); // 취소 여부 상태
  }, [filter_list, clickCancel]);

  // 초기 접속시, 변경 완료시 필터 데이터 갱신
  useEffect(() => {
    const awaitGetFilter = async () => {
      let resp = false;
      while (!resp) {
        resp = await getUserFilter(email, dispatch);
      }
    };
    if (!isModify) {
      awaitGetFilter();
    }
  }, [isModify]);

  return (
    <div className="App">
      <SideNavBar />
      <div className="content-outer">
        <div className="top-bar">
          <SearchBar />
          <LoginInfo />
        </div>
        <div className="content-view">
          <div
            style={{
              marginLeft: "12px",
              marginTop: "24px",
              display: "flex",
              justifyContent: "space-between",
            }}>
            <h1>알림 설정</h1>
            <span style={{ display: "flex", alignItems: "center" }}>
              {isModify && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setClickCancel(true);
                  }}>
                  취소
                </Button>
              )}
              {isModify && (
                <Button
                  variant="contained"
                  sx={{ marginLeft: "4vw" }}
                  onClick={async () => {
                    let rslt = await setAlarmSettings(
                      uid,
                      filter_list,
                      switchStates,
                      selectValues
                    );
                    if (rslt) {
                      alert("수정 완료되었습니다.");
                      setIsModify(false);
                    } else {
                      alert("수정 중 문제가 발생했습니다.");
                    }
                  }}>
                  변경
                </Button>
              )}
            </span>
          </div>
          <Grid
            container
            spacing={2}
            sx={{ marginLeft: "12px", marginTop: "24px", minHeight: "90%" }}>
            <Grid item xs={2}>
              <Card sx={{ height: "72vh", width: "90vw" }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            pl: 5,
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                          }}>
                          이름
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            pr: 4,
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                          }}>
                          알림간격
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                          웹 사이트
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                          텔레그램
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filter_list.map((notification) => (
                        <AlarmTableRow
                          notification={notification}
                          selectValues={selectValues}
                          handleSelectChange={handleSelectChange}
                          switchStates={switchStates}
                          handleSwitchChange={handleSwitchChange}
                          setIsModify={setIsModify}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default AlarmSettingsPage;
