import schedule
import time
import datetime
from multiprocessing import Process

import gathering
import preprocess

MY_INTERVAL = ['240min']

if __name__ == "__main__":
    def get_now():
        return datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S")


    def Upbit_gatherNpreprocess():

        print(f'[INFO] {get_now()} COIN 데이터 수집 시작')

        prepro = preprocess.CoinPreProcess()
        process = list()

        for interval in MY_INTERVAL:
            api = gathering.Upbit_Gathering(currency='KRW', interval=interval)

            api.gathering(end_date=datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d"))

        print(f'[INFO] {get_now()} COIN 전처리 시작')
        # multi processing 처리
        for interval in MY_INTERVAL:
            proc = Process(target=prepro.prepro_localDB, args=(interval,))
            process.append(proc)
            proc.start()

        for proc in process:
            proc.join()

        print(f'[INFO] {get_now()} COIN 전처리 종료')


    schedule.every().day.at("14:22").do(Upbit_gatherNpreprocess)

    while True:
        schedule.run_pending()
        time.sleep(30)
