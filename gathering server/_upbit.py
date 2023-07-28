import jwt
import hashlib
import time
import requests
from urllib.parse import urlencode
import openpyxl

import re
import pandas as pd

import logging

logger = logging.getLogger('_upbit')


class Upbit_Api():
    """
        <Upbit API Reference>
        https://docs.upbit.com/reference
    """

    def error_handler(self, res):
        """에러 핸들링 함수
            1. 상태코드 처리
            2. 호출 횟수가 1개 남았을 경우 sleep 처리
            3. 호출 횟수 초과 되었을 때 sleep 처리

        Args:
            res (response): HTTP REST API 응답

        Returns:
            [type]: [description]
        """

        if res.status_code == 400 or res.status_code == 401 or res.status_code == 404:
            return {'code': 0, 'data': {'message': res.json()['error']['message'], 'name': res.json()['error']['name']}}

        elif re.search(r'sec=(\d+)', res.headers.get('Remaining-Req')).group(1) == '1':
            logger.info('해당 초 호출횟수 제한으로 1초 기다림')
            time.sleep(1)
        elif re.search(r'min=(\d+)', res.headers.get('Remaining-Req')).group(1) == '1':
            logger.info('해당 분 호출횟수 제한으로 1분 기다림')
            time.sleep(60)
        elif res.status_code == 429:
            logger.info('호출횟수 초과로 10분 기다림')
            time.sleep(600)
        return {'code': 1, 'data': pd.json_normalize(res.json())}

    def _request(self, method, **kwargs):
        url = kwargs.get('url')
        params = kwargs.get('params')
        headers = kwargs.get('headers')
        for _ in range(3):
            if method == 'get':
                response = requests.get(
                    url=url, params=params, headers=headers)
            elif method == 'post':
                response = requests.post(
                    url=url, params=params, headers=headers)
            results = self.error_handler(response)
            if results['code'] == 1:
                break
            logger.info('Upbit API REQUEST retries: 1')
        return results

    def get_candle_min(self, market: str = 'KRW-BTC', unit: str = '1', to: str = '', count: str = '200'):
        """
        분(Minute) 시세 캔들 조회

        Parameters
        ----------
        market : str, optional
            마켓 코드. The default is 'KRW-BTC'.
        unit : str, optional
            분 단위 (가능한 값:1,3,5,15,10,30,60,240). The default is '1'.
        to : str, optional
            마지막 캔들 시각(format: yyyy-MM-dd'T'HH:mm:ss). The default is ''.
        count : str, optional
            캔들 개수(최대 200개까지 요청 가능). The default is '200'.
        Returns
        -------
        Dataframe
            DESCRIPTION.

        """
        url = f"https://api.upbit.com/v1/candles/minutes/{unit}"

        querystring = {"market": market, "to": to, "count": count}
        return self._request('get', url=url, params=querystring)

    def get_candle_day(self, market: str = 'KRW-BTC', to: str = '', count: str = '200',
                       convertingPriceUnit: str = 'KRW'):
        """
        일(Day) 시세 캔들 조회

        Parameters
        ----------
        market : str, optional
            마켓 코드. The default is 'KRW-BTC'.
        to : str, optional
            마지막 캔들 시각(format: yyyy-MM-dd'T'HH:mm:ss). The default is ''.
        count : str, optional
            캔들 개수(최대 200개까지 요청 가능). The default is '200'.
        convertingPriceUnit : str, optional
            종가 환산 화폐 단위(KRW로 명시할 시 원화 환산 가격을 반환). The default is 'KRW'.

        Returns
        -------
        Dataframe
            DESCRIPTION.

        """
        url = "https://api.upbit.com/v1/candles/days"
        querystring = {"market": market, "to": to, "count": count,
                       "convertingPriceUnit": convertingPriceUnit}
        return self._request('get', url=url, params=querystring)

    def get_candle_week(self, market: str = 'KRW-BTC', to: str = '', count: str = '200'):
        """
        주(Week) 시세 캔들 조회

        Parameters
        ----------
        market : str, optional
            마켓 코드. The default is 'KRW-BTC'.
        to : str, optional
            마지막 캔들 시각(format: yyyy-MM-dd'T'HH:mm:ss). The default is ''.
        count : str, optional
            캔들 개수(최대 200개까지 요청 가능). The default is '200'.

        Returns
        -------
        Dataframe
            DESCRIPTION.

        """
        url = "https://api.upbit.com/v1/candles/weeks"
        querystring = {"market": market, "to": to, "count": count}
        return self._request('get', url=url, params=querystring)

    def get_candle_month(self, market: str = 'KRW-BTC', to: str = '', count: str = '200'):
        """
        월(Month) 시세 캔들 조회

        Parameters
        ----------
        market : str, optional
            마켓 코드. The default is 'KRW-BTC'.
        to : str, optional
            마지막 캔들 시각(format: yyyy-MM-dd'T'HH:mm:ss). The default is ''.
        count : str, optional
            캔들 개수(최대 200개까지 요청 가능). The default is '200'.

        Returns
        -------
        Dataframe
            DESCRIPTION.

        """
        url = "https://api.upbit.com/v1/candles/months"
        querystring = {"market": market, "to": to, "count": count}
        return self._request('get', url=url, params=querystring)

    def get_ticker_list(self, isDetails: str = 'false') -> pd.DataFrame:
        """
        업비트에서 거래 가능한 마켓의 종목 목록

        Parameters
        ----------
        isDetails : str, optional
            유의종목 필드과 같은 상세 정보 노출 여부. The default is 'false'.

        Returns
        -------
        Dataframe

        """
        url = 'https://api.upbit.com/v1/market/all'
        querystring = {'isDetails': isDetails}
        response = requests.request('GET', url, params=querystring)
        return self._request('get', url=url, parms=querystring)


if __name__ == '__main__':
    test = Upbit_Api()
    # yyyy-MM-dd'T'HH:mm:ss
    test.get_ticker_list()['data'].to_excel("coin.xlsx")
