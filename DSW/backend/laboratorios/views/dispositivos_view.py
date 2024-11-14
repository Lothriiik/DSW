from ..serializers.dispositivos_serializer import (DispositivosSerializer)
from ..serializers.software_serializer import (SoftwareSerializer)
from ..models import Dispositivos, Software
from rest_framework import permissions, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, AllowAny

class DispositivosListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        dispositivos = Dispositivos.objects.all()
        serializer = DispositivosSerializer(dispositivos, many=True)
        return Response({'dispositivos': serializer.data}, status=status.HTTP_200_OK)
	
class DispositivosCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = Dispositivos.objects.all()
    serializer_class = DispositivosSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
 
class DispositivosByLeccView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        id_sala = request.query_params.get('id_sala', None)

        if id_sala is not None:
            
            dispositivos = Dispositivos.objects.filter(id_sala=id_sala)
            serializer = DispositivosSerializer(dispositivos, many=True)
            return Response({'Dispositivos': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'id da sala não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
class DispositivosDeleteView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request):
        dispositivos_id = request.query_params.get('id_dispositivo', None)

        if dispositivos_id is not None:
            try:
                dispositivos = Dispositivos.objects.get(id_dispositivo=dispositivos_id)
                dispositivos.delete()
                return Response({'message': 'Dispositivo deletado com sucesso'}, status=status.HTTP_204_NO_CONTENT)
            except Dispositivos.DoesNotExist:
                raise NotFound('Dispositivo não encontrado.')
        
        return Response({'error': 'ID não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
    
class DispositivosUpdateView(generics.UpdateAPIView):
    permission_classes = [AllowAny]
    queryset = Dispositivos.objects.all()
    serializer_class = DispositivosSerializer
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
class SoftwaresByDispositivosView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        id_dispositivo = request.query_params.get('id_dispositivo', None)

        if id_dispositivo is not None:
            softwares = Software.objects.filter(id_dispositivo=id_dispositivo)
            serializer = SoftwareSerializer(softwares, many=True)
            return Response({'Software': serializer.data}, status=status.HTTP_200_OK)
            
        return Response({'error': 'id do dispositivo não fornecido'}, status=status.HTTP_400_BAD_REQUEST)

    
class SoftwareCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = Software.objects.all()
    serializer_class = SoftwareSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SoftwareDeleteView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, id_software):
        try:
            software = Software.objects.get(id_software=id_software)
            software.delete()
            return Response({'message': 'Software deletado com sucesso'}, status=204)
        except Software.DoesNotExist:
            raise NotFound('Software não encontrado.')