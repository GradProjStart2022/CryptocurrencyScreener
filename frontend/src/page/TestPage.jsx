import { useNavigate } from "react-router-dom";

const TestPage = () => {
  const navigate = useNavigate();

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
