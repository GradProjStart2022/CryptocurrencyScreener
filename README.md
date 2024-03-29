# 암호화폐 스크리닝 프로젝트

---

목차

- 개요
- 팀원 소개
- 기술 스택
  - 게더링 서버
  - 웹 백엔드 서버
  - 웹 프론트엔드 클라이언트
- 아키텍처 구성도
- DB 구성도
- 파트별 기능 설명
  - 게더링 서버
  - 웹 백엔드 서버
  - 웹 프론트엔드 클라이언트
- 작동 예시

---

<br/>

## 프로젝트 소개

<p align="justify">
한국공학대학교 2023년 졸업작품 S2-6팀 암호화폐 스크리너 프로젝트입니다.

해당 프로젝트에서는 암호화폐 가격 지표를 가져온 후, 가격에 연관된 지표들을 연산합니다.
이를 사용자가 지정한 값에 맞게 필터링 한 후 해당되는 암호화폐를 안내합니다.

</p>

<br/>

## 팀원 소개

|             윤이건             |      김영민      |       이대근       |       방준보       |
| :----------------------------: | :--------------: | :----------------: | :----------------: |
| 팀장 <br/> 웹 백엔드 서버 담당 | 게더링 서버 담당 | 웹 프론트엔드 담당 | 웹 프론트엔드 개발 |

<br/>

## 기술 스택

### 게더링 서버

|                                                          TA-Lib                                                           |                                                          pyupbit                                                          |                                                           MySQL                                                           |                                                          SQLite3                                                          |
| :-----------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/kym9804/mini/assets/81072181/1d085efd-b235-456d-a6d9-29e1b07c4ccc" width="100" height="50"/> | <img src="https://github.com/kym9804/mini/assets/81072181/da6dcef1-1f50-4d6b-819c-e1902cf056ee" width="100" height="50"/> | <img src="https://github.com/kym9804/mini/assets/81072181/7630e677-8a52-4c50-bb99-a7e234e699aa" width="100" height="50"/> | <img src="https://github.com/kym9804/mini/assets/81072181/e9904dec-c6f1-475f-8a1c-2d6e7f9191a3" width="100" height="50"/> |

### 웹 백엔드 서버

|                            Django                            |                            Redis                            |                            MariaDB                            |                                            Celery                                            |                    Django REST Framework                     |
| :----------------------------------------------------------: | :---------------------------------------------------------: | :-----------------------------------------------------------: | :------------------------------------------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="/readme_assets/django.svg" width=100 height=100 /> | <img src="/readme_assets/redis.svg" width=100 height=100 /> | <img src="/readme_assets/mariadb.svg" width=100 height=100 /> | <img src="https://docs.celeryq.dev/en/stable/_static/celery_512.png" width=100 height=100 /> | <img src="/readme_assets/djrest.png" width=200 height=100 /> |

### 웹 프론트엔드 클라이언트

| JavaScript |  React   |                            Redux                            |                            MUI                            |  CSS   |                                                 Emotion                                                  |
| :--------: | :------: | :---------------------------------------------------------: | :-------------------------------------------------------: | :----: | :------------------------------------------------------------------------------------------------------: |
|   ![js]    | ![react] | <img src="/readme_assets/redux.svg" width=100 height=100 /> | <img src="/readme_assets/mui.svg" width=100 height=100 /> | ![css] | <img src="https://raw.githubusercontent.com/emotion-js/emotion/main/emotion.png" width=100 height=100 /> |

<br/>

## 아키텍처 구성도

![Arch_Diagram](/readme_assets/sys_arch.jpg)
<br/>

## DB 구성도

![DB_ER](/readme_assets/db_er.png)
<br/>

## 파트별 기능 설명

### 게더링 서버

- 30분, 1시간, 4시간, 하루의 기간을 설정하여 upbit으로 부터 1년치 코인 데이터를 수집
- 가져온 데이터를 TA-lib 라이브러리를 사용하여 각종 기술지표 추가
- 기술지표가 추가된 데이터를 데이터 베이스에 업데이트
- 기존에 저장되어있던 데이터인지 검사

### 웹 백엔드 서버

- 웹서버 생성
- 로그인, 스크리닝, 알람 API 제공
- 서버가 정상 작동중인지 확인하고 그렇지 않은 곳 재실행

### 웹 프론트엔드 클라이언트

- 사이트 렌더링
- 암호화폐 검색
- 암호화폐 필터링 결과, 수신된 알람, 관심 암호화폐 정보 등 서버 요청
- 필터 정보, 알람 설정 등 사용자 입력 처리 및 해당 정보 서버 전송

<br/>

## 작동 예시

<p align="justify">

### 암호화폐 상세 정보 표시

![CoinDesc](/readme_assets/coin_desc.png)

### 필터 생성

![FilterSetting](/readme_assets/filter_setting.png)

### 필터링 결과 표시

![FilterRslt](/readme_assets/filter_rslt.png)

### 알람 설정 및 수신 알람 표시 모달

![AlarmOutput](/readme_assets/alarm.png)

### 즐겨찾기 목록 표시

![Bookmarks](/readme_assets/bookmarks.png)

</p>

<br>

<!-- Stack Icon Refernces -->

[js]: /readme_assets/javascript.svg
[react]: /readme_assets/react.svg
[css]: /readme_assets/css.svg
