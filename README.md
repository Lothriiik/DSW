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

### 2. Instale as dependências do backend

```bash
pip install -r requirements.txt
```

### 3. Inicie o backend

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

### 4. Inicie o frontend

```bash
cd frontend
npm install
npm start
```

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

