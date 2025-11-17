from .serializer import (ObservacaoSerializer, ObservacaoCreateSerializer)
from .models import Observacao
from drf_spectacular.utils import extend_schema, OpenApiParameter, inline_serializer
from drf_spectacular.types import OpenApiTypes
from rest_framework import permissions, status, generics, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.urls import path
from rest_framework.permissions import IsAuthenticated, AllowAny

@extend_schema(
        summary="Lista todas as observações",
        description="Retorna uma lista completa de todas as observações/relatos de problemas.",
        tags=['Observações'],
        responses={
            200: inline_serializer(
                name='ObservacaoListResponse',
                fields={'Observacao': ObservacaoSerializer(many=True)}
            ),
            401: {'description': 'Não Autorizado.'}
        }
    )
class ObservacaoListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        observacao = Observacao.objects.all()
        serializer = ObservacaoSerializer(observacao, many=True)
        return Response({'Observacao': serializer.data}, status=status.HTTP_200_OK)


@extend_schema( 
        summary="Cria uma nova observação/relato de problema",
        tags=['Observações'],
        description="Cadastra uma nova observação. Requer o ObservacaoCreateSerializer para o corpo da requisição.",
        request=ObservacaoCreateSerializer,
        responses={
            201: ObservacaoSerializer,
            400: {'description': 'Dados inválidos ou campos ausentes.'},
            401: {'description': 'Não Autorizado.'}
        }
    )      
class ObservacaoCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    queryset = Observacao.objects.all()
    serializer_class = ObservacaoCreateSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
@extend_schema(
        summary="Busca observação por ID específico",
        tags=['Observações'],
        description="Retorna a observação identificada pelo ID fornecido no parâmetro de query.",
        parameters=[
            OpenApiParameter(
                name='id_observacao',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='O ID da observação a ser buscada.',
                required=True
            ),
        ],
        responses={
            200: inline_serializer(
                name='ObservacaoByIDResponse',
                fields={'observacao': ObservacaoSerializer(many=True)}
            ),
            400: {'description': 'ID não fornecido.'},
            404: {'description': 'Observação não encontrada.'}
        }
    )
class ObservacaoByIDView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        id_observacao = request.query_params.get('id_observacao', None)

        if id_observacao is not None:
            
            pedidos = Observacao.objects.filter(id_observacao=id_observacao)
            serializer = ObservacaoSerializer(pedidos, many=True)
            return Response({'observacao': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
@extend_schema(
        summary="Busca observações por ID de Dispositivo",
        tags=['Observações'],
        description="Retorna a lista de observações relacionadas a um dispositivo específico.",
        parameters=[
            OpenApiParameter(
                name='id_dispositivo',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='O ID do dispositivo para filtrar as observações.',
                required=True
            ),
        ],
        responses={
            200: inline_serializer(
                name='ObservacaoByDispResponse',
                fields={'observacao': ObservacaoSerializer(many=True)}
            ),
            400: {'description': 'ID não fornecido.'}
        }
    )
class ObservacaoByDispView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        id_dispositivo = request.query_params.get('id_dispositivo', None)

        if id_dispositivo is not None:
            
            pedidos = Observacao.objects.filter(id_dispositivo=id_dispositivo)
            serializer = ObservacaoSerializer(pedidos, many=True)
            return Response({'observacao': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
@extend_schema(
        summary="Deleta uma observação por ID",
        tags=['Observações'],
        description="Remove uma observação do sistema usando o ID fornecido no parâmetro de query.",
        parameters=[
            OpenApiParameter(
                name='id_observacao',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='O ID da observação a ser deletada.',
                required=True
            ),
        ],
        responses={
            204: {'description': 'Observação deletada com sucesso. (No Content)'},
            400: {'description': 'ID não fornecido.'},
            404: {'description': 'Observação não encontrada.'}
        }
    )
class ObservacaoDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        observacao_id = request.query_params.get('id_observacao', None)

        if observacao_id is not None:
            try:
                observacao = Observacao.objects.get(id_observacao=observacao_id)
                observacao.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except Observacao.DoesNotExist:
                raise NotFound('Observacao não encontrada')
        
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
@extend_schema(
        summary="Atualiza parcialmente uma observação",
        tags=['Observações'],
        description="Atualiza um ou mais campos de uma observação existente, identificado pelo ID (PK) na URL.",
        request=ObservacaoCreateSerializer(partial=True), 
        responses={
            200: ObservacaoSerializer,
            400: {'description': 'Dados inválidos.'},
            404: {'description': 'Observação não encontrada.'},
            401: {'description': 'Não Autorizado.'}
        }
    )
class ObservacaoUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Observacao.objects.all()
    serializer_class = ObservacaoCreateSerializer
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        novo_id = request.data.get('id_dispositivo')

        if novo_id and novo_id != instance.id_dispositivo:
            from .models import Dispositivos
            try:
                novo_disp = Dispositivos.objects.get(pk=novo_id)
            except Dispositivos.DoesNotExist:
                return Response({'detail': 'Dispositivo não encontrado.'}, status=status.HTTP_404_NOT_FOUND)


            if novo_disp.id_sala != instance.id_sala:
                return Response({'non_field_errors': ['Dispositivo pertence a outra sala.']},
                                status=status.HTTP_400_BAD_REQUEST)

        return super().update(request, *args, **kwargs)