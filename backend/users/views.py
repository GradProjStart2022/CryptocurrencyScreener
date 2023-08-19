# f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={rest_api_key}&redirect_uri={redirect_uri}&code={code}"
from json import dumps

import requests
from django.shortcuts import redirect, render
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.http import JsonResponse, HttpResponseRedirect
from json.decoder import JSONDecodeError
from rest_framework import status
from rest_framework.decorators import action, api_view
from rest_framework.generics import RetrieveAPIView, get_object_or_404
from rest_framework.response import Response
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.kakao import views as kakao_view
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.models import SocialAccount
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from .models import User, Attention, Telegram
from allauth.socialaccount.providers.kakao.views import KakaoOAuth2Adapter

from .serializers import AttentionSerializer, UserSerializer, TelegramSerializer

BASE_URL = "http://localhost:8000/"
KAKAO_CALLBACK_URI = BASE_URL + "users/kakao/callback/"
# Create your views here.

# state = getattr(settings, "STATE")


# Test
def example(request):
    return render(request, "users/logintest.html")


# 프론트에서 진행
def kakao_login(request):
    """
    백엔드에서 카카오 로그인을 테스트 하기 위한 API
    @param request:
    @return:
    """
    rest_api_key = getattr(settings, "KAKAO_REST_API_KEY")
    return redirect(
        f"https://kauth.kakao.com/oauth/authorize?client_id={rest_api_key}&redirect_uri={KAKAO_CALLBACK_URI}&response_type=code"
    )
    # access_token = request.POST.get("access_token")
    #
    # # Authenticate the user using the Kakao Talk access token
    # adapter = KakaoOAuth2Adapter()
    # provider = adapter.get_provider()
    # user = provider.sociallogin_from_token({"access_token": access_token})


def kakao_callback(request):
    """
    카카오 로그인 API 최적화 필요
    @param request:
    @return:
    """
    rest_api_key = getattr(settings, "KAKAO_REST_API_KEY")
    code = request.GET.get("code")
    redirect_uri = KAKAO_CALLBACK_URI
    """
    Access Token Request
    """
    token_req = requests.get(
        f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={rest_api_key}&redirect_uri=http://127.0.0.1:3000/users/kakao/callback/&code={code}"
    )

    token_req_json = token_req.json()
    error = token_req_json.get("error")
    if error is not None:
        print(token_req_json)
        raise JSONDecodeError(error)
    access_token = token_req_json.get("access_token")
    """
    Email Request
    """
    profile_request = requests.get(
        "https://kapi.kakao.com/v2/user/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    profile_json = profile_request.json()
    error = profile_json.get("error")
    if error is not None:
        raise JSONDecodeError(error)
    kakao_account = profile_json.get("kakao_account")
    """
    kakao_account에서 이메일 외에
    카카오톡 프로필 이미지, 배경 이미지 url 가져올 수 있음
    print(kakao_account) 참고
    """

    # nickname = kakao_account.get("profile").get("nickname")
    email = kakao_account.get("email")
    # thumbnail_image = kakao_account.get("profile").get("thumbnail_image_url")

    """
    Signup or Signin Request
    """
    try:
        user = User.objects.get(email=email)
        # user.nickname = nickname
        # user.save()
        # 기존에 가입된 유저의 Provider가 kakao가 아니면 에러 발생, 맞으면 로그인
        # 다른 SNS로 가입된 유저
        social_user = SocialAccount.objects.get(user=user)
        if social_user is None:
            return JsonResponse(
                {"err_msg": "email exists but not social user"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if social_user.provider != "kakao":
            return JsonResponse(
                {"err_msg": "no matching social type"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # 기존에 Google로 가입된 유저
        data = {"access_token": access_token, "code": code}
        accept = requests.post(f"{BASE_URL}users/kakao/login/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({"err_msg": "failed to signin"}, status=accept_status)
        accept_json = accept.json()
        accept_json.pop("user", None)
        accept_json["access_token"] = access_token
        accept_json = dumps(accept_json)
        # return JsonResponse(accept_json, status=status.HTTP_200_OK)
        # 변경부
        return HttpResponseRedirect(
            f"http://127.0.0.1:3000/login/kakao_complete?code={accept_json}"
        )
    except User.DoesNotExist:
        # 기존에 가입된 유저가 없으면 새로 가입
        data = {"access_token": access_token, "code": code}
        accept = requests.post(f"{BASE_URL}users/kakao/login/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({"err_msg": "failed to signup"}, status=accept_status)
        # user의 pk, email, first name, last name과 Access Token, Refresh token 가져옴

        accept_json = accept.json()
        accept_json.pop("user", None)
        accept_json["access_token"] = access_token
        accept_json = dumps(accept_json)
        # return JsonResponse(accept_json, status=status.HTTP_200_OK)
        # 변경부
        # HttpResponseRedirect(f"http://127.0.0.1:3000/login/kakao_complete?code={accept_json}")
        return HttpResponseRedirect(
            f"http://127.0.0.1:3000/login/kakao_complete?code={accept_json}"
        )


class KakaoLogin(SocialLoginView):
    adapter_class = kakao_view.KakaoOAuth2Adapter
    client_class = OAuth2Client
    callback_url = KAKAO_CALLBACK_URI


@api_view(["GET"])
def list(request):
    """
    email로 User pk를 조회하는 API
    @param request: email을 get 방식으로 보내야함
    @return: UserSerializer 참고
    """
    email = request.GET.get("email")
    try:
        queryset = User.objects.get(email=email)
        serializer = UserSerializer(queryset)
        return Response(serializer.data)
    except User.DoesNotExist:
        return JsonResponse({"err_msg": "DoesNotExist Email"})


# class UserViewSet(RetrieveAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     filter_backends = [SearchFilter]
#     search_field = ["=email"]


# @action(detail=False, methods=["GET"])
# def email(self, email):
#     qs = self.get_queryset().filter(email=email)
#     serializer = self.get_serializer(qs)
#     return Response(serializer.data)


class AttentionViewSet(ModelViewSet):
    """
    관심종목 CRUD API
    """

    queryset = Attention.objects.all()
    serializer_class = AttentionSerializer
    # filter_backends = [SearchFilter]
    # search_field = ["user"]

    # email 검색
    def list(self, request, *args, **kwargs):
        """
        사용자의 이메일로 관심종목을 조회하는 API
        @param request: get방식으로 email 필요
        @param args: override
        @param kwargs: override
        @return: AttentionSerializer 참고
        """
        email = request.GET.get("email")
        try:
            qs = Attention.objects.filter(user__email=email)
        except Attention.DoesNotExist:
            return JsonResponse({"err_msg": "DoesNotExist Email"})
        # id = request.GET.get("id")
        # qs = User.objects.get(id=id)
        serializer = AttentionSerializer(qs, many=True)
        return Response(serializer.data)


class TelegramViewSet(ModelViewSet):
    """
    텔레그램 DB CRUD API
    """

    queryset = Telegram.objects.all()
    serializer_class = TelegramSerializer
