# Projet application web - it

- David Darmanger
- 24.01.2023
- He-Arc

## Description

Site web permettant de gérer son alimentation facilement et rapidement en listant les aliments et leurs nutriments. De plus, il est possible d'avoir un historique de ses repas et de ses aliments, et plus encore. Pour plus d'informations voir le [cahier des charges](https://gitlab-etu.ing.he-arc.ch/groups/isc/2022-23/niveau-3/3298.4-developpement-web/it/-/wikis/Spécifications-détaillées) qui décrit le projet en détail.

## Installation

### Prérequis

#### Backend

- [Python 3](https://www.python.org/downloads/)
- [Pipenv](https://pipenv.pypa.io/en/latest/)

#### Frontend

- [Node.js](https://nodejs.org/en/)

### Lancer le backend

1. Cloner le projet backend

```sh
git clone git@gitlab-etu.ing.he-arc.ch:isc/2022-23/niveau-3/3298.4-developpement-web/it/backend.git
```

2. Activer l'environnement virtuel

```sh
cd backend
source .venv/bin/activate
pipenv shell
```

3. Lancer le serveur

```sh
cd mysite/
python manage.py runserver
```

### Lancer le frontend

1. Cloner le projet frontend

```sh
git clone git@gitlab-etu.ing.he-arc.ch:isc/2022-23/niveau-3/3298.4-developpement-web/it/frontend.git
```

2. Installer les dépendances

```sh
cd frontend/it/
npm install
```

3. Lancer le serveur (depuis le dossier frontend/it/)

```sh
npm run dev
```

4. Accéder au site web

```sh
http://127.0.0.1:5173/
```

## Documentation

- Documentation du projet : [Wiki](https://gitlab-etu.ing.he-arc.ch/groups/isc/2022-23/niveau-3/3298.4-developpement-web/it/-/wikis/home)
- Documentation Swagger : `http://127.0.0.1:8000/swagger/`

## Administration backend

- Accéder à l'interface d'administration : `http://127.0.0.1:8000/admin/`
