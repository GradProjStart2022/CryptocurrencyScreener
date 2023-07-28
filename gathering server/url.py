import pandas
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

data={'학생수':[480,750,900,1100,1150,1200,1300,1400,1500,1550,1600,1610,1750,2000,2100,2600,2700],
      '점수':[60,100,93,89,100,52,100,49,30,100,60,100,70,100,58,100,91]}
df=pandas.DataFrame(data)
# K-means 클러스터링을 위한 모델 생성
kmeans = KMeans(n_clusters=5)

# 점수와 학생수를 학습 데이터로 사용
X = df[['점수', '학생수']]

# K-means 모델 학습
kmeans.fit(X)

# 각 데이터 포인트에 대한 클러스터 번호 예측
labels = kmeans.predict(X)

# 클러스터링 결과를 데이터프레임에 추가
df['Cluster'] = labels

# 산포도 그리기
plt.scatter(df['학생수'], df['점수'], c=df['Cluster'], cmap='viridis')
plt.xlabel('학생수')
plt.ylabel('점수')
plt.title('K-means 클러스터링 결과')
plt.show()

