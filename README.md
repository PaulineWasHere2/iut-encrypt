# Application de streaming "IPTV"

> Ce projet est une application de streaming IPTV, avec gestion des films et notifications par e-mail

## Fonctionnalités
  - Gestion des utilisateurs et de l'authentification  
  - Envoi de notifications par e-mail avec Nodemailer  
  - Export CSV via un message broker (RabbitMQ)  
  - API REST sécurisée avec Hapi.js  

## Installation & Configuration

### 1. Prérequis
- Node.js >= 16
- Docker & Docker Compose (pour RabbitMQ & DB)
- Un fichier `.env` configuré (voir `iut_project/server/.env-keep`)

### 2. Installation du projet
  - `git clone https://github.com/PaulineWasHere2/iut-encrypt.git`
  - `cd iut-encrypt`
  - `npm install`

### 3. Configuration de l'environnement
Vous devez copier le fichier .env-keep et renommez-le en .env, puis remplissez les variables nécessaires.

### 4. Démarrer l'application
  - `npm run dev`
Pour la database :
  - `docker run -d --name hapi-mysql -p 3307:3306 -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user mysql:8.0 --default-authentication-plugin=mysql_native_password`
  - Voici quelques commandes pour mettre à jour la database (**important!**) :
    - Exécuter les migrations :
        `npx knex migrate:latest`
    - Annuler la dernière migration :
        `npx knex migrate:rollback`
    - Refaire toutes les migrations (rollback + migrate:latest) :
        `npx knex migrate:refresh`

### 5. API Endpoints
  - Un API Swagger est disponible sur le lien : localhost:3306/documentation/
  - Authentification :
    - GET /users **Liste de tous les utilisateurs**
    - POST	/user/login	**Connexion d'un utilisateur avec token Jwt**
    - POST	/user	**Inscription d'un nouvel user**
    - PATCH /user/{id} **Modifier un utilisateur**
    - PATCH /user/{id}/promote **Change le rôle d'un utilisateur en admin**
    - DELETE /user/{id} **Supprimer un utilisateur**
  
  - Gestion des films :
    - GET	/movies	**Liste tous les films**
    - GET	/movies/{id}	**Détails d'un film spécifique**
    - GET /favorites **Voir la liste des films favoris**
    - POST /movies	**Ajouter un film**
    - POST /favorites/{movieId} **Ajouter un film aux favoris**
    - PUT /movies/{id} **Modifier un film**
    - DELETE /movies/{id} **Supprimer un film**
    - DELETE /favorites/{movieId} **Supprimer un film des favoris**

## Architecture
-  Backend : Hapi.js, Node.js, PostgreSQL
- Email : Nodemailer
- Message Broker : RabbitMQ

## Licence

Ce projet a été créé dans le cadre de la matière R6A.05 Développement avancé de la troisième année de BUT Informatique de Limoges, pour un TP noté de NodeJS.

Le rapport se trouve dans la racine du dépôt GitHub.

Fait par Pauline Aigueperse G8.


