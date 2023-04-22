import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function innerUseEffect() {
  const DATA = JSON.stringify({
    name: "test_name1",
    expression: "",
    alarm: false,
    time: 60,
  });
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
  const navigate = useNavigate();

  useEffect(innerUseEffect, []);

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
