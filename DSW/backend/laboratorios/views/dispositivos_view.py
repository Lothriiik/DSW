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

@extend_schema(
        summary="Lista todos os dispositivos e seus softwares associados",
        tags=['Dispositivos'],
        description="Retorna uma lista completa de todos os dispositivos cadastrados, incluindo a lista aninhada de softwares instalados.",
        responses={
            200: inline_serializer(
                name='DispositivosListResponse',
                fields={
                    'dispositivos': DispositivosSoftwaresSerializer(many=True),
                }
            ),
            401: {'description': 'Não Autorizado (Token JWT ausente/inválido)'}
        }
    )
class DispositivosListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        dispositivos = Dispositivos.objects.all()
        serializer = DispositivosSoftwaresSerializer(dispositivos, many=True)
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
class DispositivosCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Dispositivos.objects.all()
    serializer_class = DispositivosSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@extend_schema(
        summary="Busca dispositivos por ID da Sala (LECC)",
        tags=['Dispositivos'],
        description="Retorna a lista de dispositivos que pertencem a uma sala específica, usando o ID fornecido como parâmetro de query.",
        parameters=[
            OpenApiParameter(
                name='id_sala',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='O ID da sala (LECC) para filtrar os dispositivos.',
                required=True
            ),
        ],
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
    
    def get(self, request):
        id_sala = request.query_params.get('id_sala', None)

        if id_sala is not None:
            
            dispositivos = Dispositivos.objects.filter(id_sala=id_sala)
            serializer = DispositivosSerializer(dispositivos, many=True)
            return Response({'Dispositivos': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'id da sala não fornecido'}, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
        summary="Busca um dispositivo por ID específico",
        tags=['Dispositivos'],
        description="Retorna um dispositivo específico usando o ID do dispositivo fornecido como parâmetro de query.",
        parameters=[
            OpenApiParameter(
                name='id_dispositivo', 
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='O ID único do dispositivo a ser buscado.',
                required=True
            ),
        ],
        responses={
            200: inline_serializer(
                name='DispositivosByIDResponse',
                fields={'Dispositivos': DispositivosSerializer(many=True)} 
            ),
            400: {'description': 'ID do dispositivo não fornecido'},
        }
    )
class DispositivosByIDView(APIView):
    permission_classes = [IsAuthenticated]

    
    def get(self, request):
        id_dispositivo = request.query_params.get('id_dispositivo', None)

        if id_dispositivo is not None:
            
            dispositivos = Dispositivos.objects.filter(id_dispositivo=id_dispositivo)
            serializer = DispositivosSerializer(dispositivos, many=True)
            return Response({'Dispositivos': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'id do dispositivo não fornecido'}, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
        summary="Deleta um dispositivo por ID",
        tags=['Dispositivos'],
        description="Remove um dispositivo do sistema usando o ID fornecido no parâmetro de query.",
        parameters=[
            OpenApiParameter(
                name='id_dispositivo',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='O ID do dispositivo a ser deletado.',
                required=True
            ),
        ],
        responses={
            200: {'description': 'Lista de dispositivos retornada com sucesso.'},
            400: {'description': 'ID não fornecido'},
            404: {'description': 'Dispositivo não encontrado.'}
        }
    )  
class DispositivosDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        dispositivos_id = request.query_params.get('id_dispositivo')

        if not dispositivos_id:
            return Response(
                {'error': 'Parâmetro id_dispositivo é obrigatório.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            dispositivos = Dispositivos.objects.get(id_dispositivo=int(dispositivos_id))
            dispositivos.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (ValueError, TypeError):
            return Response(
                {'error': 'O id_dispositivo deve ser um número válido.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Dispositivos.DoesNotExist:
            raise NotFound('Dispositivo não encontrado.')


@extend_schema(
        summary="Atualiza parcialmente um dispositivo",
        tags=['Dispositivos'],
        description="Atualiza um ou mais campos de um dispositivo existente, identificado pelo ID na URL (PK).",
        request=DispositivosSerializer(partial=True), 
        responses={
            200: DispositivosSerializer,
            400: {'description': 'Dados inválidos.'},
            404: {'description': 'Dispositivo não encontrado.'},
            401: {'description': 'Não Autorizado.'}
        }
    )
class DispositivosUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Dispositivos.objects.all()
    serializer_class = DispositivosSerializer
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


@extend_schema(
        summary="Busca softwares por ID do Dispositivo",
        tags=['Softwares'],
        description="Retorna a lista de softwares instalados em um dispositivo específico.",
        parameters=[
            OpenApiParameter(
                name='id_dispositivo',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='O ID do dispositivo para o qual listar os softwares.',
                required=True
            ),
        ],
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

    def get(self, request):
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
                name='id_software',
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
class SoftwareDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id_software):
        try:
            software = Software.objects.get(id_software=id_software)
            software.delete()
            return Response({'message': 'Software deletado com sucesso'}, status=204)
        except Software.DoesNotExist:
            raise NotFound('Software não encontrado.')