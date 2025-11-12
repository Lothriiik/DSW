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
class LaboratorioListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        laboratorio = Laboratorio.objects.all()
        serializer = LaboratorioSerializer(laboratorio, many=True)
        return Response({'Laboratorio': serializer.data}, status=status.HTTP_200_OK)
    
@extend_schema(
    summary="Cria um novo laboratório (sala LECC)",
    description="Cadastra um novo laboratório. Requer que o corpo da requisição siga o LaboratorioSerializer.",
    tags=['Laboratórios'],
    request=LaboratorioSerializer, 
    responses={
        201: LaboratorioSerializer,
        400: {'description': 'Dados inválidos ou campos ausentes.'},
        401: {'description': 'Não Autorizado.'}
    }
)        
class LaboratorioCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    queryset = Laboratorio.objects.all()
    serializer_class = LaboratorioSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 

@extend_schema(
        summary="Busca laboratório por ID da Sala",
        description="Retorna o laboratório específico (sala LECC) identificado pelo ID fornecido no parâmetro de query.",
        tags=['Laboratórios'],
        parameters=[
            OpenApiParameter(
                name='id_sala',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='O ID da sala (laboratório) a ser buscado.',
                required=True
            ),
        ],
        responses={
            200: inline_serializer(
                name='LaboratorioByIDResponse',
                fields={'laboratorio': LaboratorioSerializer(many=True)}
            ),
            400: {'description': 'ID não fornecido.'},
            401: {'description': 'Não Autorizado.'}
        }
    )
class LaboratorioByIDView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        id_sala = request.query_params.get('id_sala', None)

        if id_sala is not None:
            
            pedidos = Laboratorio.objects.filter(id_sala=id_sala)
            serializer = LaboratorioSerializer(pedidos, many=True)
            return Response({'laboratorio': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    

@extend_schema(
        summary="Deleta um laboratório por ID",
        description="Remove um laboratório do sistema usando o ID fornecido no parâmetro de query.",
        tags=['Laboratórios'],
        parameters=[
            OpenApiParameter(
                name='id_sala',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='O ID da sala (laboratório) a ser deletado.',
                required=True
            ),
        ],
        responses={
            204: {'description': 'Laboratório deletado com sucesso. (No Content)'},
            400: {'description': 'ID não fornecido.'},
            404: {'description': 'Laboratório não encontrado.'},
            401: {'description': 'Não Autorizado.'}
        }
    )
class LaboratorioDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        sala_id = request.query_params.get('id_sala', None)

        if sala_id is None:
            return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            laboratorio = Laboratorio.objects.get(pk=sala_id) 
            laboratorio.delete()
            
            return Response(status=status.HTTP_204_NO_CONTENT) 
        
        except Laboratorio.DoesNotExist:

            raise NotFound('Laboratorio não encontrado')
    
@extend_schema(
    summary="Atualiza parcialmente um laboratório",
    description="Atualiza um ou mais campos de um laboratório existente, identificado pelo ID na URL.",
    tags=['Laboratórios'],
    request=LaboratorioSerializer(partial=True), 
    responses={
        200: LaboratorioSerializer,
        400: {'description': 'Dados inválidos.'},
        404: {'description': 'Laboratório não encontrado.'},
        401: {'description': 'Não Autorizado.'}
    }
)
class LaboratorioUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Laboratorio.objects.all()
    serializer_class = LaboratorioSerializer
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)