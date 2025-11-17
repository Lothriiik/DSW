from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import NotFound
from django.urls import reverse
from laboratorios.models import Dispositivos, Laboratorio, Software
from laboratorios.views.dispositivos_view import DispositivosListView

class DispositivosViewTests(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='tester', password='testpassword')
        self.admin = User.objects.create_superuser(username='admin1', password='admin')
        
        access_token = AccessToken.for_user(self.user)
        self.auth_headers = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}

        self.lab1 = Laboratorio.objects.create(nome='LECC 1', sala_ou_bloco='Bloco C Terreo')
        self.disp_existente = Dispositivos.objects.create(
            tipo='Desktop', 
            patrimonio='P001', 
            id_sala=self.lab1,
            status='Funcionando',
            data_verificacao='2025-10-27' 
        )
        self.disp_existente2 = Dispositivos.objects.create(
            tipo='Desktop', 
            patrimonio='P002', 
            id_sala=self.lab1,
            status='Funcionando',
            data_verificacao='2025-10-27' 
        )

        self.list_url = reverse('disp-list') 
        self.create_url = reverse('disp-create')
        self.lecc_url = reverse('disp-by-lecc')
        self.delete_url = reverse('disp-delete')
        self.list_id_url = reverse('disp-by-id')
        self.update_url = reverse('disp-update', kwargs={'pk': self.disp_existente.pk})

    def test_list_dispositivos_unauthenticated_fails(self):
        """A listagem deve falhar se não houver autenticação JWT"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_dispositivos_success(self):
        """A listagem de dispositivos deve retornar 200 OK e todos os objetos."""
        response = self.client.get(self.list_url, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('dispositivos', response.data)
        self.assertEqual(len(response.data['dispositivos']), 2) 
        self.assertEqual(response.data['dispositivos'][0]['patrimonio'], 'P001')

    def test_filter_by_lecc_success(self):
        """A busca por id_sala deve retornar apenas dispositivos da sala correta."""
        response = self.client.get(
            self.lecc_url, 
            {'id_sala': self.lab1.id_sala}, 
            **self.auth_headers
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Dispositivos', response.data)
        self.assertEqual(len(response.data['Dispositivos']), 2) 

    def test_filter_by_lecc_no_id_fails(self):
        """A busca deve falhar com 400 Bad Request se id_sala não for fornecido."""
        response = self.client.get(self.lecc_url, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'id da sala não fornecido')
    
    def test_filter_by_id_no_id_fails(self):
        """A busca deve falhar com 400 Bad Request se id_sala não for fornecido."""
        response = self.client.get(self.list_id_url, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'id do dispositivo não fornecido')

    def test_create_dispositivo_success(self):
        """Testa a criação de um novo dispositivo e verifica o 201 Created."""
        
        data_valida = {
            'tipo': 'Notebook',
            'modelo': 'Dell XPS 15',
            'patrimonio': 'N999',
            'id_sala': self.lab1.pk,
            'status': 'Funcionando',
            'is_computador': True,
            'data_verificacao': "2025-10-28",
        }
        
        response = self.client.post(self.create_url, data_valida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        self.assertTrue(Dispositivos.objects.filter(patrimonio='N999').exists())
        
        self.assertEqual(response.data['id_sala'], self.lab1.pk)

    def test_create_dispositivo_fail_unic(self):
        """Testa a criação de um novo dispositivo com patrimonio repetido, devendo falhar com erro 400."""
        
        data_valida = {
            'tipo': 'Notebook',
            'modelo': 'Dell XPS 15',
            'patrimonio': 'P002',
            'id_sala': self.lab1.pk,
            'status': 'Funcionando',
            'is_computador': True,
            'data_verificacao': "2025-10-28",
        }
        
        response = self.client.post(self.create_url, data_valida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST),
        self.assertIn('patrimonio', response.data)


    def test_create_dispositivo_fail_without_required_field(self):
        """Testa a criação de um novo dispositivo sem campo obrigatorio, devendo falhar com erro 400."""
        
        data_valida = {
            'tipo': 'Notebook',
            'modelo': 'Dell XPS 15',
            'id_sala': self.lab1.pk,
            'status': 'Funcionando',
            'is_computador': True,
            'data_verificacao': "2025-10-28",
        }
        
        response = self.client.post(self.create_url, data_valida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST),
        self.assertIn('patrimonio', response.data)

    def test_create_dispositivo_fail_invalid_key(self):
        """Testa a criação de um novo dispositivo com id_sala invalido, devendo falhar com erro 400."""
        
        data_valida = {
            'tipo': 'Notebook',
            'modelo': 'Dell XPS 15',
            'id_sala': 999999,
            'patrimonio': 'P002',
            'status': 'Funcionando',
            'is_computador': True,
            'data_verificacao': "2025-10-28",
        }
        
        response = self.client.post(self.create_url, data_valida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST),
        self.assertIn('id_sala', response.data)

    def test_create_dispositivo_fail_invalid_field_1(self):
        """Testa a criação de um novo dispositivo com campo invalido (boleando em uma string), devendo falhar com erro 400."""
        
        data_valida = {
            'tipo': 'Notebook',
            'modelo': 'Dell XPS 15',
            'id_sala': self.lab1.pk,
            'patrimonio': 'P002',
            'status': True,
            'is_computador': True,
            'data_verificacao': "2025-10-28",
        }
        
        response = self.client.post(self.create_url, data_valida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST),
        self.assertIn('status', response.data)

    def test_create_dispositivo_fail_invalid_field_2(self):
        """Testa a criação de um novo dispositivo com campo invalido (string em um booleano, devendo falhar com erro 400."""
        
        data_valida = {
            'tipo': 'Notebook',
            'modelo': 'Dell XPS 15',
            'id_sala': self.lab1.pk,
            'patrimonio': 'P002',
            'status': 'Funcionando',
            'is_computador': 'Funcionando',
            'data_verificacao': "2025-10-28",
        }
        
        response = self.client.post(self.create_url, data_valida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST),
        self.assertIn('is_computador', response.data)

    def test_create_dispositivo_fail_invalid_field_3(self):
        """Testa a criação de um novo dispositivo com campo invalido (string longa demais), devendo falhar com erro 400."""
        
        data_valida = {
            'tipo': 'Notebook',
            'modelo': 'Dell XPS 15',
            'id_sala': self.lab1.pk,
            'patrimonio': 'P002',
            'status': 'ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp',
            'is_computador': True,
            'data_verificacao': "2025-10-28",
        }
        
        response = self.client.post(self.create_url, data_valida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST),
        self.assertIn('status', response.data)
    
    def test_create_dispositivo_fail_invalid_field_4(self):
        """Testa a criação de um novo dispositivo com campo invalido (formato de data errado), devendo falhar com erro 400."""
        
        data_valida = {
            'tipo': 'Notebook',
            'modelo': 'Dell XPS 15',
            'id_sala': self.lab1.pk,
            'patrimonio': 'P002',
            'status': 'Funcionando',
            'is_computador': True,
            'data_verificacao': "legal",
        }
        
        response = self.client.post(self.create_url, data_valida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST),
        self.assertIn('data_verificacao', response.data)


    def test_delete_dispositivo_success(self):
        """Testa deletar um um dispositivo por query_params e verifica o 204 No Content."""
        
        disp_a_deletar = Dispositivos.objects.create(
            tipo='Monitor', patrimonio='M500', id_sala=self.lab1, data_verificacao='2025-10-27'
        )

        url = f"{self.delete_url}?id_dispositivo={disp_a_deletar.id_dispositivo}"
        response = self.client.delete(url, **self.auth_headers)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            Dispositivos.objects.filter(id_dispositivo=disp_a_deletar.id_dispositivo).exists()
        )

    def test_delete_dispositivo_not_found_fails(self):
        """Testa deletar um dispostivo com um ID inexistente e verifica o 404 Not Found."""
        
        url = f"{self.delete_url}?id_dispositivo=99999"
        response = self.client.delete(url, **self.auth_headers)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_dispositivo_partial_success(self):
        """Testa a atualização parcial (PATCH) de um único campo."""
        
        novo_status = 'Com Defeito'
        dados_atualizados = {'status': novo_status}

        response = self.client.patch(self.update_url, dados_atualizados, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.disp_existente.refresh_from_db()
        self.assertEqual(self.disp_existente.status, novo_status)
        
        self.assertEqual(response.data['status'], novo_status)

    def test_update_dispositivo_invalid_data_fails(self):
        """Testa a atualização com dados inválidos (ex: tipo de dado errado)."""
        
        dados_invalidos = {'status': 12345} 
        
        response = self.client.patch(self.update_url, dados_invalidos, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('status', response.data)


class SoftwareViewTests(TestCase):
    
    def setUp(self):

        self.client = APIClient()
        self.user = User.objects.create_user(username='tester', password='testpassword')
        access_token = AccessToken.for_user(self.user)
        self.auth_headers = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
        
        self.lab1 = Laboratorio.objects.create(nome='LECC-A', sala_ou_bloco='Bloco C')
        self.disp_principal = Dispositivos.objects.create(
            tipo='Desktop', patrimonio='P101', id_sala=self.lab1, status='Funcionando', data_verificacao='2025-10-27'
        )
        self.disp_secundario = Dispositivos.objects.create(
            tipo='Notebook', patrimonio='P102', id_sala=self.lab1, status='Funcionando', data_verificacao='2025-10-27'
        )
        
        self.soft1 = Software.objects.create(nome='Windows 10', id_dispositivo=self.disp_principal)
        self.soft2 = Software.objects.create(nome='VS Code', id_dispositivo=self.disp_principal)
        self.soft_outrasala = Software.objects.create(nome='Office', id_dispositivo=self.disp_secundario)
        
        self.list_by_disp_url = reverse('soft-by-disp') 
        self.create_url = reverse('soft-create')
        self.delete_url_name = 'soft-delete' 


    def test_filter_software_by_dispositivo_success(self):
        """A listagem deve retornar apenas softwares do dispositivo especificado."""
        

        response = self.client.get(
            self.list_by_disp_url, 
            {'id_dispositivo': self.disp_principal.id_dispositivo}, 
            **self.auth_headers
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Software', response.data)

        self.assertEqual(len(response.data['Software']), 2) 
        self.assertEqual(response.data['Software'][0]['nome'], 'Windows 10')

    def test_filter_software_no_id_fails(self):
        """A listagem deve falhar com 400 Bad Request se o id_dispositivo não for fornecido."""
        
        response = self.client.get(self.list_by_disp_url, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'id do dispositivo não fornecido')


    def test_create_software_success(self):
        """Testa a criação de um novo software e verifica o 201 Created."""
        
        data_valida = {
            'nome': 'Google Chrome',
            "versao": "1.0",
            "link": "https://www.google.com/intl/pt-BR/chrome/",
            'id_dispositivo': self.disp_principal.pk, 

        }
        
        response = self.client.post(self.create_url, data_valida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Software.objects.filter(nome='Google Chrome').exists())
        self.assertEqual(response.data['nome'], 'Google Chrome')

    def test_create_software_invalid_data_fails(self):
        """Testa a criação com dados inválidos ( id_dispositivo inexistente)."""
        
        data_invalida = {
            'nome': 'Software Fantasma',
            "versao": "1.0",
            "link": "https://www.google.com/intl/pt-BR/chrome/",
            'id_dispositivo': 999999,
        }
        
        response = self.client.post(self.create_url, data_invalida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('id_dispositivo', response.data)


    def test_delete_software_success(self):
        """Testa deletar um software por ID de path parameter e verifica o 204 No Content."""
        
        url_deletar = reverse(self.delete_url_name, kwargs={'id_software': self.soft1.id_software})
        
        response = self.client.delete(url_deletar, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        self.assertFalse(
            Software.objects.filter(id_software=self.soft1.id_software).exists()
        )
        
        self.assertTrue(
            Software.objects.filter(id_dispositivo=self.disp_principal).exists()
        )

    def test_delete_software_not_found_fails(self):
        """Testa deletar um softare com um ID inexistente e verifica o 404 Not Found."""
        
        url_inexistente = reverse(self.delete_url_name, kwargs={'id_software': 999999})
        
        response = self.client.delete(url_inexistente, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('Software não encontrado', str(response.data))

    def test_create_software_invalid_url_fails(self):
        """Testa a criação com um campo 'link' que não é uma URL válida (espera 400)."""
        
        data_invalida = {
            'nome': 'Google Chrome',
            'versao': '120.0',
            'link': 'isso-nao-e-uma-url',
            'id_dispositivo': self.disp_principal.pk,
        }
        
        response = self.client.post(self.create_url, data_invalida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        self.assertIn('link', response.data)
        self.assertIn('válido', str(response.data['link'][0]).lower())

class LaboratorioViewTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='tester', password='testpassword')
        access_token = AccessToken.for_user(self.user)
        self.auth_headers = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
        
        self.lab_a = Laboratorio.objects.create(nome='LECC-A', sala_ou_bloco='Bloco 1')
        self.lab_b = Laboratorio.objects.create(nome='LECC-B', sala_ou_bloco='Bloco 2')
        
        self.list_url = reverse('lab-list')          
        self.create_url = reverse('lab-create')      
        self.by_id_url = reverse('lab-by-id')        
        self.delete_url_name = 'lab-delete'          
        self.update_url_name = 'lab-update'          

    def test_list_all_laboratorios_success(self):
        """A listagem deve retornar todos os laboratórios cadastrados."""
        
        response = self.client.get(self.list_url, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Laboratorio', response.data)
        self.assertEqual(len(response.data['Laboratorio']), 2) 
        self.assertEqual(response.data['Laboratorio'][0]['nome'], 'LECC-A')


    def test_create_laboratorio_success(self):
        """Testa a criação de um novo laboratório (201 Created)."""
        
        data_valida = {
            'nome': 'LECC-C',
            'sala_ou_bloco': 'Bloco X',
        }
        
        response = self.client.post(self.create_url, data_valida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Laboratorio.objects.filter(nome='LECC-C').exists())
        self.assertEqual(response.data['nome'], 'LECC-C')

    def test_create_laboratorio_invalid_data_fails(self):
        """Testa a criação com dados inválidos (400 Bad Request)."""
        
        data_invalida = {
            'sala_ou_bloco': 'Bloco Incompleto',
        }
        
        response = self.client.post(self.create_url, data_invalida, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nome', response.data) 

    def test_retrieve_laboratorio_by_id_success(self):
        """Busca um laboratório por id_sala (query parameter)."""
        
        response = self.client.get(
            self.by_id_url, 
            {'id_sala': self.lab_a.pk}, 
            **self.auth_headers
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('laboratorio', response.data)
        self.assertEqual(len(response.data['laboratorio']), 1)
        self.assertEqual(response.data['laboratorio'][0]['nome'], 'LECC-A')

    def test_retrieve_laboratorio_no_id_fails(self):
        """A busca deve falhar com 400 Bad Request se o id_sala não for fornecido."""
        
        response = self.client.get(self.by_id_url, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'ID não fornecido')

    def test_update_laboratorio_success(self):
        """Testa a atualização parcial de um campo (PATCH)."""
        
        url_update = reverse(self.update_url_name, kwargs={'pk': self.lab_b.pk})
        
        data_update = {
            'nome': 'LECC-B ATUALIZADA',
        }
        
        response = self.client.patch(url_update, data_update, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], 'LECC-B ATUALIZADA')
        
        self.lab_b.refresh_from_db()
        self.assertEqual(self.lab_b.nome, 'LECC-B ATUALIZADA')

    def test_update_laboratorio_not_found_fails(self):
        """Testa a atualização de um ID inexistente (404 Not Found)."""
        
        url_inexistente = reverse(self.update_url_name, kwargs={'pk': 999999})
        data_update = {'nome': 'Falha'}
        
        response = self.client.patch(url_inexistente, data_update, format='json', **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_laboratorio_success(self):
        """Testa a deleção de um laboratório por id_sala (query parameter) (204 No Content)."""
        
        url_com_query = f"{reverse('lab-delete')}?id_sala={self.lab_a.pk}"

        response = self.client.delete(url_com_query, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        self.assertFalse(
            Laboratorio.objects.filter(pk=self.lab_a.pk).exists()
        )

    def test_delete_laboratorio_not_found_fails(self):
        """Testa a deleção de um ID inexistente (404 Not Found)."""

        url_inexistente = f"{reverse('lab-delete')}?id_sala=99999999"
        
        response = self.client.delete(url_inexistente, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('Laboratorio não encontrado', str(response.data))

    def test_delete_laboratorio_no_id_fails(self):
        """A deleção deve falhar com 400 Bad Request se o id_sala não for fornecido."""
        
        url_sem_query = reverse('lab-delete')
    
        response = self.client.delete(url_sem_query, data={}, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'ID não fornecido')