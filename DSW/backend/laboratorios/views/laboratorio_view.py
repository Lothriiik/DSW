from ..serializers.laboratorio_serializer import (LaboratorioSerializer, DispositivosLabSerializer)
from ..models import Laboratorio
from rest_framework import permissions, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.urls import path


class LaboratorioListView(APIView):
	permission_classes = [permissions.IsAuthenticated]
    
	def get(self, request):
		laboratorio = Laboratorio.objects.all()
		serializer = LaboratorioSerializer(laboratorio, many=True)
		return Response({'Laboratorio': serializer.data}, status=status.HTTP_200_OK)
	
class LaboratorioCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
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
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        id_sala = request.query_params.get('id_sala', None)

        if id_sala is not None:
            
            pedidos = Laboratorio.objects.filter(sala=id_sala)
            serializer = LaboratorioSerializer(pedidos, many=True)
            return Response({'laboratorio': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
class LaboratorioDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        # Obtém o ID da query string (por exemplo: ?id=1)
        sala_id = request.query_params.get('id_sala', None)

        if sala_id is not None:
            try:
                # Obtém o pedido com o ID fornecido e verifica se pertence ao usuário autenticado
                laboratorio = Laboratorio.objects.get(id=sala_id, usuario=request.user)
                laboratorio.delete()
                return Response({'message': 'Laboratorio deletado com sucesso'}, status=status.HTTP_204_NO_CONTENT)
            except Laboratorio.DoesNotExist:
                raise NotFound('Laboratorio não encontrado')
        
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
class LaboratorioUpdateView(generics.UpdateAPIView):
    queryset = Laboratorio.objects.all()
    serializer_class = LaboratorioSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)