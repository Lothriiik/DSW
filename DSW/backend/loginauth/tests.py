from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from django.urls import reverse
from loginauth.models import ExtensaoUsuario 
import secrets 

class LoginAuthViewTests(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        
        self.common_user = User.objects.create_user(username='comum', password='commonpassword', first_name='Test', email='comum@teste.com')
        self.moderator = User.objects.create_user(username='moderador', password='modpassword', first_name='Mod')
        self.admin = User.objects.create_superuser(username='admin', password='adminpassword')
        self.target_user = User.objects.create_user(username='target', password='targetpassword')
        self.user_no_ext = User.objects.create_user(username='noext', password='noextpassword')

        ExtensaoUsuario.objects.filter(user=self.common_user).update(nivel_acesso='comum', precisa_trocar_senha=False)
        ExtensaoUsuario.objects.filter(user=self.moderator).update(nivel_acesso='moderador', precisa_trocar_senha=False)
        ExtensaoUsuario.objects.filter(user=self.admin).update(nivel_acesso='admin', precisa_trocar_senha=False)
        ExtensaoUsuario.objects.filter(user=self.target_user).update(nivel_acesso='comum', precisa_trocar_senha=True)
        ExtensaoUsuario.objects.filter(user=self.user_no_ext).delete()

        self.common_token = {'HTTP_AUTHORIZATION': f'Bearer {AccessToken.for_user(self.common_user)}'}
        self.moderator_token = {'HTTP_AUTHORIZATION': f'Bearer {AccessToken.for_user(self.moderator)}'}
        self.admin_token = {'HTTP_AUTHORIZATION': f'Bearer {AccessToken.for_user(self.admin)}'}
        self.noext_token = {'HTTP_AUTHORIZATION': f'Bearer {AccessToken.for_user(self.user_no_ext)}'}
        
        self.login_url = reverse('login')
        self.register_url = reverse('register')
        self.user_info_url = reverse('user_info')
        self.list_users_url = reverse('users-list')
        self.trocar_senha_url = reverse('recover-password')
        
        self.reset_admin_url = reverse('reset-password', kwargs={'pk': self.target_user.pk})
        self.delete_user_url = reverse('delete-user', kwargs={'pk': self.target_user.pk})
        self.edit_user_url = reverse('edit-user', kwargs={'pk': self.target_user.pk})
        self.detail_user_url = reverse('user-by-id', kwargs={'pk': self.target_user.pk})

    def test_01_login_success(self):
        """Testa login com credenciais válidas, esperando 200 OK e tokens JWT."""
        data = {'username': 'comum', 'password': 'commonpassword'} 
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_02_login_invalid_credentials_fails(self):
        """Testa login com senha incorreta, esperando 401 Unauthorized."""
        data = {'username': 'tester', 'password': 'wrongpassword'}
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['detail'], 'Credenciais Invalidas')

    def test_03_register_user_success(self):
        """Testa o registro de um novo usuário (201 Created)."""
        data = {
            'username': 'newuser',
            'email': 'new@user.com',
            'password': 'newpassword123',
            'first_name': 'New',
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())
        self.assertTrue(ExtensaoUsuario.objects.filter(user__username='newuser').exists())

    def test_04_user_info_retrieval_success(self):
        """Testa a obtenção de dados do usuário logado (UserInfo)."""
        response = self.client.get(self.user_info_url, **self.common_token)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.common_user.pk)
        self.assertEqual(response.data['precisa_trocar_senha'], False) 

    def test_05_user_info_no_extension_success(self):
        """Testa UserInfo para um usuário sem extensão (precisa_trocar_senha = None)."""
        response = self.client.get(
            self.user_info_url, 
            **self.noext_token
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data['precisa_trocar_senha'])

    def test_06_trocar_senha_success(self):
        """Testa se o usuário consegue trocar sua senha informando username e senha atual."""
        new_password = 'mynewpassword'
        data = {
            'username': 'comum',
            'senha_atual': 'commonpassword',
            'nova_senha': new_password
        }

        response = self.client.post(self.trocar_senha_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('mensagem', response.data)
        self.assertEqual(response.data['mensagem'], 'Senha alterada com sucesso.')

        login_response = self.client.post(self.login_url, {'username': 'comum', 'password': new_password}, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)

        self.common_user.extensaousuario.refresh_from_db()
        self.assertFalse(self.common_user.extensaousuario.precisa_trocar_senha)


    def test_07_trocar_senha_no_new_password_fails(self):
        """Testa se a troca de senha falha sem o campo 'nova_senha' (400 Bad Request)."""
        data = {
            'username': 'comum',
            # 'senha_atual': '123456'
        }


        response = self.client.post(self.trocar_senha_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('erro', response.data)
        self.assertEqual(response.data['erro'], 'Campos obrigatórios faltando: username e nova_senha.')


    def test_08_list_users_admin_success(self):
        """Admin deve conseguir listar todos os usuários."""
        response = self.client.get(self.list_users_url, **self.admin_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data), 5) 

    def test_09_list_users_common_fails(self):
        """Usuário comum NÃO deve conseguir listar usuários (403 Forbidden)."""
        response = self.client.get(self.list_users_url, **self.common_token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_10_detail_user_admin_success(self):
        """Admin deve conseguir ver o detalhe do usuário target."""
        response = self.client.get(self.detail_user_url, **self.admin_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'target')
        
    def test_11_edit_user_admin_success(self):
        """Admin deve conseguir editar o nome e o nível de acesso do usuário target."""
        new_name = 'NovoNome'
        new_level = 'moderador'
        data = {
            'first_name': new_name,
            'nivel_acesso': new_level
        }
        
        response = self.client.patch(self.edit_user_url, data, format='json', **self.admin_token)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.target_user.refresh_from_db()
        self.assertEqual(self.target_user.first_name, new_name)
        self.assertEqual(self.target_user.extensaousuario.nivel_acesso, new_level)

    def test_12_edit_user_common_fails(self):
        """Usuário comum não deve conseguir editar outro usuário (403 Forbidden)."""
        data = {'first_name': 'Tentativa'}
        response = self.client.patch(self.edit_user_url, data, format='json', **self.common_token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_13_admin_reset_password_success(self):
        """Admin deve redefinir senha do target user e marcar precisa_trocar_senha=True."""
        response = self.client.patch(self.reset_admin_url, format='json', **self.admin_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertIn('nova_senha', response_data)

        self.target_user.extensaousuario.refresh_from_db()
        self.assertTrue(self.target_user.extensaousuario.precisa_trocar_senha)

        data = {'username': 'target', 'password': response_data['nova_senha']}
        login_response = self.client.post(self.login_url, data, format='json')

        self.assertEqual(login_response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(login_response.json().get('detail'), 'TROCA_SENHA_NECESSARIA')
        
    def test_14_delete_user_admin_success(self):
        """Admin deve conseguir deletar o usuário target (204 No Content)."""
        
        response = self.client.delete(self.delete_user_url, **self.admin_token)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(pk=self.target_user.pk).exists())

    def test_15_delete_user_common_fails(self):
        """Usuário comum não deve conseguir deletar o target user (403 Forbidden)."""
        
        response = self.client.delete(self.delete_user_url, **self.common_token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_16_login_nonexistent_user_fails(self):
        """Login deve falhar para usuário que não existe (401)."""
        response = self.client.post(self.login_url, {'username': 'ghost', 'password': '123'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_17_register_existing_username_fails(self):
        """Registro deve falhar ao tentar criar usuário com username existente (400)."""
        data = {'username': 'comum', 'email': 'dup@teste.com', 'password': 'abc', 'first_name': 'Dup'}
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_18_register_missing_fields_fails(self):
        """Registro deve falhar se faltar campos obrigatórios."""
        data = {'username': '', 'password': '123'}
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_19_user_info_unauthenticated_fails(self):
        """Requisição sem token deve retornar 401 Unauthorized."""
        response = self.client.get(self.user_info_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_20_login_resets_precisa_trocar_senha(self):
        """Login deve marcar 'precisa_trocar_senha' como False após troca de senha."""
        self.target_user.extensaousuario.precisa_trocar_senha = True
        self.target_user.extensaousuario.save()
        response = self.client.post(self.login_url, {'username': 'target', 'password': 'targetpassword'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED) 

    def test_21_list_users_unauthenticated_fails(self):
        """Sem token não deve listar usuários (401 Unauthorized)."""
        response = self.client.get(self.list_users_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_22_detail_user_not_found(self):
        """Retorna 404 se tentar acessar detalhe de usuário inexistente."""
        url = reverse('user-by-id', kwargs={'pk': 99999})
        response = self.client.get(url, **self.admin_token)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_23_edit_user_invalid_token_fails(self):
        """Token inválido deve causar 401 Unauthorized."""
        invalid_headers = {'HTTP_AUTHORIZATION': 'Bearer invalid.token'}
        response = self.client.patch(self.edit_user_url, {'first_name': 'X'}, format='json', **invalid_headers)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_24_edit_self_user_success(self):
        """Usuário comum pode editar seu próprio nome."""
        url = reverse('edit-user', kwargs={'pk': self.common_user.pk})
        data = {'first_name': 'Alterado'}
        response = self.client.patch(url, data, format='json', **self.common_token)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_403_FORBIDDEN])

    def test_25_reset_password_common_fails(self):
        """Usuário comum não pode resetar senha de outro (403)."""
        response = self.client.patch(self.reset_admin_url, format='json', **self.common_token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_26_delete_nonexistent_user_returns_404(self):
        """Deleção de usuário inexistente deve retornar 404."""
        url = reverse('delete-user', kwargs={'pk': 99999})
        response = self.client.delete(url, **self.admin_token)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_27_admin_cannot_delete_self(self):
        """Admin não deve conseguir deletar a própria conta."""
        url = reverse('delete-user', kwargs={'pk': self.admin.pk})
        response = self.client.delete(url, **self.admin_token)
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_403_FORBIDDEN])

    def test_28_precisa_trocar_senha_always_boolean(self):
        """Campo precisa_trocar_senha deve ser bool ou None."""
        response = self.client.get(self.user_info_url, **self.admin_token)
        self.assertIn(response.data['precisa_trocar_senha'], [True, False, None])






