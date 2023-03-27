import json
from django.test import TestCase, RequestFactory, Client
from django.urls import reverse

from filter import views


# # Create your tests here.
# class Test(TestCase):
#     def setUp(self):
#         self.client = Client()
#         self.url = reverse("recommend")
#
#     def test1(self):
#         data = {"indicators": ["RSI", "BB"]}
#         # response = self.client.get(
#         #     self.url, data=json.dumps(data), content_type="application/json"
#         # )
#         # response = self.client.get(
#         #     self.url, data=json.dumps(data), content_type="application/json"
#         # )
#         # self.assertEqual(response.status_code, 200)
#         data_list = [(k, v) for k, v in data.items()]
#         response = self.client.get(self.url, data=data_list)
#         print(response.json())
#
#     def test_recommend_no_matching_indicators(self):
#         # 매칭되는 지표가 없는 경우 테스트
#         data = {"indicators": ["D", "E", "F"]}
#         response = self.client.get(
#             self.url, data=json.dumps(data), content_type="application/json"
#         )
#         # self.assertEqual(response.status_code, 404)
#         # self.assertEqual(
#         #     response.json(), {"message": "Error! No matching indicators found."}
#         # )
