# DOCUMENTATION COMPLÈTE DU PROJET MOROVISTA
## Projet de Fin d'Études (PFE) - Plateforme Touristique Marocaine

---

## TABLE DES MATIÈRES

1. [Introduction Générale](#1-introduction-générale)
2. [Description du Projet](#2-description-du-projet)
3. [Architecture du Système](#3-architecture-du-système)
4. [Technologies Utilisées](#4-technologies-utilisées)
5. [Structure du Projet](#5-structure-du-projet)
6. [Base de Données](#6-base-de-données)
7. [API REST](#7-api-rest)
8. [Interface Utilisateur](#8-interface-utilisateur)
9. [Fonctionnalités](#9-fonctionnalités)
10. [Acteurs du Système](#10-acteurs-du-système)
11. [Prompts pour Diagrammes UML](#11-prompts-pour-diagrammes-uml)
12. [Déploiement](#12-déploiement)
13. [Conclusion](#13-conclusion)

---

## 1. INTRODUCTION GÉNÉRALE

### 1.1 Contexte du Projet

MoroVista est une plateforme touristique marocaine de luxe qui permet aux voyageurs du monde entier de découvrir, explorer et réserver des services touristiques au Maroc. La plateforme vise à moderniser l'expérience touristique marocaine en offrant une interface intuitive et des services de qualité.

### 1.2 Objectifs du Projet

- Faciliter la découverte des destinations touristiques marocaines
- Permettre la réservation en ligne d'hôtels et restaurants
- Offrir des plans de voyage personnalisés
- Fournir un assistant IA pour guider les voyageurs
- Connecter les prestataires locaux avec les touristes
- Promouvoir le tourisme marocain à l'international

### 1.3 Public Cible

- **Voyageurs Internationaux**: Touristes étrangers visitant le Maroc
- **Voyageurs Nationaux**: Marocains explorant leur pays
- **Prestataires de Services**: Hôtels, restaurants, guides touristiques
- **Administrateurs**: Gestionnaires de la plateforme

---

## 2. DESCRIPTION DU PROJET

### 2.1 Vue d'Ensemble

MoroVista est une application web full-stack composée de deux parties principales :

1. **Backend (API Laravel)**: Gère la logique métier, l'authentification, la base de données et les API REST
2. **Frontend (React Vite)**: Interface utilisateur interactive avec animations et navigation fluide

### 2.2 Fonctionnalités Principales

- **Authentification**: Inscription, connexion, déconnexion avec gestion des rôles
- **Exploration**: Consultation des hôtels, restaurants, stades, lieux touristiques
- **Réservation**: Réservation d'hôtels et tables de restaurant
- **Plans de Voyage**: Création et consultation de tours guidés
- **Commentaires**: Système d'avis et évaluations
- **Favoris**: Sauvegarde des services préférés
- **Chatbot IA**: Assistant intelligent pour aider les utilisateurs
- **Administration**: Panel de gestion pour les administrateurs
- **Services Locaux**: Plateforme pour les prestataires locaux
- **Multilingue**: Support Français, Anglais, Arabe

### 2.3 Flux Utilisateur Typique

1. L'utilisateur accède à la page d'accueil
2. Il explore les services disponibles (hôtels, restaurants, etc.)
3. Il filtre par ville ou recherche par nom
4. Il consulte les détails d'un service
5. Il ajoute aux favoris ou réserve
6. Il peut laisser un commentaire après utilisation
7. Il peut interagir avec le chatbot pour des conseils

---

## 3. ARCHITECTURE DU SYSTÈME

### 3.1 Architecture Client-Serveur

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                     │
│              React + Vite + GSAP + Swiper               │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     │ Axios
┌────────────────────▼────────────────────────────────────┐
│                   SERVEUR (Backend)                      │
│              Laravel 11 + PHP 8.2                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Controllers (ApiController, AuthController)     │  │
│  │  Models (User, Hotel, Restaurant, etc.)          │  │
│  │  Middleware (Auth, Sanctum)                      │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              BASE DE DONNÉES                            │
│         SQLite (Dev) / MySQL (Production)               │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Architecture des Composants Frontend

```
App.jsx
├── NavBar.jsx (Navigation)
├── Home.jsx (Page d'accueil)
├── Login.jsx (Authentification)
├── Services/
│   ├── Hotels.jsx (Hôtels)
│   ├── Restaurant.jsx (Restaurants)
│   ├── PlansG.jsx (Plans de voyage)
│   ├── Stadium.jsx (Stades)
│   ├── places.jsx (Lieux touristiques)
│   ├── Transport.jsx (Transports)
│   └── ...
├── Dashboard/
│   └── AdminDashboard.jsx (Panel admin)
├── Chatbot.jsx (Assistant IA)
└── footer.jsx (Pied de page)
```

### 3.3 Architecture des Controllers Backend

```
Controllers/
├── AuthController.php
│   ├── register() - Inscription
│   ├── login() - Connexion
│   └── logout() - Déconnexion
└── ApiController.php
    ├── getVilles() - Liste des villes
    ├── getHotels() - Liste des hôtels
    ├── getRestaurants() - Liste des restaurants
    ├── getStades() - Liste des stades
    ├── getLieuPlaces() - Liste des lieux
    ├── getPlanTours() - Liste des tours
    ├── getServiceLocals() - Services locaux
    ├── getTransports() - Transports
    ├── getUrgencePhonens() - Urgences
    ├── getCommentaires() - Commentaires
    ├── storeComment() - Ajouter commentaire
    ├── sendReservation() - Envoyer réservation
    └── getChatContext() - Contexte chatbot
```

---

## 4. TECHNOLOGIES UTILISÉES

### 4.1 Backend (Laravel)

| Technologie | Version | Description |
|-------------|---------|-------------|
| PHP | 8.2+ | Langage de programmation |
| Laravel | 12.0 | Framework PHP |
| Laravel Sanctum | 4.0 | Authentification API |
| SQLite | - | Base de données (développement) |
| MySQL | - | Base de données (production) |
| Composer | - | Gestionnaire de dépendances PHP |

### 4.2 Frontend (React)

| Technologie | Version | Description |
|-------------|---------|-------------|
| React | 19.2.0 | Bibliothèque JavaScript |
| Vite | 7.3.1 | Build tool et dev server |
| React Router | 7.13.1 | Routing client-side |
| Axios | 1.16.0 | Client HTTP |
| GSAP | 3.14.2 | Animations |
| Swiper | 12.1.2 | Carousel slider |
| react-i18next | 16.5.4 | Internationalisation |
| react-icons | 5.5.0 | Icônes |
| react-markdown | 10.1.0 | Rendu Markdown |
| Firebase | 12.11.0 | Services cloud (optionnel) |
| @studio-freight/lenis | 1.0.42 | Smooth scroll |

### 4.3 IA et Services Externes

| Service | Description |
|---------|-------------|
| Groq API | API pour le chatbot IA (Llama 3.3-70b) |
| Google Maps API | Cartes et localisation |
| Email Service | Laravel Mail pour les réservations |

### 4.4 Outils de Développement

| Outil | Description |
|-------|-------------|
| ESLint | Linting JavaScript |
| Git | Version control |
| Node.js | Runtime JavaScript |
| npm | Gestionnaire de paquets |

---

## 5. STRUCTURE DU PROJET

### 5.1 Structure Backend (morovista/)

```
morovista/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── ApiController.php
│   │   │   ├── AuthController.php
│   │   │   └── Controller.php
│   │   └── Middleware/
│   ├── Models/
│   │   ├── User.php
│   │   ├── Ville.php
│   │   ├── Hotel.php
│   │   ├── Restaurant.php
│   │   ├── Stade.php
│   │   ├── LieuPlace.php
│   │   ├── PlanTour.php
│   │   ├── ServiceLocal.php
│   │   ├── Transport.php
│   │   ├── UrgencePhonen.php
│   │   └── Commentaire.php
│   └── Providers/
├── config/
├── database/
│   ├── migrations/
│   │   ├── create_users_table.php
│   │   ├── create_villes_table.php
│   │   ├── create_hotels_table.php
│   │   ├── create_restaurants_table.php
│   │   ├── create_stades_table.php
│   │   ├── create_lieu_places_table.php
│   │   ├── create_plan_tours_table.php
│   │   ├── create_service_locals_table.php
│   │   ├── create_transports_table.php
│   │   ├── create_urgence_phonens_table.php
│   │   └── create_commentaires_table.php
│   ├── seeders/
│   └── database.sqlite
├── public/
├── resources/
├── routes/
│   ├── api.php
│   └── web.php
├── storage/
├── tests/
├── .env
├── composer.json
├── artisan
└── vite.config.js
```

### 5.2 Structure Frontend (Pfe-Vite/)

```
Pfe-Vite/
├── src/
│   ├── composents/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NavBar.jsx
│   │   ├── footer.jsx
│   │   ├── Chatbot.jsx
│   │   ├── Contact.jsx
│   │   ├── Testimonials.jsx
│   │   ├── Dashboard/
│   │   │   └── AdminDashboard.jsx
│   │   ├── Services/
│   │   │   ├── Hotels.jsx
│   │   │   ├── Restaurant.jsx
│   │   │   ├── PlansG.jsx
│   │   │   ├── Stadium.jsx
│   │   │   ├── places.jsx
│   │   │   ├── Transport.jsx
│   │   │   ├── LocalServices.jsx
│   │   │   ├── ReservationModal.jsx
│   │   │   ├── AboutUs.jsx
│   │   │   ├── Activities.jsx
│   │   │   ├── Weather.jsx
│   │   │   ├── exchange.jsx
│   │   │   ├── phoneN.jsx
│   │   │   ├── Esim.jsx
│   │   │   ├── Visa.jsx
│   │   │   ├── SiteComments.jsx
│   │   │   ├── PlanDetails.jsx
│   │   │   └── services.jsx
│   │   └── map/
│   ├── context/
│   ├── css/
│   │   ├── App.css
│   │   ├── chatbot.css
│   │   ├── reservation.css
│   │   └── ...
│   ├── locales/
│   │   ├── en.json
│   │   ├── fr.json
│   │   └── ar.json
│   ├── api.js
│   ├── firebase.js
│   ├── i18n.js
│   └── main.jsx
├── public/
│   ├── logo-pfe1.webp
│   └── ...
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## 6. BASE DE DONNÉES

### 6.1 Schéma de la Base de Données

#### Table: users
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firebase_uid VARCHAR(255),
    role VARCHAR(50) DEFAULT 'visitor',
    telephone VARCHAR(20),
    created_at DATETIME,
    updated_at DATETIME
);
```

#### Table: villes
```sql
CREATE TABLE villes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(255) NOT NULL,
    image_url TEXT,
    created_at DATETIME,
    updated_at DATETIME
);
```

#### Table: hotels
```sql
CREATE TABLE hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(255) NOT NULL,
    photo_url TEXT,
    adresse TEXT,
    contact VARCHAR(50),
    email VARCHAR(255),
    prix_chambre DECIMAL(10,2),
    categorie VARCHAR(100),
    likes INTEGER DEFAULT 0,
    ville_id INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (ville_id) REFERENCES villes(id)
);
```

#### Table: restaurants
```sql
CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(255) NOT NULL,
    photo_url TEXT,
    adresse TEXT,
    contact VARCHAR(50),
    email VARCHAR(255),
    prix_moyen DECIMAL(10,2),
    categorie VARCHAR(100),
    likes INTEGER DEFAULT 0,
    ville_id INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (ville_id) REFERENCES villes(id)
);
```

#### Table: stades
```sql
CREATE TABLE stades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(255) NOT NULL,
    image_url TEXT,
    adresse TEXT,
    contact VARCHAR(50),
    capacite INTEGER,
    likes INTEGER DEFAULT 0,
    ville_id INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (ville_id) REFERENCES villes(id)
);
```

#### Table: lieu_places
```sql
CREATE TABLE lieu_places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(255) NOT NULL,
    image_url TEXT,
    description TEXT,
    likes INTEGER DEFAULT 0,
    ville_id INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (ville_id) REFERENCES villes(id)
);
```

#### Table: plan_tours
```sql
CREATE TABLE plan_tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre VARCHAR(255) NOT NULL,
    image_url TEXT,
    prix DECIMAL(10,2),
    duree VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    addedBy VARCHAR(255),
    ville_id INTEGER,
    user_id INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (ville_id) REFERENCES villes(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Table: service_locals
```sql
CREATE TABLE service_locals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    ville_id INTEGER,
    adresse TEXT,
    telephone VARCHAR(50),
    proprietaire VARCHAR(255),
    details TEXT,
    image_url TEXT,
    addedBy VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (ville_id) REFERENCES villes(id)
);
```

#### Table: transports
```sql
CREATE TABLE transports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type VARCHAR(100),
    lien TEXT,
    created_at DATETIME,
    updated_at DATETIME
);
```

#### Table: urgence_phonens
```sql
CREATE TABLE urgence_phonens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    num VARCHAR(50),
    created_at DATETIME,
    updated_at DATETIME
);
```

#### Table: commentaires
```sql
CREATE TABLE commentaires (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auteur_nom VARCHAR(255),
    pays VARCHAR(100),
    contenu TEXT,
    note INTEGER,
    date_pub DATETIME,
    likes INTEGER DEFAULT 0,
    user_id INTEGER,
    service_type VARCHAR(50),
    service_id INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 6.2 Relations entre Tables

- **villes** (1,N) ↔ **hotels** (N,1)
- **villes** (1,N) ↔ **restaurants** (N,1)
- **villes** (1,N) ↔ **stades** (N,1)
- **villes** (1,N) ↔ **lieu_places** (N,1)
- **villes** (1,N) ↔ **plan_tours** (N,1)
- **villes** (1,N) ↔ **service_locals** (N,1)
- **users** (1,N) ↔ **plan_tours** (N,1)
- **users** (1,N) ↔ **commentaires** (N,1)
- **hotels** (1,N) ↔ **commentaires** (N,1)
- **restaurants** (1,N) ↔ **commentaires** (N,1)

---

## 7. API REST

### 7.1 Endpoints d'Authentification

#### POST /api/register
**Description**: Inscription d'un nouvel utilisateur
**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Response**:
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "visitor"
  },
  "access_token": "token_string",
  "token_type": "Bearer"
}
```

#### POST /api/login
**Description**: Connexion d'un utilisateur
**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Response**:
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "visitor"
  },
  "access_token": "token_string",
  "token_type": "Bearer"
}
```

#### POST /api/logout
**Description**: Déconnexion (nécessite authentification)
**Headers**: `Authorization: Bearer {token}`
**Response**:
```json
{
  "message": "Logged out successfully"
}
```

### 7.2 Endpoints des Services (Public)

#### GET /api/villes
**Description**: Liste de toutes les villes
**Query Params**: `?ville={nom}` (filtre par ville)
**Response**:
```json
[
  {
    "id": 1,
    "nom": "Casablanca",
    "image_url": "url"
  }
]
```

#### GET /api/hotels
**Description**: Liste des hôtels
**Query Params**: `?ville={nom}` (filtre par ville)
**Response**:
```json
[
  {
    "id": 1,
    "nom": "Hotel Royal",
    "photo_url": "url",
    "adresse": "address",
    "contact": "phone",
    "email": "email",
    "prix_chambre": 1500,
    "categorie": "5 étoiles",
    "likes": 45,
    "ville_id": 1,
    "ville_name": "Casablanca"
  }
]
```

#### GET /api/restaurants
**Description**: Liste des restaurants
**Query Params**: `?ville={nom}` (filtre par ville)
**Response**:
```json
[
  {
    "id": 1,
    "nom": "Restaurant La Perle",
    "photo_url": "url",
    "adresse": "address",
    "contact": "phone",
    "email": "email",
    "prix_moyen": 450,
    "categorie": "Gastronomique",
    "likes": 32,
    "ville_id": 1,
    "ville_name": "Casablanca"
  }
]
```

#### GET /api/stades
**Description**: Liste des stades
**Query Params**: `?ville={nom}` (filtre par ville)
**Response**:
```json
[
  {
    "id": 1,
    "nom": "Stade Mohammed V",
    "image_url": "url",
    "adresse": "address",
    "contact": "phone",
    "capacite": 80000,
    "likes": 120,
    "ville_id": 1
  }
]
```

#### GET /api/lieu-places
**Description**: Liste des lieux touristiques
**Query Params**: `?ville={nom}` (filtre par ville)
**Response**:
```json
[
  {
    "id": 1,
    "nom": "Hassan II Mosque",
    "image_url": "url",
    "description": "description",
    "likes": 250,
    "ville_id": 1
  }
]
```

#### GET /api/plan-tours
**Description**: Liste des plans de voyage
**Query Params**: `?ville={nom}` (filtre par ville)
**Response**:
```json
[
  {
    "id": 1,
    "titre": "Tour de Casablanca",
    "image_url": "url",
    "prix": 500,
    "duree": "2 Days",
    "status": "active",
    "addedBy": "Guide Ahmed",
    "ville_id": 1,
    "user_id": 5
  }
]
```

#### GET /api/plan-tours/{id}
**Description**: Détails d'un plan de voyage
**Response**:
```json
{
  "id": 1,
  "titre": "Tour de Casablanca",
  "image_url": "url",
  "prix": 500,
  "duree": "2 Days",
  "status": "active",
  "addedBy": "Guide Ahmed",
  "ville_id": 1,
  "user_id": 5,
  "ville": {
    "nom": "Casablanca"
  }
}
```

#### GET /api/service-locals
**Description**: Liste des services locaux
**Query Params**: `?ville={nom}` (filtre par ville)
**Response**:
```json
[
  {
    "id": 1,
    "nom": "Service Transport",
    "type": "Transport",
    "ville_id": 1,
    "adresse": "address",
    "telephone": "phone",
    "proprietaire": "owner",
    "details": "details",
    "image_url": "url",
    "addedBy": "provider",
    "status": "accepted"
  }
]
```

#### GET /api/transports
**Description**: Liste des transports
**Response**:
```json
[
  {
    "id": 1,
    "type": "Bus",
    "lien": "url"
  }
]
```

#### GET /api/urgence-phonens
**Description**: Liste des numéros d'urgence
**Response**:
```json
[
  {
    "id": 1,
    "num": "112"
  }
]
```

#### GET /api/commentaires
**Description**: Liste des commentaires
**Query Params**: `?service_type={type}&service_id={id}`
**Response**:
```json
[
  {
    "id": 1,
    "auteur_nom": "John",
    "pays": "France",
    "contenu": "Excellent service!",
    "note": 5,
    "date_pub": "2024-01-15",
    "likes": 10,
    "user_id": 1,
    "service_type": "hotel",
    "service_id": 1
  }
]
```

#### POST /api/commentaires
**Description**: Ajouter un commentaire
**Request Body**:
```json
{
  "auteur_nom": "string",
  "pays": "string",
  "contenu": "string",
  "note": 5,
  "service_type": "hotel",
  "service_id": 1
}
```
**Response**: Commentaire créé

#### POST /api/reservation
**Description**: Envoyer une réservation
**Request Body**:
```json
{
  "hotel_id": 1,
  "service_type": "hotel",
  "client_nom": "string",
  "client_email": "string",
  "client_tel": "string",
  "date_arrivee": "2024-01-20",
  "date_depart": "2024-01-25",
  "nb_personnes": 2,
  "message": "string"
}
```
**Response**:
```json
{
  "message": "Reservation sent successfully"
}
```

#### GET /api/chat-context
**Description**: Contexte pour le chatbot IA
**Response**:
```json
{
  "villes": ["Casablanca", "Rabat", "Marrakech"],
  "hotels": ["Hotel Royal", "Hotel Atlas"],
  "restaurants": ["Restaurant La Perle"],
  "tours": ["Tour de Casablanca"]
}
```

### 7.3 Endpoints Admin (Nécessitent Authentification)

#### POST /api/hotels
**Description**: Créer un hôtel (admin)
**Headers**: `Authorization: Bearer {token}`
**Request Body**: Données de l'hôtel

#### DELETE /api/hotels/{id}
**Description**: Supprimer un hôtel (admin)
**Headers**: `Authorization: Bearer {token}`

#### POST /api/restaurants
**Description**: Créer un restaurant (admin)
**Headers**: `Authorization: Bearer {token}`
**Request Body**: Données du restaurant

#### DELETE /api/restaurants/{id}
**Description**: Supprimer un restaurant (admin)
**Headers**: `Authorization: Bearer {token}`

#### GET /api/user
**Description**: Informations de l'utilisateur connecté
**Headers**: `Authorization: Bearer {token}`
**Response**: Données de l'utilisateur

---

## 8. INTERFACE UTILISATEUR

### 8.1 Page d'Accueil (Home.jsx)

**Sections**:
- Hero section avec animation GSAP
- Navigation vers les services
- Features principales
- Témoignages
- Footer

**Fonctionnalités**:
- Animations au scroll
- Navigation fluide
- Appels à l'action
- Liens vers les différentes sections

### 8.2 Page de Connexion (Login.jsx)

**Fonctionnalités**:
- Formulaire d'inscription
- Formulaire de connexion
- Sélection du type d'utilisateur (visiteur, prestataire, guide)
- Validation des formulaires
- Redirection selon le rôle

### 8.3 Page des Hôtels (Hotels.jsx)

**Fonctionnalités**:
- Liste des hôtels par ville
- Filtre par ville
- Recherche par nom
- Affichage des favoris
- Modal de détails
- Système de likes
- Ajout de commentaires
- Réservation

### 8.4 Page des Restaurants (Restaurant.jsx)

**Fonctionnalités**:
- Liste des restaurants par ville
- Filtre par ville
- Recherche par nom
- Affichage des favoris
- Modal de détails
- Système de likes
- Ajout de commentaires
- Réservation de table

### 8.5 Page des Plans de Voyage (PlansG.jsx)

**Fonctionnalités**:
- Carousel Swiper des tours
- Filtre par destination
- Filtre par prix maximum
- Filtre par durée
- Statistiques
- Navigation vers les détails

### 8.6 Panel d'Administration (AdminDashboard.jsx)

**Sections**:
- Aperçu (statistiques globales)
- Hôtels (CRUD)
- Restaurants (CRUD)
- Places / Lieux (CRUD)
- Stades (CRUD)
- Tours / Plans (CRUD)
- Transport (CRUD)
- Services Locaux (validation)
- Urgences (CRUD)
- Commentaires (modération)
- Users (gestion)

**Fonctionnalités**:
- Tableau de bord avec statistiques
- Gestion CRUD pour tous les services
- Validation des services proposés
- Recherche et filtrage
- Actions rapides

### 8.7 Chatbot IA (Chatbot.jsx)

**Fonctionnalités**:
- Interface de chat
- Intégration avec Groq API (Llama 3.3-70b)
- Contexte dynamique depuis la base de données
- Support multilingue
- Historique de conversation
- Sélecteur d'emojis
- Effacer la conversation

---

## 9. FONCTIONNALITÉS

### 9.1 Authentification et Autorisation

- **Inscription**: Création de compte avec email et mot de passe
- **Connexion**: Authentification via email/mot de passe
- **Déconnexion**: Invalidité du token
- **Rôles**: visitor, provider, guide, admin
- **Tokens**: Laravel Sanctum pour l'authentification API

### 9.2 Exploration des Services

- **Navigation**: Par ville ou par type de service
- **Recherche**: Par nom de service
- **Filtrage**: Par ville, prix, durée
- **Favoris**: Sauvegarde locale des services préférés
- **Détails**: Modal avec informations complètes

### 9.3 Réservations

- **Hôtels**: Réservation de chambres avec dates
- **Restaurants**: Réservation de tables avec date et heure
- **Email**: Envoi automatique de confirmation
- **Validation**: Vérification des données avant envoi

### 9.4 Commentaires et Avis

- **Ajout**: Formulaire de commentaire avec note
- **Affichage**: Liste des commentaires par service
- **Polymorphisme**: Commentaires pour différents types de services
- **Validation**: Champs obligatoires

### 9.5 Chatbot IA

- **Assistant**: MoroVista AI pour aider les utilisateurs
- **Contexte**: Utilisation des données réelles de la base
- **Multilingue**: Adaptation à la langue de l'utilisateur
- **Historique**: Sauvegarde locale de la conversation

### 9.6 Administration

- **CRUD**: Création, lecture, mise à jour, suppression
- **Validation**: Acceptation/rejet des services proposés
- **Statistiques**: Vue d'ensemble de la plateforme
- **Recherche**: Filtrage rapide des éléments
- **Gestion des utilisateurs**: Validation des comptes

---

## 10. ACTEURS DU SYSTÈME

### 10.1 Visiteur (Utilisateur non connecté)

**Droits**:
- Consulter les services touristiques
- Rechercher et filtrer
- Voir les détails des services
- Consulter les commentaires
- Interagir avec le chatbot

**Limitations**:
- Ne peut pas réserver
- Ne peut pas commenter
- Ne peut pas ajouter aux favoris

### 10.2 Voyageur (Utilisateur connecté)

**Droits**:
- Tous les droits du visiteur
- S'authentifier
- Ajouter aux favoris
- Poster des commentaires
- Faire des réservations
- Créer son propre plan de voyage

### 10.3 Prestataire de Service (Provider)

**Droits**:
- Tous les droits du voyageur
- Proposer des services locaux
- Gérer ses propres services
- Voir le statut de ses propositions

**Validation**: Les services nécessitent une validation admin

### 10.4 Guide Touristique

**Droits**:
- Tous les droits du voyageur
- Créer et proposer des plans de voyage
- Gérer ses tours
- Voir le statut de ses propositions

**Validation**: Les tours nécessitent une validation admin

### 10.5 Administrateur

**Droits**:
- Accès au tableau de bord d'administration
- Gestion complète de tous les services (CRUD)
- Validation des services locaux et tours
- Gestion des utilisateurs
- Modération des commentaires
- Suppression de contenu inapproprié
- Vue des statistiques

---

## 11. PROMPTS POUR DIAGRAMMES UML

### 11.1 Prompt pour Diagramme de Cas d'Utilisation (Use Case Diagram)

```
Crée un diagramme de cas d'utilisation UML pour le système MoroVista, une plateforme touristique marocaine.

ACTEURS:
- Visiteur (utilisateur non connecté)
- Voyageur (utilisateur connecté)
- Prestataire (provider)
- Guide Touristique
- Administrateur

CAS D'UTILISATION PRINCIPAUX:

Pour le Visiteur:
- UC01: Consulter la page d'accueil
- UC02: Consulter la liste des hôtels
- UC03: Consulter la liste des restaurants
- UC04: Consulter les plans de voyage
- UC05: Consulter les autres services (stades, lieux, transports, urgences)
- UC06: Voir les détails d'un service
- UC07: Consulter les commentaires
- UC08: Interagir avec le chatbot IA

Pour le Voyageur:
- UC09: S'inscrire sur la plateforme
- UC10: Se connecter à la plateforme
- UC11: Se déconnecter
- UC12: Ajouter un service aux favoris
- UC13: Réserver un hôtel
- UC14: Réserver une table au restaurant
- UC15: Ajouter un commentaire

Pour le Prestataire:
- UC16: Proposer un service local
- UC17: Gérer ses services locaux

Pour le Guide:
- UC18: Créer un plan de voyage
- UC19: Gérer ses plans de voyage

Pour l'Administrateur:
- UC20: Accéder au tableau de bord
- UC21: Consulter les statistiques globales
- UC22: Gérer les hôtels (CRUD)
- UC23: Gérer les restaurants (CRUD)
- UC24: Gérer les stades (CRUD)
- UC25: Gérer les lieux (CRUD)
- UC26: Gérer les plans de voyage (CRUD)
- UC27: Gérer les transports (CRUD)
- UC28: Valider les services locaux
- UC29: Gérer les utilisateurs
- UC30: Modérer les commentaires
- UC31: Gérer les numéros d'urgence
- UC32: Rechercher dans le tableau de bord

RELATIONS:
- Include: UC13 inclut UC06 (voir détails avant réserver)
- Extend: UC15 peut étendre UC06 (commenter après voir détails)
- Generalization: Voyageur hérite de Visiteur
- Generalization: Prestataire hérite de Voyageur
- Generalization: Guide hérite de Voyageur

FORMAT: Utilise le standard UML avec les acteurs à gauche et les cas d'utilisation à droite.
```

### 11.2 Prompt pour Diagramme de Séquence (Sequence Diagram)

```
Crée un diagramme de séquence UML pour le scénario de réservation d'hôtel dans MoroVista.

ACTEURS/OBJETS:
- Voyageur (Utilisateur)
- Interface Frontend (React)
- API Laravel (Backend)
- Base de Données (SQLite/MySQL)
- Système d'Email

SCÉNARIO: Réservation d'un hôtel

FLUX:
1. Voyageur → Interface: Clique sur "Voir Détails" d'un hôtel
2. Interface → API: GET /api/hotels/{id}
3. API → Base de Données: Requête détails hôtel
4. Base de Données → API: Retourne données hôtel
5. API → Interface: Retourne détails hôtel
6. Interface → Voyageur: Affiche modal de détails
7. Voyageur → Interface: Clique sur "Réserver Maintenant"
8. Interface → Voyageur: Affiche formulaire de réservation
9. Voyageur → Interface: Remplit formulaire (nom, email, téléphone, dates, nombre de personnes)
10. Voyageur → Interface: Soumet formulaire
11. Interface → Interface: Valide les données
12. Interface → API: POST /api/reservation avec données
13. API → API: Valide la réservation
14. API → Base de Données: Enregistre réservation
15. Base de Données → API: Confirmation enregistrement
16. API → Système d'Email: Envoie email de confirmation
17. Système d'Email → API: Confirmation envoi
18. API → Interface: Retourne message de succès
19. Interface → Voyageur: Affiche "Demande Envoyée !"

FRAMES/OPTIONAL:
- Validation: Si données invalides, retourner erreur
- Authentification: Vérifier token utilisateur

FORMAT: Standard UML avec lignes de vie verticales et messages horizontaux.
```

### 11.3 Prompt pour Diagramme de Séquence - Inscription

```
Crée un diagramme de séquence UML pour le scénario d'inscription d'un nouvel utilisateur dans MoroVista.

ACTEURS/OBJETS:
- Visiteur
- Interface Frontend (React)
- API Laravel (AuthController)
- Base de Données
- Système de Tokens (Sanctum)

SCÉNARIO: Inscription d'un nouvel utilisateur

FLUX:
1. Visiteur → Interface: Clique sur "S'inscrire"
2. Interface → Visiteur: Affiche formulaire d'inscription
3. Visiteur → Interface: Remplit formulaire (nom, email, mot de passe, type de compte)
4. Visiteur → Interface: Soumet formulaire
5. Interface → Interface: Valide format email et mot de passe
6. Interface → API: POST /api/register avec données
7. API → API: Valide unicité email
8. API → Base de Données: Vérifie si email existe déjà
9. Base de Données → API: Email unique
10. API → Base de Données: Crée nouvel utilisateur
11. Base de Données → API: Confirmation création
12. API → Système de Tokens: Génère token d'authentification
13. Système de Tokens → API: Retourne token
14. API → Interface: Retourne token et données utilisateur
15. Interface → Interface: Stocke token dans localStorage
16. Interface → Visiteur: Redirige vers page d'accueil

ALT: Email déjà existant
- API → Interface: Retourne erreur "Email déjà utilisé"
- Interface → Visiteur: Affiche message d'erreur

FORMAT: Standard UML avec blocs ALT pour les cas d'erreur.
```

### 11.4 Prompt pour Diagramme de Séquence - Chatbot

```
Crée un diagramme de séquence UML pour le scénario d'interaction avec le chatbot IA dans MoroVista.

ACTEURS/OBJETS:
- Voyageur
- Interface Frontend (React)
- API Laravel
- API Groq (Llama 3.3-70b)
- Base de Données

SCÉNARIO: Interaction avec le chatbot IA

FLUX:
1. Voyageur → Interface: Clique sur bouton chatbot
2. Interface → Voyageur: Ouvre fenêtre chatbot
3. Interface → API: GET /api/chat-context
4. API → Base de Données: Requête villes, hôtels, restaurants, tours
5. Base de Données → API: Retourne contexte
6. API → Interface: Retourne contexte
7. Voyageur → Interface: Tape message "Quels hôtels à Marrakech ?"
8. Interface → Interface: Formate prompt avec contexte
9. Interface → API Groq: POST /chat/completions
10. API Groq → API Groq: Traite avec Llama 3.3-70b
11. API Groq → Interface: Retourne réponse IA
12. Interface → Voyageur: Affiche réponse
13. Interface → Interface: Sauvegarde conversation dans localStorage

LOOP: Conversation continue
- Voyageur → Interface: Tape nouveau message
- Interface → API Groq: Ensuite message avec historique
- API Groq → Interface: Retourne réponse
- Interface → Voyageur: Affiche réponse

FORMAT: Standard UML avec boucle LOOP pour les messages multiples.
```

### 11.5 Prompt pour Diagramme de Classes (Class Diagram / MCD)

```
Crée un diagramme de classes UML (MCD - Modèle Conceptuel de Données) pour le système MoroVista.

CLASSES PRINCIPALES:

1. User (Utilisateur)
   - Attributs: id (PK), name, email, password, firebase_uid, role, telephone, created_at, updated_at
   - Méthodes: createToken(), tokens()
   - Relations: 1..N vers PlanTour, 1..N vers Commentaire

2. Ville (Ville)
   - Attributs: id (PK), nom, image_url, created_at, updated_at
   - Relations: 1..N vers Hotel, Restaurant, Stade, LieuPlace, PlanTour, ServiceLocal

3. Hotel (Hôtel)
   - Attributs: id (PK), nom, photo_url, adresse, contact, email, prix_chambre, categorie, likes, ville_id (FK), created_at, updated_at
   - Relations: N..1 vers Ville, 1..N vers Commentaire

4. Restaurant (Restaurant)
   - Attributs: id (PK), nom, photo_url, adresse, contact, email, prix_moyen, categorie, likes, ville_id (FK), created_at, updated_at
   - Relations: N..1 vers Ville, 1..N vers Commentaire

5. Stade (Stade)
   - Attributs: id (PK), nom, image_url, adresse, contact, capacite, likes, ville_id (FK), created_at, updated_at
   - Relations: N..1 vers Ville

6. LieuPlace (Lieu Touristique)
   - Attributs: id (PK), nom, image_url, description, likes, ville_id (FK), created_at, updated_at
   - Relations: N..1 vers Ville

7. PlanTour (Plan de Voyage)
   - Attributs: id (PK), titre, image_url, prix, duree, status, addedBy, ville_id (FK), user_id (FK), created_at, updated_at
   - Relations: N..1 vers Ville, N..1 vers User

8. ServiceLocal (Service Local)
   - Attributs: id (PK), nom, type, ville_id (FK), adresse, telephone, proprietaire, details, image_url, addedBy, status, created_at, updated_at
   - Relations: N..1 vers Ville

9. Transport (Transport)
   - Attributs: id (PK), type, lien, created_at, updated_at

10. UrgencePhonen (Numéro d'Urgence)
    - Attributs: id (PK), num, created_at, updated_at

11. Commentaire (Commentaire/Avis)
    - Attributs: id (PK), auteur_nom, pays, contenu, note, date_pub, likes, user_id (FK), service_type, service_id, created_at, updated_at
    - Relations: N..1 vers User, polymorphique vers Hotel/Restaurant/etc.

RELATIONS:
- Ville (1) ---- (N) Hotel
- Ville (1) ---- (N) Restaurant
- Ville (1) ---- (N) Stade
- Ville (1) ---- (N) LieuPlace
- Ville (1) ---- (N) PlanTour
- Ville (1) ---- (N) ServiceLocal
- User (1) ---- (N) PlanTour
- User (1) ---- (N) Commentaire
- Hotel (1) ---- (N) Commentaire
- Restaurant (1) ---- (N) Commentaire

CARDINALITÉS:
- 1..*: Un à plusieurs
- 0..*: Zéro à plusieurs
- 1..1: Un à un

FORMAT: Standard UML avec classes, attributs, méthodes et relations.
```

### 11.6 Prompt pour Diagramme de Séquence - Validation Admin

```
Crée un diagramme de séquence UML pour le scénario de validation d'un service local par l'administrateur dans MoroVista.

ACTEURS/OBJETS:
- Administrateur
- Interface Admin Dashboard
- API Laravel
- Base de Données
- Système de Notification

SCÉNARIO: Validation d'un service local proposé

FLUX:
1. Administrateur → Interface: Accède au tableau de bord
2. Interface → API: GET /api/service-locals
3. API → Base de Données: Requête tous les services locaux
4. Base de Données → API: Retourne liste avec statuts
5. API → Interface: Retourne données
6. Interface → Administrateur: Affiche liste avec statuts (pending, accepted, rejected)
7. Administrateur → Interface: Sélectionne service avec statut "pending"
8. Administrateur → Interface: Clique bouton "Accepter"
9. Interface → API: PUT /api/service-locals/{id} avec status="accepted"
10. API → Base de Données: Met à jour statut du service
11. Base de Données → API: Confirmation mise à jour
12. API → Système de Notification: Envoie notification au prestataire
13. Système de Notification → API: Confirmation envoi
14. API → Interface: Retourne service mis à jour
15. Interface → Administrateur: Affiche nouveau statut "Accepté"

ALT: Rejet du service
- Administrateur → Interface: Clique bouton "Refuser"
- Interface → API: PUT /api/service-locals/{id} avec status="rejected"
- API → Base de Données: Met à jour statut
- API → Système de Notification: Envoie notification de rejet
- Interface → Administrateur: Affiche statut "Refusé"

FORMAT: Standard UML avec blocs ALT pour acceptation/rejet.
```

---

## 12. DÉPLOIEMENT

### 12.1 Déploiement Backend

#### Option 1: Render.com
- Platform: Cloud PaaS
- Configuration: render.yaml
- Base de données: SQLite
- Commandes: composer install, php artisan serve

#### Option 2: InfinityFree
- Platform: Hébergement PHP gratuit
- Base de données: MySQL
- Configuration: .htaccess, .env
- Upload via FTP
- Permissions: 755 pour dossiers, 644 pour fichiers

### 12.2 Déploiement Frontend

#### Option 1: Vercel
- Platform: Frontend cloud
- Build: npm run build
- Commande de démarrage: npm run preview
- Variables d'environnement: VITE_API_URL

#### Option 2: Netlify
- Platform: Frontend cloud
- Build: npm run build
- Publish directory: dist

### 12.3 Configuration de Production

**Backend (.env)**:
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com
DB_CONNECTION=mysql
DB_HOST=host
DB_DATABASE=database
DB_USERNAME=username
DB_PASSWORD=password
```

**Frontend (.env)**:
```
VITE_API_URL=https://votre-api.com/api
```

---

## 13. CONCLUSION

### 13.1 Résumé du Projet

MoroVista est une plateforme touristique complète et moderne qui permet aux voyageurs de découvrir et réserver des services touristiques au Maroc. Le projet combine les technologies modernes (Laravel, React, GSAP, IA) pour offrir une expérience utilisateur exceptionnelle.

### 13.2 Points Forts

- Architecture client-serveur robuste
- API RESTful bien structurée
- Interface utilisateur moderne et animée
- Système d'authentification sécurisé
- Assistant IA intelligent
- Panel d'administration complet
- Support multilingue
- Base de données relationnelle bien conçue

### 13.3 Perspectives d'Avenir

- Intégration de paiement en ligne
- Système de recommandation basé sur l'IA
- Application mobile native
- Intégration avec d'autres services touristiques
- Système de fidélité
- Analytics avancés

### 13.4 Technologies Maîtresses

- **Backend**: Laravel 12, PHP 8.2, SQLite/MySQL
- **Frontend**: React 19, Vite 7, GSAP 3, Swiper 12
- **IA**: Groq API (Llama 3.3-70b)
- **Authentification**: Laravel Sanctum
- **Internationalisation**: react-i18next

---

## ANNEXES

### Annexe A: Commandes Utiles

**Backend (Laravel)**:
```bash
composer install
php artisan migrate
php artisan serve
php artisan key:generate
```

**Frontend (React Vite)**:
```bash
npm install
npm run dev
npm run build
npm run preview
```

### Annexe B: Structure des Routes

**API Routes (routes/api.php)**:
- Authentification: /register, /login, /logout
- Services: /villes, /hotels, /restaurants, /stades, /lieu-places, /plan-tours, /service-locals, /transports, /urgence-phonens
- Commentaires: /commentaires (GET, POST)
- Réservations: /reservation (POST)
- Chatbot: /chat-context (GET)

### Annexe C: Modèles Eloquent

**Relations**:
- Ville hasMany: Hotel, Restaurant, Stade, LieuPlace, PlanTour, ServiceLocal
- User hasMany: PlanTour, Commentaire
- Hotel belongsTo: Ville
- Hotel hasMany: Commentaire
- Restaurant belongsTo: Ville
- Restaurant hasMany: Commentaire

---

**FIN DE LA DOCUMENTATION**

*Ce document contient toutes les informations nécessaires pour comprendre, documenter et présenter le projet MoroVista.*
