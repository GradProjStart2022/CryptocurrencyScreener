import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isNil, isEmpty } from "lodash-es";

import { TableCell, TableRow } from "@mui/material";
import { searchObjValue } from "../model/search_const";

/**
 * 필터링된 각 암호화폐 열에 대한 표 열 컴포넌트
 * @param {any} props react props
 * @returns 필터링된 종목 열 UI 컴포넌트
 */
const CoinTableRow = (props) => {
  /** @type {object} */
  const row = props.row;
  const navigate = useNavigate();
  const [matchCoinState, setMatchCoinState] = useState({});

  // 종목 이름에 대한 tdview_upbit 코드 찾아 테이블 열 onclick 대응
  useEffect(() => {
    if (searchObjValue.length !== 0) {
      let match_coin_obj = searchObjValue.find((value) => {
        return value.name_kr === row?.name_kr;
      });

      if (!isNil(match_coin_obj)) {
        setMatchCoinState(match_coin_obj);
      }
    }
  }, [searchObjValue, searchObjValue.length]);

  /**
   * 현 열의 암호화폐에 대해 상세 정보 화면으로 넘어가는 콜백
   * @param {object} matchCoinState 해당 암호화폐 정보 객체 state
   */
  const moveToChart = (matchCoinState) => {
    if (!isEmpty(matchCoinState)) {
      navigate(`/chart/${matchCoinState.tradingview_upbit_code}`, {
        state: { coin: matchCoinState },
      });
    }
  };

  return (
    <TableRow
      key={row.id}
      sx={{
        cursor: "pointer",
      }}
      onClick={() => {
        moveToChart(matchCoinState);
      }}>
      {/* 이름 -> name_kr */}
      <TableCell component="th" scope="row">
        {row.name_kr}
      </TableCell>
      {/* 종목코드 -> ticker */}
      <TableCell align="right">{row.ticker}</TableCell>
      {/* 저가 -> 구 가격 */}
      <TableCell align="right">{row.LOW.toLocaleString()}</TableCell>
      {/* 고가 -> 구 전일대비 */}
      <TableCell align="right">{row.HIGH.toLocaleString()}</TableCell>
      {/* 거래량 -> 구 등락률 */}
      <TableCell align="right">{row.VOLUME.toLocaleString()}</TableCell>
    </TableRow>
  );
};

export default CoinTableRow;
