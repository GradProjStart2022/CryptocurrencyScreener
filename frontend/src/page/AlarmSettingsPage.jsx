import LoginInfo from "../component/LoginInfo.jsx";
import SearchBar from "../component/SearchBar.jsx";
import SideNavBar from "../component/SideNavbar.jsx";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  Switch,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const AlarmSettingsPage = (props) => {
  const notifications = [
    { id: 1, name: "알림 1" },
    { id: 2, name: "알림 2" },
    { id: 3, name: "알림 3" },
  ];

  // 각 요소별 switch
  const [switchStates, setSwitchStates] = useState(
    Object.fromEntries(
      notifications.flatMap(({ id }) => [
        [`website-${id}`, false],
        [`telegram-${id}`, false],
      ])
    )
  );

  const handleSwitchChange = (id, type) => (event) => {
    setSwitchStates((prevSwitchStates) => ({
      ...prevSwitchStates,
      [`${type}-${id}`]: event.target.checked,
    }));
  };

  // 알림 간격 select
  const [selectValues, setSelectValues] = useState(
    Object.fromEntries(notifications.map(({ id }) => [id, ""]))
  );

  const handleSelectChange = (id) => (event) => {
    setSelectValues((prevSelectValues) => ({
      ...prevSelectValues,
      [id]: event.target.value,
    }));
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
            <h1>알림 설정</h1>
          </div>
          <Grid
            container
            spacing={2}
            sx={{ marginLeft: "12px", marginTop: "24px", minHeight: "90%" }}
          >
            <Grid item xs={2}>
              <Card sx={{ height: "72vh", width: "90vw" }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ pl: 5, fontWeight: "bold", fontSize: "1.1rem" }}
                        >
                          이름
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ pr: 4, fontWeight: "bold", fontSize: "1.1rem" }}
                        >
                          알림간격
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                        >
                          웹 사이트
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                        >
                          텔레그램
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {notifications.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell sx={{ pl: 5 }}>
                            {notification.name}
                          </TableCell>
                          <TableCell align="right">
                            <FormControl>
                              <InputLabel
                                id={`select-label-${notification.id}`}
                              >
                                알림간격
                              </InputLabel>
                              <Select
                                labelId={`select-label-${notification.id}`}
                                value={selectValues[notification.id]}
                                onChange={handleSelectChange(notification.id)}
                                label="알림간격"
                                sx={{ width: 90 }}
                              >
                                <MenuItem value={15}>15분</MenuItem>
                                <MenuItem value={30}>30분</MenuItem>
                                <MenuItem value={60}>1시간</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell align="right">
                            <Switch
                              checked={
                                switchStates[`website-${notification.id}`]
                              }
                              onChange={handleSwitchChange(
                                notification.id,
                                "website"
                              )}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Switch
                              checked={
                                switchStates[`telegram-${notification.id}`]
                              }
                              onChange={handleSwitchChange(
                                notification.id,
                                "telegram"
                              )}
                            />
                          </TableCell>
                        </TableRow>
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
