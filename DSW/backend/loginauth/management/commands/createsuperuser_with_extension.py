from django.contrib.auth.management.commands import createsuperuser
from django.core.management import CommandError
from django.contrib.auth import get_user_model


from loginauth.models import ExtensaoUsuario 


class Command(createsuperuser.Command):
    help = 'Cria um superusuário e garante que a ExtensaoUsuario seja criada com nivel="admin".'

    def handle(self, *args, **options):
        super().handle(*args, **options)
        
        User = get_user_model()
        
        try:
            user = User.objects.filter(is_superuser=True).order_by('-date_joined').first()
            if not user:
                 raise CommandError("Erro: Nenhum superusuário encontrado para processar.")
        except Exception:
             raise CommandError("Erro: O superusuário não foi encontrado após a criação.")

        extensao, created = ExtensaoUsuario.objects.get_or_create(user=user)
        
        ExtensaoUsuario.objects.filter(user=user).update(
            nivel_acesso='admin',
            precisa_trocar_senha=False
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f"Extensão de usuário criada e configurada com nivel='admin' para {user.username}."))
        else:
            self.stdout.write(
                self.style.SUCCESS(f"Extensão de usuário para {user.username} ATUALIZADA para nivel='admin'.")
            )
            extensao.refresh_from_db()


        if options['verbosity'] >= 1:
            self.stdout.write("Superusuário criado com sucesso e extensão configurada.")