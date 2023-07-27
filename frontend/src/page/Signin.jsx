import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GoogleButton from "react-google-button";

import kakao_login_img from "../img/kakao_login_medium_wide.png";

/// dotenv를 통해 기기별 환경변수에서 API 키 가져옴
/// 카카오 로그인 상수 시작: REST API KEY/리다이렉트 URL/카카오 로그인 사이트 URL
const CLIENT_ID = "929a5207f19097a18ebfa095a688914e";
const REDIRECT_URI = `${process.env.REACT_APP_HOME_URL}/users/kakao/callback/`;

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
/// 카카오 로그인 상수 끝

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}>
      Copyright ©
      <Link color="inherit" href="https://ce.tukorea.ac.kr/">
        한국공학대학교 컴퓨터공학부 S2-6
      </Link>
      {` ${new Date().getFullYear()}.`}
    </Typography>
  );
}

const theme = createTheme();

const SigninPage = (arg) => {
  /**
   * 자체 로그인 버튼을 눌렀을 때 사용자의 ID/비밀번호 입력을 이용해 로그인 처리하는 함수
   * @param {any} event 브라우저 이벤트 객체
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            로그인하세요
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="ID"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="ID 저장하기"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              로그인
            </Button>
          </Box>
          {/* 카카오 로그인 버튼: 링크를 이동해 카카오 서버로 이동해 로그인 수행 */}
          <a id="custom-login-btn" href={KAKAO_AUTH_URL}>
            <img src={kakao_login_img} alt="카카오 로그인 버튼" />
          </a>
          {/* 구글 로그인 버튼: 링크를 이동해 백엔드 로직을 이용해 로그인 수행 (현재 미작동) */}
          <GoogleButton
            onClick={() => {
              window.location.href = `${process.env.REACT_APP_HOME_URL}/users/accounts/google/`;
            }}
          />
          <br />
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                비밀번호를 분실하셨나요?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                여기를 눌러 회원가입하세요
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default SigninPage;
