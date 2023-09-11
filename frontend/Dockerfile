# base image 설정(as build 로 완료된 파일을 밑에서 사용할 수 있다.)
FROM node:18 as build

# 컨테이너 내부 작업 디렉토리 설정# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /CryptocurrencyScreener/frontend

# package.json 및 package-lock.json 파일에 명시된 의존성 패키지들을 설치
COPY ./package*.json ./

RUN npm install

COPY . ./

# RUN npm run build
# 실배포시 위 RUN 활성화 하고 아래 RUN 비활성화 할 것
RUN npm run build_local

# EXPOSE 3000
# 빌드 종료

# 배포 시작
FROM nginx:latest

# 이전 빌드 단계에서 빌드한 결과물을 /usr/share/nginx/html 으로 복사한다.
COPY --from=build /CryptocurrencyScreener/frontend/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx/default.conf /etc/nginx/conf.d
