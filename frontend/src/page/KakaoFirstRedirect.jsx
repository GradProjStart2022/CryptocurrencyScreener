import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const KakaoFirstRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_ROOT}/users/kakao/callback?code=${code}`,
        {
          withCredentials: true,
        }
      )
      .then((resp) => {
        alert(resp.data);
        navigate(`/login/kakao_complete?code=${resp.data}`, { replace: true });
      })
      .catch((e) => {
        alert(e);
        // alert("모종의 이유로 로그인 전처리에 실패했습니다.");
        navigate("/", { replace: true });
      });
    // fetch(
    //   `${process.env.REACT_APP_API_ROOT}/users/kakao/callback?code=${code}`,
    // )
    //   .then((resp) => {
    //     alert(resp.)
    //     navigate(`/login/kakao_complete?code=${resp.json}`, { replace: true });
    //   })
    //   .catch((e) => {
    //     alert(e);
    //     // alert("모종의 이유로 로그인에 실패했습니다.");
    //     navigate("/", { replace: true });
    //   });
  }, []);

  return <div />;
};

export default KakaoFirstRedirect;
