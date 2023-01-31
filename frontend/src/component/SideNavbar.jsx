import { useNavigate } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { SvgIcon } from "@mui/material";

import { ReactComponent as FilterSettingsIcon } from "../img/filter_options_icon.svg";

const SideNavBar = (props) => {
  const navigate = useNavigate();

  return (
    <div className="nav-list">
      <div
        className="testbox"
        onClick={() => {
          navigate("/");
        }}
      >
        <HomeIcon />
      </div>
      <div
        className="testbox"
        onClick={() => {
          navigate("/chart/");
        }}
      >
        <BarChartIcon />
      </div>
      <div
        className="testbox"
        onClick={() => {
          navigate("/경로지정예정");
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
        className="testbox"
        onClick={() => {
          navigate("/경로지정예정");
        }}
      >
        <NotificationsIcon />
      </div>
      <div
        className="testbox"
        onClick={() => {
          navigate("/경로지정예정");
        }}
      >
        <BookmarkIcon />
      </div>
    </div>
  );
};

export default SideNavBar;
