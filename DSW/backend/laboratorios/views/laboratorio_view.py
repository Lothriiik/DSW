from ..serializers.laboratorio_serializer import (LaboratorioSerializer)
from ..models import Laboratorio
from rest_framework import permissions, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.urls import path
from rest_framework.permissions import IsAuthenticated, AllowAny


class LaboratorioListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        laboratorio = Laboratorio.objects.all()
        serializer = LaboratorioSerializer(laboratorio, many=True)
        return Response({'Laboratorio': serializer.data}, status=status.HTTP_200_OK)
        
class LaboratorioCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    queryset = Laboratorio.objects.all()
    serializer_class = LaboratorioSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
    
class LaboratorioByIDView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        id_sala = request.query_params.get('id_sala', None)

        if id_sala is not None:
            
            pedidos = Laboratorio.objects.filter(id_sala=id_sala)
            serializer = LaboratorioSerializer(pedidos, many=True)
            return Response({'laboratorio': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
class LaboratorioDeleteView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request):
        sala_id = request.query_params.get('id_sala', None)

        if sala_id is not None:
            try:
                laboratorio = Laboratorio.objects.get(id_sala=sala_id)
                laboratorio.delete()
                return Response({'message': 'Laboratorio deletado com sucesso'}, status=status.HTTP_204_NO_CONTENT)
            except Laboratorio.DoesNotExist:
                raise NotFound('Laboratorio não encontrado')
        
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
class LaboratorioUpdateView(generics.UpdateAPIView):
    permission_classes = [AllowAny]
    queryset = Laboratorio.objects.all()
    serializer_class = LaboratorioSerializer
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)