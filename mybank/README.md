# Mybank: – Application de Banque en Ligne
Mybank est une application web de gestion bancaire permettant aux clients et aux agents de guichet de gérer leurs comptes, virements et informations personnelles.
Le projet combine un backend Spring Boot et un frontend React.

Application de banque en ligne composée de :

## Backend : API REST Spring Boot (Java 17, Spring Security, JPA/Hibernate, MySQL, JWT)
## Frontend : React + Vite (React Router, Axios, TailwindCSS)

## 1. Structure du projet:

- /mybank : backend Spring Boot
- /mybank-front : frontend React

Chaque partie peut être lancée indépendamment (backend sur un port type 8080, frontend sur un port Vite type 3000).

## 2. Prérequis: 

- Java 17
- Maven 3+
- Node.js (version LTS recommandée) + npm
- Une base de données MySQL accessible

## 3. Backend : Spring Boot (/mybank)

- Se placer dans le dossier backend : cd mybank
- Configurer la connexion à la base de données MySQL dans src/main/resources/application.properties (URL, utilisateur, mot de passe, nom de la base, etc.).
- Vérifier/adapter la configuration de sécurité (JWT, secret key, durée de validité, etc.).

-  Lancement en mode développement : mvn spring-boot:run
-  Par défaut, l’API est disponible sur : http://localhost:8080

## 4. Frontend : React + Vite (/mybank-front)

- Se placer dans le dossier frontend : cd mybank-front
- Installer les dépendances :  npm install


-Lancement en mode développement: npm run dev
-Par défaut, l’application est accessible sur un port type : http://localhost:3000

Si nécessaire, adapter l’URL de l’API backend (baseURL) dans les services Axios (par exemple dans src/services/api.js).

## 5. Build & production
   ## Backend
   - cd mybank
   - mvn clean package

- Le jar généré dans target/ peut être exécuté avec : java -jar target/mybank-0.0.1-SNAPSHOT.jar

   ## Frontend
   - cd mybank-front
   - npm run build

Les fichiers statiques sont générés dans dist/ et peuvent être servis par un serveur web ou intégrés derrière un reverse proxy.

## 6. Fonctionnalités principales

- Authentification avec JWT (clients et agents de guichet)

- Gestion des rôles côté backend (Spring Security) et frontend (ProtectedRoute)

 Portail client :

- Dashboard (comptes, soldes)
- Virements
- Changement de mot de passe

 Portail admin / agent :

- Gestion des clients
- Gestion des comptes

## 7. Contributions

Les contributions sont les bienvenues :
- Fork du dépôt
- Création d’une branche de fonctionnalité
- Pull Request avec une description claire des changements
