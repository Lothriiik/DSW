# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from social_django.utils import psa
from rest_framework_simplejwt.tokens import RefreshToken

class GoogleLogin(APIView):
    permission_classes = [AllowAny]

    @psa('social:complete')
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token não encontrado'}, status=400)

        # Obter o usuário autenticado
        user = request.backend.do_auth(token)
        if user:
            # Criar o JWT Token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({'access_token': access_token})

        return Response({'error': 'Falha na autenticação com o Google'}, status=400)
