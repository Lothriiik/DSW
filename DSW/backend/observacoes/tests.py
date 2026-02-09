from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from django.urls import reverse
from rest_framework.exceptions import NotFound
from datetime import date
from laboratorios.models import Laboratorio, Dispositivos
from observacoes.models import Observacao 

class ObservacaoViewTests(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='tester', password='testpassword')
        access_token = AccessToken.for_user(self.user)
        self.auth_headers = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
        
        self.data_hoje = date.today().strftime('%Y-%m-%d')
        
        self.lab1 = Laboratorio.objects.create(nome='LECC 1')
        self.lab2 = Laboratorio.objects.create(nome='LECC 2')
        
        self.disp_lab1 = Dispositivos.objects.create(id_sala=self.lab1, patrimonio='D1', tipo='Desktop', data_verificacao=self.data_hoje)
        self.disp_lab2 = Dispositivos.objects.create(id_sala=self.lab2, patrimonio='D2', tipo='Desktop', data_verificacao=self.data_hoje) 
        
        self.obs1 = Observacao.objects.create(
            id_sala=self.lab1, id_dispositivo=self.disp_lab1, id_usuario=self.user,
            tipo='Dispositivo', observacao='Monitor piscando.', 
            data=self.data_hoje
        )
        self.obs2 = Observacao.objects.create(
            id_sala=self.lab1, id_dispositivo=self.disp_lab1, id_usuario=self.user,
            tipo='Dispositivo', observacao='Sem acesso ao WiFi.',
            data=self.data_hoje
        )
        
        self.list_url = reverse('obs-list')
        self.create_url = reverse('obs-create')
        self.by_id_url = reverse('obs-by-id')
        self.by_disp_url = reverse('obs-by-disp')
        self.delete_url = reverse('obs-delete')
        self.update_url = reverse('obs-update', kwargs={'pk': self.obs1.pk})


    def test_01_create_observacao_success(self):
        """Testa criação bem-sucedida de uma observação ligada a um dispositivo (201)."""
        data_valida = {
            'id_sala': self.lab1.pk,
            'id_dispositivo': self.disp_lab1.pk,
            'id_usuario': self.user.pk,
            'tipo': 'Dispositivo',
            'observacao': 'Novo bug: App travando',
            'data': self.data_hoje
        }
        
        response = self.client.post(self.create_url, data_valida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Observacao.objects.filter(observacao='Novo bug: App travando').exists())

    def test_02_create_observacao_only_lab_success(self):
        """Testa criação bem-sucedida de uma observação GERAL para a Sala (id_dispositivo é nulo)."""
        data_valida = {
            'id_sala': self.lab1.pk,
            'id_usuario': self.user.pk,
            'tipo': 'Laboratorio',
            'observacao': 'Verificar a pintura da sala.',
            'data': self.data_hoje
        }
        
        response = self.client.post(self.create_url, data_valida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Observacao.objects.filter(tipo='Laboratorio', id_dispositivo__isnull=True).exists())

    def test_03_create_observacao_validation_fails(self):
        """Testa a validação customizada: dispositivo NÃO pertence à sala (400 Bad Request)."""
        data_invalida = {
            'id_sala': self.lab1.pk,      
            'id_dispositivo': self.disp_lab2.pk, 
            'id_usuario': self.user.pk,
            'tipo': 'Dispositivo',
            'observacao': 'Teste de validação de FK.',
            'data': self.data_hoje
        }
        
        response = self.client.post(self.create_url, data_invalida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertIn('non_field_errors', response.data)
        self.assertIn("O dispositivo selecionado não pertence à sala escolhida.", str(response.data['non_field_errors'][0]))

    def test_04_list_all_observacoes_success(self):
        """Testa listagem geral (ListView)."""
        response = self.client.get(self.list_url, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['Observacao']), 2) 

    def test_05_filter_by_dispositivo_success(self):
        """Busca por id_dispositivo (ByDispView)."""
        response = self.client.get(
            self.by_disp_url, 
            {'id_dispositivo': self.disp_lab1.pk}, 
            **self.auth_headers
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['observacao']), 2) 

    def test_06_filter_by_dispositivo_no_id_fails(self):
        """Busca deve falhar se id_dispositivo não for fornecido."""
        response = self.client.get(self.by_disp_url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'ID não fornecido')

    def test_07_retrieve_by_id_success(self):
        """Busca por id_observacao (query parameter)."""
        response = self.client.get(
            self.by_id_url, 
            {'id_observacao': self.obs1.pk}, 
            **self.auth_headers
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['observacao'][0]['tipo'], 'Dispositivo')

    def test_08_update_observacao_success(self):
        """Atualização parcial da descrição (PATCH)."""
        novo_texto = 'Monitor foi trocado.'
        dados_atualizados = {'observacao': novo_texto}
        
        response = self.client.patch(self.update_url, dados_atualizados, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.obs1.refresh_from_db()
        self.assertEqual(self.obs1.observacao, novo_texto)

    def test_09_delete_observacao_success(self):
        """Deleção por query parameter (204 No Content)."""
        
        url_com_query = f"{self.delete_url}?id_observacao={self.obs2.pk}"
        
        response = self.client.delete(url_com_query, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Observacao.objects.filter(pk=self.obs2.pk).exists())

    def test_10_delete_observacao_not_found_fails(self):
        """Testa a deleção de um ID inexistente (404 Not Found)."""
        
        url_inexistente = f"{self.delete_url}?id_observacao=99999999"
        
        response = self.client.delete(url_inexistente, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('Observacao não encontrada', str(response.data))

    def test_11_list_sem_auth_retorna_401(self):
        """Usuário não autenticado deve receber 401 ao listar observações."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_12_update_dispositivo_invalido_fails(self):
        """Não deve permitir atualizar para dispositivo de outra sala."""
        dados_invalidos = {'id_dispositivo': self.disp_lab2.pk}
        response = self.client.patch(self.update_url, dados_invalidos, format='json', **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)

    def test_13_filter_by_dispositivo_sem_observacoes(self):
        """Deve retornar lista vazia se dispositivo não tem observações."""
        response = self.client.get(self.by_disp_url, {'id_dispositivo': self.disp_lab2.pk}, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['observacao']), 0)

    def test_14_retrieve_by_id_inexistente(self):
        """Busca por ID inexistente deve retornar 200 com lista vazia (ou 404 se quiser mudar)."""
        response = self.client.get(self.by_id_url, {'id_observacao': 99999}, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['observacao']), 0)

    def test_15_create_observacao_campo_faltando_fails(self):
        """Deve falhar se algum campo obrigatório faltar."""
        data_invalida = {
            'id_sala': self.lab1.pk,
            # 'observacao' ausente
            'id_usuario': self.user.pk,
            'data': self.data_hoje
        }
        response = self.client.post(self.create_url, data_invalida, format='json', **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('observacao', response.data)

    def test_16_list_ordering_estavel(self):
        """Verifica se a listagem retorna observações em ordem de criação."""
        response = self.client.get(self.list_url, **self.auth_headers)
        ids = [obs['id_observacao'] for obs in response.data['Observacao']]
        self.assertEqual(ids, sorted(ids))



