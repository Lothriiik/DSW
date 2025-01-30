from .serializer import (ObservacaoSerializer)
from .models import Observacao
from rest_framework import permissions, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.urls import path
from rest_framework.permissions import IsAuthenticated, AllowAny


class ObservacaoListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        observacao = Observacao.objects.all()
        serializer = ObservacaoSerializer(observacao, many=True)
        return Response({'Observacao': serializer.data}, status=status.HTTP_200_OK)
        
class ObservacaoCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    queryset = Observacao.objects.all()
    serializer_class = ObservacaoSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
    
class ObservacaoByIDView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        id_observacao = request.query_params.get('id_observacao', None)

        if id_observacao is not None:
            
            pedidos = Observacao.objects.filter(id_observacao=id_observacao)
            serializer = ObservacaoSerializer(pedidos, many=True)
            return Response({'observacao': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
class ObservacaoByDispView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        id_dispositivo = request.query_params.get('id_dispositivo', None)

        if id_dispositivo is not None:
            
            pedidos = Observacao.objects.filter(id_dispositivo=id_dispositivo)
            serializer = ObservacaoSerializer(pedidos, many=True)
            return Response({'observacao': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
class ObservacaoDeleteView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request):
        observacao_id = request.query_params.get('id_observacao', None)

        if observacao_id is not None:
            try:
                observacao = Observacao.objects.get(id_sala=observacao_id)
                observacao.delete()
                return Response({'message': 'Observacao deletado com sucesso'}, status=status.HTTP_204_NO_CONTENT)
            except Observacao.DoesNotExist:
                raise NotFound('Observacao não encontrado')
        
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
class ObservacaoUpdateView(generics.UpdateAPIView):
    permission_classes = [AllowAny]
    queryset = Observacao.objects.all()
    serializer_class = ObservacaoSerializer
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)