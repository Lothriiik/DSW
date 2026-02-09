from ..serializers.laboratorio_serializer import (LaboratorioSerializer)
from ..models import Laboratorio
from drf_spectacular.utils import extend_schema, OpenApiParameter, inline_serializer
from drf_spectacular.types import OpenApiTypes
from rest_framework import permissions, status, generics, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.urls import path
from rest_framework.permissions import IsAuthenticated, AllowAny


class LaboratorioListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Laboratorio.objects.all()
    serializer_class = LaboratorioSerializer

    @extend_schema(
        summary="Lista todos os laboratórios",
        description="Retorna uma lista de todos os laboratórios (salas LECC) cadastrados.",
        tags=['Laboratórios'], 
        responses={
            200: inline_serializer(
                name='LaboratorioListResponse',
                fields={'Laboratorio': LaboratorioSerializer(many=True)}
            ),
            401: {'description': 'Não Autorizado.'}
        }
    )
    def get(self, request, *args, **kwargs):
        laboratorio = self.get_queryset()
        serializer = self.get_serializer(laboratorio, many=True)
        return Response({'Laboratorio': serializer.data}, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Cria um novo laboratório (sala LECC)",
        description="Cadastra um novo laboratório. Requer LaboratorioSerializer no corpo.",
        tags=['Laboratórios'],
        request=LaboratorioSerializer, 
        responses={
            201: LaboratorioSerializer,
            400: {'description': 'Dados inválidos.'},
            401: {'description': 'Não Autorizado.'}
        }
    )        
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
 

class LaboratorioDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Laboratorio.objects.all()
    serializer_class = LaboratorioSerializer
    lookup_field = 'pk'

    @extend_schema(
        summary="Detalhes do Laboratório",
        description="Retorna os dados completos de um laboratório específico pelo ID.",
        tags=['Laboratórios'],
        responses={200: LaboratorioSerializer, 404: {'description': 'Laboratório não encontrado.'}}
    )
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Atualiza Laboratório (Completo)",
        description="Atualiza todos os campos de um laboratório existente.",
        tags=['Laboratórios'],
        responses={200: LaboratorioSerializer, 400: {'description': 'Dados inválidos.'}}
    )
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    @extend_schema(
        summary="Atualiza Laboratório (Parcial)",
        description="Atualiza parcialmente os campos de um laboratório existente.",
        tags=['Laboratórios'],
        responses={200: LaboratorioSerializer, 400: {'description': 'Dados inválidos.'}}
    )
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Deleta Laboratório",
        description="Remove um laboratório do sistema pelo ID.",
        tags=['Laboratórios'],
        responses={204: {'description': 'Laboratório deletado com sucesso.'}, 404: {'description': 'Laboratório não encontrado.'}}
    )
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)