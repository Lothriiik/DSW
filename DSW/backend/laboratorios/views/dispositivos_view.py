from almoxarifado.serializers.pedido_serializer import (PedidoCreateSerializer, PedidoSerializer)
from ..models import Pedido
from rest_framework import permissions, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

class PedidoListView(APIView):
	permission_classes = [permissions.IsAuthenticated]
    
	def get(self, request):
		pedidos = Pedido.objects.all()
		serializer = PedidoSerializer(pedidos, many=True)
		return Response({'pedidos': serializer.data}, status=status.HTTP_200_OK)
	
class PedidoCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Pedido.objects.all()
    serializer_class = PedidoCreateSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserPedidoListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        pedidos = Pedido.objects.filter(usuario=request.user)
        serializer = PedidoSerializer(pedidos, many=True)
        return Response({'pedidos': serializer.data}, status=status.HTTP_200_OK)
    
class PedidoByStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        status_param = request.query_params.get('status', None)

        status_mapping = {
            'pendente': 'Pendente',
            'negado': 'Negado',
            'entregue': 'Entregue',
        }

        if status_param is not None:
            normalized_status = status_mapping.get(status_param.lower())
            
            if normalized_status:
                pedidos = Pedido.objects.filter(status=normalized_status)
                serializer = PedidoSerializer(pedidos, many=True)
                return Response({'pedidos': serializer.data}, status=status.HTTP_200_OK)
            return Response({'error': 'Status inválido'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'error': 'Status não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
class PedidoByIDView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        id_usuario = request.query_params.get('usuario', None)

        if id_usuario is not None:
            
            pedidos = Pedido.objects.filter(usuario=id_usuario)
            serializer = PedidoSerializer(pedidos, many=True)
            return Response({'pedidos': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'Status não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
class PedidoDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        # Obtém o ID da query string (por exemplo: ?id=1)
        pedido_id = request.query_params.get('id', None)

        if pedido_id is not None:
            try:
                # Obtém o pedido com o ID fornecido e verifica se pertence ao usuário autenticado
                pedido = Pedido.objects.get(id=pedido_id, usuario=request.user)
                pedido.delete()
                return Response({'message': 'Pedido deletado com sucesso'}, status=status.HTTP_204_NO_CONTENT)
            except Pedido.DoesNotExist:
                raise NotFound('Pedido não encontrado ou não pertence ao usuário')
        
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
class PedidoUpdateView(generics.UpdateAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)