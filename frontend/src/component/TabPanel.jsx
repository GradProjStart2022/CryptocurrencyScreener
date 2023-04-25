/**
 * 기본필터 설정용 탭패널 컴포넌트 함수
 * @param {any} props react props
 * @returns 탭패널 요소 UI 컴포넌트
 */
export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`basic-filter-tabpanel-${index}`}
      aria-labelledby={`basic-filter-tab-${index}`}
      style={{ overflow: "scroll" }}
      {...other}>
      {value === index && children}
    </div>
  );
};
