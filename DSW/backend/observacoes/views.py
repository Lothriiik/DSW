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

class ObservacaoListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Observacao.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ObservacaoCreateSerializer
        return ObservacaoSerializer

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
    def get(self, request, *args, **kwargs):
        observacao = self.get_queryset()
        serializer = self.get_serializer(observacao, many=True)
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
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
 

class ObservacaoDetailView(generics.RetrieveUpdateDestroyAPIView):

    permission_classes = [IsAuthenticated]
    queryset = Observacao.objects.all()
    serializer_class = ObservacaoCreateSerializer
    lookup_field = 'pk'

    @extend_schema(
        summary="Detalhes da Observação",
        description="Retorna os dados completos de uma observação específica pelo ID.",
        tags=['Observações'],
        responses={200: ObservacaoSerializer, 404: {'description': 'Observação não encontrada.'}}
    )
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Atualiza Observação (Completo)",
        description="Atualiza todos os campos de uma observação existente.",
        tags=['Observações'],
        responses={200: ObservacaoSerializer, 400: {'description': 'Dados inválidos.'}}
    )
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    @extend_schema(
        summary="Atualiza Observação (Parcial)",
        description="Atualiza parcialmente os campos de uma observação existente.",
        tags=['Observações'],
        responses={200: ObservacaoSerializer, 400: {'description': 'Dados inválidos.'}}
    )
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Deleta Observação",
        description="Remove uma observação do sistema pelo ID.",
        tags=['Observações'],
        responses={204: {'description': 'Observação deletada com sucesso.'}, 404: {'description': 'Observação não encontrada.'}}
    )
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        novo_id = request.data.get('id_dispositivo')

        if novo_id and novo_id != instance.id_dispositivo_id: 
             from laboratorios.models import Dispositivos
             try:
                 novo_disp = Dispositivos.objects.get(pk=novo_id)
                 if novo_disp.id_sala != instance.id_sala_id:
                     return Response({'non_field_errors': ['Dispositivo pertence a outra sala.']},
                                status=status.HTTP_400_BAD_REQUEST)
             except Dispositivos.DoesNotExist:
                 return Response({'detail': 'Dispositivo não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        
        return super().update(request, *args, **kwargs)


@extend_schema(
        summary="Busca observações por ID de Dispositivo",
        tags=['Observações'],
        description="Retorna a lista de observações relacionadas a um dispositivo específico.",
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

    def get(self, request, id_dispositivo=None):
        if id_dispositivo is None:
             id_dispositivo = request.query_params.get('id_dispositivo', None)

        if id_dispositivo is not None:
            pedidos = Observacao.objects.filter(id_dispositivo=id_dispositivo)
            serializer = ObservacaoSerializer(pedidos, many=True)
            return Response({'observacao': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)