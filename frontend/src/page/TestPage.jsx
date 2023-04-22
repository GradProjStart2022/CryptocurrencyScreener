import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function innerUseEffect(uid) {
  const DATA = JSON.stringify({
    user_id: uid,
    name: "test_name1",
    expression: "A & B",
    alarm: false,
    time: 60,
  });
  console.log("DATA :>> ", DATA);
  axios
    .post("http://127.0.0.1:8000/filter/api/filter/", DATA)
    .then((resp) => {
      console.log("resp :>> ", resp);
    })
    .catch((error) => {
      console.log("error :>> ", error);
    });
}

const TestPage = () => {
  const uid = useSelector((state) => state.user.uid);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("uid :>> ", uid);
    innerUseEffect(uid);
  }, []);

  return (
    <div>
      <p>테스트페이지</p>
      <button
        onClick={() => {
          navigate("/");
        }}>
        홈으로
      </button>
    </div>
  );
};

export default TestPage;
