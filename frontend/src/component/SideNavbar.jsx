/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { SvgIcon } from "@mui/material";

import { ReactComponent as FilterSettingsIcon } from "../img/filter_options_icon.svg";

const buttonBox = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "5vw",
  maxWidth: "42px",
  height: "5vw",
  maxHeight: "42px",
  marginBottom: "24px",
  backgroundColor: "rgba(14,74,198,1)",
  border: "none",
  borderRadius: "32%",
  cursor: "pointer",
});

const SideNavBar = (props) => {
  const navigate = useNavigate();

  return (
    <div className="nav-list">
      <div
        css={buttonBox}
        onClick={() => {
          navigate("/");
        }}
      >
        <HomeIcon />
      </div>
      <div
        css={buttonBox}
        onClick={() => {
          navigate("/chart/");
        }}
      >
        <BarChartIcon />
      </div>
      <div
        css={buttonBox}
        onClick={() => {
          navigate("/filter/id예정");
        }}
      >
        <SvgIcon
          component={FilterSettingsIcon}
          inheritViewBox
          color="secondary"
        >
          {/* todo: image_options_icon 가져오기 */}
        </SvgIcon>
      </div>
      <div
        css={buttonBox}
        onClick={() => {
          navigate("/alarm/id예정");
        }}
      >
        <NotificationsIcon />
      </div>
      <div
        css={buttonBox}
        onClick={() => {
          navigate("/bookmark/id예정");
        }}
      >
        <BookmarkIcon />
      </div>
    </div>
  );
};

export default SideNavBar;
