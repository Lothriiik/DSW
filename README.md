# 📝 Projeto DSW

## 🚀 Tecnologias Utilizadas

* **Front-end:** React
* **Back-end:** Django REST Framework
* **Banco de Dados:** SQLite / MySQL (dependendo do ambiente)

---

## 🔧 Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/Lothriiik/DSW.git
cd DSW
```

### 2. Configure o Backend

#### 2.1. Crie um ambiente virtual (venv)

```bash
cd DSW/backend
python -m venv venv
```

#### 2.2. Ative o ambiente virtual

**Windows:**
```bash
.\venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

#### 2.3. Instale as dependências

```bash
pip install -r ../requirements.txt
```

> **Nota:** Se houver erro ao instalar `mysqlclient` no Windows, não se preocupe. O projeto funcionará com SQLite.

#### 2.4. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `DSW/backend/` com o seguinte conteúdo:

```env
SECRET_KEY=django-insecure-development-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_ENGINE=django.db.backends.sqlite3
DATABASE_NAME=db.sqlite3
ACCESS_TOKEN_MINUTES=60
REFRESH_TOKEN_DAYS=7
```

> **⚠️ Importante:** Em produção, altere a `SECRET_KEY` para uma chave segura e defina `DEBUG=False`.

#### 2.5. Execute as migrações

```bash
python manage.py migrate
```

#### 2.6. Crie um superusuário (opcional)

Para criar um usuário administrador com suporte à extensão personalizada:

```bash
python manage.py createsuperuser_with_extension
```

#### 2.7. Inicie o servidor backend

```bash
python manage.py runserver
```

O backend estará disponível em: **http://127.0.0.1:8000/**

---

### 3. Configure o Frontend

Em um **novo terminal**, execute:

```bash
cd DSW/frontend
npm install
npm start
```

O frontend estará disponível em: **http://localhost:3000/**

---

## 📡 API Documentation

A documentação (precisa de alguns ajustes de carater informativo) da API está disponível em:

* [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)


## 🧪 Testes unitarios

### Backend

Para rodar todos os testes de uma vez:

```bash
python manage.py test
```

Ou individualmente:

```bash
python manage.py test problemas.tests
python manage.py test laboratorios.tests
python manage.py test loginauth.tests
```


## 📄 Licença

Este projeto está sob a licença MIT.

---

