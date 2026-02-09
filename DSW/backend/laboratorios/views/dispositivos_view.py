from ..serializers.dispositivos_serializer import (DispositivosSerializer, DispositivosSoftwaresSerializer)
from ..serializers.software_serializer import (SoftwareSerializer)
from ..models import Dispositivos, Software
from drf_spectacular.utils import extend_schema, OpenApiParameter, inline_serializer, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from rest_framework import serializers
from rest_framework import permissions, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, AllowAny

class DispositivosListCreateView(generics.ListCreateAPIView):

    permission_classes = [IsAuthenticated]
    queryset = Dispositivos.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DispositivosSerializer
        return DispositivosSoftwaresSerializer

    @extend_schema(
        summary="Lista todos os dispositivos e seus softwares associados",
        tags=['Dispositivos'],
        description="Retorna uma lista completa de todos os dispositivos cadastrados, incluindo a lista aninhada de softwares instalados.",
        responses={
            200: inline_serializer(
                name='DispositivosListResponse',
                fields={'dispositivos': DispositivosSoftwaresSerializer(many=True)}
            ),
            401: {'description': 'Não Autorizado (Token JWT ausente/inválido)'}
        }
    )
    def get(self, request, *args, **kwargs):

        dispositivos = self.get_queryset()
        serializer = self.get_serializer(dispositivos, many=True)
        return Response({'dispositivos': serializer.data}, status=status.HTTP_200_OK)

    @extend_schema( 
        summary="Cria um novo dispositivo",
        tags=['Dispositivos'],
        description="Cadastra um novo dispositivo no sistema. Corpo da requisição segue o DispositivosSerializer.",
        request=DispositivosSerializer, 
        responses={
            201: DispositivosSerializer, 
            400: {'description': 'Dados inválidos ou campos obrigatórios ausentes.'},
            401: {'description': 'Não Autorizado (Token JWT inválido)'}
        }
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
@extend_schema(
        summary="Busca dispositivos por ID da Sala (LECC)",
        tags=['Dispositivos'],
        description="Retorna a lista de dispositivos que pertencem a uma sala específica, usando o ID fornecido como parâmetro de query (id_sala) passado na URL (ex: /laboratorios/1/dispositivos/).",
        responses={
            200: inline_serializer(
                name='DispositivosByLeccResponse',
                fields={'Dispositivos': DispositivosSerializer(many=True)}
            ),
            400: {'description': 'ID da sala não fornecido'},
        }
    )
class DispositivosByLeccView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id_sala=None):
        if id_sala is None:
            id_sala = request.query_params.get('id_sala', None)

        if id_sala is not None:
            dispositivos = Dispositivos.objects.filter(id_sala=id_sala)
            serializer = DispositivosSerializer(dispositivos, many=True)
            return Response({'Dispositivos': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'id da sala não fornecido'}, status=status.HTTP_400_BAD_REQUEST)

class DispositivosDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Dispositivos.objects.all()
    serializer_class = DispositivosSerializer
    lookup_field = 'pk'
    lookup_url_kwarg = 'pk' 

    @extend_schema(
        summary="Detalhes do Dispositivo",
        description="Retorna os dados completos de um dispositivo específico pelo ID.",
        tags=['Dispositivos'],
        responses={200: DispositivosSerializer, 404: {'description': 'Dispositivo não encontrado.'}}
    )
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Deleta Dispositivo",
        description="Remove um dispositivo do sistema pelo ID.",
        tags=['Dispositivos'],
        responses={204: {'description': 'Dispositivo deletado com sucesso.'}, 404: {'description': 'Dispositivo não encontrado.'}}
    )
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    @extend_schema(
        summary="Atualiza Dispositivo (Completo)",
        description="Atualiza todos os campos de um dispositivo existente.",
        tags=['Dispositivos'],
        responses={200: DispositivosSerializer, 400: {'description': 'Dados inválidos.'}}
    )
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    @extend_schema(
        summary="Atualiza Dispositivo (Parcial)",
        description="Atualiza parcialmente os campos de um dispositivo existente.",
        tags=['Dispositivos'],
        responses={200: DispositivosSerializer, 400: {'description': 'Dados inválidos.'}}
    )
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


@extend_schema(
        summary="Busca softwares por ID do Dispositivo",
        tags=['Softwares'],
        description="Retorna a lista de softwares instalados em um dispositivo específico.",
        responses={
            200: inline_serializer(
                name='SoftwaresByDispositivoResponse',
                fields={'Software': SoftwareSerializer(many=True)}
            ),
            400: {'description': 'ID do dispositivo não fornecido'},
        }
    )
class SoftwaresByDispositivosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_dispositivo=None):
        if id_dispositivo is None:
            id_dispositivo = request.query_params.get('id_dispositivo', None)

        if id_dispositivo is not None:
            softwares = Software.objects.filter(id_dispositivo=id_dispositivo)
            serializer = SoftwareSerializer(softwares, many=True)
            return Response({'Software': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'id do dispositivo não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
 
@extend_schema( 
        summary="Cria um novo software",
        tags=['Softwares'],
        description="Cadastra um novo software no sistema. Corpo da requisição segue o SoftwareSerializer.",
        request=SoftwareSerializer,
        responses={
            201: SoftwareSerializer,
            400: {'description': 'Dados inválidos.'},
            401: {'description': 'Não Autorizado.'}
        }
    )
class SoftwareCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema( 
        summary="Deleta um Software por ID",
        tags=['Softwares'],
        description="Remove um software. O ID é passado como parte da URL (path parameter).",
        parameters=[
             OpenApiParameter(
                name='pk', 
                type=OpenApiTypes.INT, 
                location=OpenApiParameter.PATH,
                description='O ID do software a ser deletado (path parameter).',
                required=True
            ),
        ],
        responses={
            204: {'description': 'Software deletado com sucesso. (Não retorna corpo)'},
            404: {'description': 'Software não encontrado.'},
            401: {'description': 'Não Autorizado.'}
        }
    )
class SoftwareDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer
    lookup_field = 'pk'
    