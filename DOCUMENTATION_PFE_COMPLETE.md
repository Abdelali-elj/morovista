# DOCUMENTATION COMPLÈTE DU SYSTÈME MOROVISTA
## Pour l'extraction des Cas d'Utilisation, MCD et Diagrammes de Séquence

---

## 1. PRÉSENTATION GÉNÉRALE DU SYSTÈME

MoroVista est une plateforme touristique marocaine de luxe qui permet aux voyageurs de découvrir et réserver des services touristiques au Maroc. Le système se compose de deux parties principales :

### 1.1 Backend (Laravel API)
- Framework : Laravel 11 (PHP)
- Base de données : SQLite (développement) / MySQL (production)
- Architecture : RESTful API
- Authentification : Laravel Sanctum (Token-based)
- Localisation : Support multilingue (Français, Anglais, Arabe)

### 1.2 Frontend (React Vite)
- Framework : React 18 avec Vite
- Bibliothèques : GSAP (animations), Swiper (carousel), React Router (navigation)
- Internationalisation : react-i18next
- API Client : Axios
- Authentification : Firebase (optionnel) + Laravel API

---

## 2. ACTEURS DU SYSTÈME

### 2.1 Visiteur (Utilisateur non connecté)
- Peut consulter les services touristiques (hôtels, restaurants, stades, lieux, plans de voyage)
- Peut rechercher et filtrer par ville
- Peut voir les détails des services
- Peut consulter les commentaires
- Peut contacter le chatbot IA

### 2.2 Voyageur (Utilisateur connecté)
- Toutes les fonctionnalités du visiteur
- Peut s'authentifier (inscription/connexion)
- Peut ajouter des services aux favoris
- Peut poster des commentaires et avis
- Peut faire des réservations (hôtels, restaurants)
- Peut créer son propre plan de voyage

### 2.3 Prestataire de Service (Provider)
- Toutes les fonctionnalités du voyageur
- Peut proposer des services locaux
- Peut gérer ses propres services
- Ses services nécessitent une validation par l'administrateur

### 2.4 Guide Touristique
- Toutes les fonctionnalités du voyageur
- Peut créer et proposer des plans de voyage/tours
- Peut gérer ses tours
- Ses tours nécessitent une validation par l'administrateur

### 2.5 Administrateur
- Accès au tableau de bord d'administration
- Gestion complète de tous les services (CRUD)
- Validation des services locaux et tours proposés
- Gestion des utilisateurs
- Suppression de contenu inapproprié
- Vue d'ensemble des statistiques

---

## 3. MODÈLE CONCEPTUEL DE DONNÉES (MCD)

### 3.1 Entités Principales

#### USER (Utilisateur)
- **id** : Identifiant unique (PK)
- **name** : Nom complet
- **email** : Adresse email (unique)
- **password** : Mot de passe hashé
- **firebase_uid** : Identifiant Firebase (optionnel)
- **role** : Rôle (visitor, provider, guide, admin)
- **telephone** : Numéro de téléphone (pour providers/guides)
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

#### VILLE (Ville)
- **id** : Identifiant unique (PK)
- **nom** : Nom de la ville
- **image_url** : URL de l'image de la ville
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

#### HOTEL (Hôtel)
- **id** : Identifiant unique (PK)
- **nom** : Nom de l'hôtel
- **photo_url** : URL de la photo
- **adresse** : Adresse physique
- **contact** : Numéro de contact
- **email** : Email de contact
- **prix_chambre** : Prix par chambre
- **categorie** : Catégorie (ex: 5 étoiles, luxe)
- **likes** : Nombre de likes
- **ville_id** : Clé étrangère vers VILLE (FK)
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

#### RESTAURANT (Restaurant)
- **id** : Identifiant unique (PK)
- **nom** : Nom du restaurant
- **photo_url** : URL de la photo
- **adresse** : Adresse physique
- **contact** : Numéro de contact
- **email** : Email de contact
- **prix_moyen** : Prix moyen par personne
- **categorie** : Catégorie (ex: gastronomique, traditionnel)
- **likes** : Nombre de likes
- **ville_id** : Clé étrangère vers VILLE (FK)
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

#### STADE (Stade)
- **id** : Identifiant unique (PK)
- **nom** : Nom du stade
- **image_url** : URL de l'image
- **adresse** : Adresse physique
- **contact** : Numéro de contact
- **capacite** : Capacité du stade
- **likes** : Nombre de likes
- **ville_id** : Clé étrangère vers VILLE (FK)
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

#### LIEU_PLACE (Lieu/Place)
- **id** : Identifiant unique (PK)
- **nom** : Nom du lieu
- **image_url** : URL de l'image
- **description** : Description du lieu
- **likes** : Nombre de likes
- **ville_id** : Clé étrangère vers VILLE (FK)
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

#### PLAN_TOUR (Plan de Voyage/Tour)
- **id** : Identifiant unique (PK)
- **titre** : Titre du tour
- **image_url** : URL de l'image
- **prix** : Prix du tour
- **duree** : Durée (ex: "2 Days", "3 Hours")
- **status** : Statut (active, accepted, pending, rejected)
- **addedBy** : Créateur du tour
- **ville_id** : Clé étrangère vers VILLE (FK)
- **user_id** : Clé étrangère vers USER (FK)
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

#### SERVICE_LOCAL (Service Local)
- **id** : Identifiant unique (PK)
- **nom** : Nom du service
- **type** : Type de service
- **ville_id** : Clé étrangère vers VILLE (FK)
- **adresse** : Adresse
- **telephone** : Numéro de téléphone
- **proprietaire** : Propriétaire du service
- **details** : Détails du service
- **image_url** : URL de l'image
- **addedBy** : Créateur du service
- **status** : Statut (pending, accepted, rejected)
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

#### TRANSPORT (Transport)
- **id** : Identifiant unique (PK)
- **type** : Type de transport
- **lien** : Lien/Action
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

#### URGENGE_PHONEN (Numéro d'Urgence)
- **id** : Identifiant unique (PK)
- **num** : Numéro d'urgence
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

#### COMMENTAIRE (Commentaire/Avis)
- **id** : Identifiant unique (PK)
- **auteur_nom** : Nom de l'auteur
- **pays** : Pays de l'auteur
- **contenu** : Contenu du commentaire
- **note** : Note/évaluation (1-5)
- **date_pub** : Date de publication
- **likes** : Nombre de likes
- **user_id** : Clé étrangère vers USER (FK)
- **service_type** : Type de service (hotel, restaurant, etc.)
- **service_id** : ID du service concerné
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

### 3.2 Relations entre Entités

- **VILLE** (1,N) ↔ **HOTEL** (N,1) : Une ville a plusieurs hôtels, un hôtel appartient à une ville
- **VILLE** (1,N) ↔ **RESTAURANT** (N,1) : Une ville a plusieurs restaurants, un restaurant appartient à une ville
- **VILLE** (1,N) ↔ **STADE** (N,1) : Une ville a plusieurs stades, un stade appartient à une ville
- **VILLE** (1,N) ↔ **LIEU_PLACE** (N,1) : Une ville a plusieurs lieux, un lieu appartient à une ville
- **VILLE** (1,N) ↔ **PLAN_TOUR** (N,1) : Une ville a plusieurs tours, un tour appartient à une ville
- **VILLE** (1,N) ↔ **SERVICE_LOCAL** (N,1) : Une ville a plusieurs services locaux, un service local appartient à une ville
- **USER** (1,N) ↔ **PLAN_TOUR** (N,1) : Un utilisateur peut créer plusieurs tours
- **USER** (1,N) ↔ **COMMENTAIRE** (N,1) : Un utilisateur peut poster plusieurs commentaires
- **HOTEL** (1,N) ↔ **COMMENTAIRE** (N,1) : Un hôtel peut avoir plusieurs commentaires
- **RESTAURANT** (1,N) ↔ **COMMENTAIRE** (N,1) : Un restaurant peut avoir plusieurs commentaires

---

## 4. CAS D'UTILISATION (USE CASES)

### 4.1 Cas d'Utilisation Généraux

#### UC-01: Consulter la page d'accueil
**Acteur**: Visiteur, Voyageur
**Description**: L'utilisateur accède à la page d'accueil pour découvrir les services proposés par MoroVista.
**Préconditions**: Aucune
**Scénario Principal**:
1. L'utilisateur accède à l'URL de l'application
2. La page d'accueil s'affiche avec les sections hero, services, témoignages
3. L'utilisateur peut naviguer vers les différentes sections
**Postconditions**: L'utilisateur est sur la page d'accueil

#### UC-02: S'inscrire sur la plateforme
**Acteur**: Visiteur
**Description**: Un nouveau visiteur crée un compte pour accéder aux fonctionnalités avancées.
**Préconditions**: L'utilisateur n'a pas de compte
**Scénario Principal**:
1. L'utilisateur clique sur "S'inscrire"
2. L'utilisateur remplit le formulaire (nom, email, mot de passe, type de compte)
3. L'utilisateur soumet le formulaire
4. Le système valide les données
5. Le système crée le compte utilisateur
6. Le système génère un token d'authentification
7. L'utilisateur est connecté automatiquement
**Postconditions**: Le compte est créé et l'utilisateur est connecté

#### UC-03: Se connecter à la plateforme
**Acteur**: Visiteur
**Description**: Un utilisateur existant se connecte à son compte.
**Préconditions**: L'utilisateur a un compte valide
**Scénario Principal**:
1. L'utilisateur clique sur "Se connecter"
2. L'utilisateur saisit son email et mot de passe
3. L'utilisateur soumet le formulaire
4. Le système valide les identifiants
5. Le système génère un token d'authentification
6. L'utilisateur est redirigé selon son rôle (admin → dashboard, autre → accueil)
**Postconditions**: L'utilisateur est connecté

#### UC-04: Se déconnecter
**Acteur**: Voyageur, Prestataire, Guide, Administrateur
**Description**: L'utilisateur se déconnecte de son compte.
**Préconditions**: L'utilisateur est connecté
**Scénario Principal**:
1. L'utilisateur clique sur "Déconnexion"
2. Le système invalide le token
3. Le système redirige vers la page de connexion
**Postconditions**: L'utilisateur est déconnecté

### 4.2 Cas d'Utilisation pour les Services

#### UC-05: Consulter la liste des hôtels
**Acteur**: Visiteur, Voyageur
**Description**: L'utilisateur consulte la liste des hôtels disponibles.
**Préconditions**: Aucune
**Scénario Principal**:
1. L'utilisateur accède à la section Hôtels
2. Le système affiche la liste des hôtels par ville
3. L'utilisateur peut filtrer par ville
4. L'utilisateur peut rechercher par nom
5. L'utilisateur peut voir ses favoris
**Postconditions**: La liste des hôtels est affichée

#### UC-06: Voir les détails d'un hôtel
**Acteur**: Visiteur, Voyageur
**Description**: L'utilisateur consulte les détails complets d'un hôtel.
**Préconditions**: UC-05 est exécuté
**Scénario Principal**:
1. L'utilisateur clique sur "Voir Détails" d'un hôtel
2. Le système affiche un modal avec les détails (photo, description, prix, équipements)
3. Le système affiche la carte Google Maps
4. Le système affiche les commentaires
**Postconditions**: Les détails de l'hôtel sont affichés

#### UC-07: Ajouter un hôtel aux favoris
**Acteur**: Voyageur
**Description**: L'utilisateur ajoute un hôtel à sa liste de favoris.
**Préconditions**: L'utilisateur est connecté, UC-06 est exécuté
**Scénario Principal**:
1. L'utilisateur clique sur le bouton cœur
2. Le système ajoute l'hôtel aux favoris de l'utilisateur
3. Le système met à jour le compteur de likes
4. Le système sauvegarde dans le localStorage
**Postconditions**: L'hôtel est ajouté aux favoris

#### UC-08: Consulter la liste des restaurants
**Acteur**: Visiteur, Voyageur
**Description**: L'utilisateur consulte la liste des restaurants disponibles.
**Préconditions**: Aucune
**Scénario Principal**:
1. L'utilisateur accède à la section Restaurants
2. Le système affiche la liste des restaurants par ville
3. L'utilisateur peut filtrer par ville
4. L'utilisateur peut rechercher par nom
5. L'utilisateur peut voir ses favoris
**Postconditions**: La liste des restaurants est affichée

#### UC-09: Voir les détails d'un restaurant
**Acteur**: Visiteur, Voyageur
**Description**: L'utilisateur consulte les détails complets d'un restaurant.
**Préconditions**: UC-08 est exécuté
**Scénario Principal**:
1. L'utilisateur clique sur "Voir Détails" d'un restaurant
2. Le système affiche un modal avec les détails (photo, description, prix, caractéristiques)
3. Le système affiche la carte Google Maps
4. Le système affiche les commentaires
**Postconditions**: Les détails du restaurant sont affichés

#### UC-10: Consulter les plans de voyage (Tours)
**Acteur**: Visiteur, Voyageur
**Description**: L'utilisateur consulte les plans de voyage proposés.
**Préconditions**: Aucune
**Scénario Principal**:
1. L'utilisateur accède à la section Plans & Tours
2. Le système affiche un carousel de tours
3. L'utilisateur peut filtrer par destination
4. L'utilisateur peut filtrer par prix maximum
5. L'utilisateur peut filtrer par durée
6. L'utilisateur peut voir les statistiques
**Postconditions**: La liste des tours est affichée

#### UC-11: Voir les détails d'un plan de voyage
**Acteur**: Visiteur, Voyageur
**Description**: L'utilisateur consulte les détails complets d'un plan de voyage.
**Préconditions**: UC-10 est exécuté
**Scénario Principal**:
1. L'utilisateur clique sur un tour
2. Le système affiche la page de détails du tour
3. Le système affiche les informations complètes (titre, prix, durée, description)
**Postconditions**: Les détails du tour sont affichés

#### UC-12: Consulter les autres services (Stades, Lieux, Transports, Urgences)
**Acteur**: Visiteur, Voyageur
**Description**: L'utilisateur consulte les autres services touristiques.
**Préconditions**: Aucune
**Scénario Principal**:
1. L'utilisateur accède à la section Services
2. L'utilisateur sélectionne le type de service (Stades, Lieux, Transports, Urgences)
3. Le système affiche la liste correspondante
**Postconditions**: La liste des services est affichée

### 4.3 Cas d'Utilisation pour les Réservations

#### UC-13: Réserver un hôtel
**Acteur**: Voyageur
**Description**: L'utilisateur effectue une réservation d'hôtel.
**Préconditions**: L'utilisateur est connecté, UC-06 est exécuté
**Scénario Principal**:
1. L'utilisateur clique sur "Réserver Maintenant"
2. Le système affiche le formulaire de réservation
3. L'utilisateur remplit les informations (nom, email, téléphone, dates, nombre de personnes)
4. L'utilisateur soumet le formulaire
5. Le système valide les données
6. Le système envoie un email de réservation
7. Le système affiche un message de succès
**Postconditions**: La réservation est envoyée

#### UC-14: Réserver une table au restaurant
**Acteur**: Voyageur
**Description**: L'utilisateur effectue une réservation de table.
**Préconditions**: L'utilisateur est connecté, UC-09 est exécuté
**Scénario Principal**:
1. L'utilisateur clique sur "Réserver une Table"
2. Le système affiche le formulaire de réservation
3. L'utilisateur remplit les informations (nom, email, téléphone, date, heure, nombre de personnes)
4. L'utilisateur soumet le formulaire
5. Le système valide les données
6. Le système envoie un email de réservation
7. Le système affiche un message de succès
**Postconditions**: La réservation est envoyée

### 4.4 Cas d'Utilisation pour les Commentaires

#### UC-15: Consulter les commentaires d'un service
**Acteur**: Visiteur, Voyageur
**Description**: L'utilisateur consulte les commentaires/avis sur un service.
**Préconditions**: UC-06 ou UC-09 est exécuté
**Scénario Principal**:
1. L'utilisateur ouvre les détails d'un service
2. Le système affiche la section commentaires
3. Le système affiche la liste des commentaires avec auteur, pays, note, date
**Postconditions**: Les commentaires sont affichés

#### UC-16: Ajouter un commentaire
**Acteur**: Voyageur
**Description**: L'utilisateur ajoute un commentaire/avis sur un service.
**Préconditions**: L'utilisateur est connecté, UC-15 est exécuté
**Scénario Principal**:
1. L'utilisateur remplit le formulaire de commentaire (nom, pays, contenu)
2. L'utilisateur soumet le formulaire
3. Le système valide les données
4. Le système enregistre le commentaire
5. Le système affiche le commentaire dans la liste
**Postconditions**: Le commentaire est ajouté

### 4.5 Cas d'Utilisation pour le Chatbot IA

#### UC-17: Interagir avec le chatbot IA
**Acteur**: Visiteur, Voyageur
**Description**: L'utilisateur discute avec l'assistant IA MoroVista.
**Préconditions**: Aucune
**Scénario Principal**:
1. L'utilisateur clique sur le bouton du chatbot
2. Le système ouvre la fenêtre du chatbot
3. L'utilisateur tape un message
4. Le système envoie le message à l'API Groq
5. Le système reçoit la réponse de l'IA
6. Le système affiche la réponse
**Postconditions**: La conversation est affichée

#### UC-18: Effacer la conversation du chatbot
**Acteur**: Visiteur, Voyageur
**Description**: L'utilisateur efface l'historique de conversation.
**Préconditions**: UC-17 est exécuté
**Scénario Principal**:
1. L'utilisateur clique sur le menu options
2. L'utilisateur sélectionne "Vider la conversation"
3. Le système confirme l'action
4. Le système efface tous les messages
5. Le système réinitialise avec le message de bienvenue
**Postconditions**: La conversation est effacée

### 4.6 Cas d'Utilisation pour les Prestataires

#### UC-19: Proposer un service local
**Acteur**: Prestataire
**Description**: Un prestataire propose un nouveau service local.
**Préconditions**: L'utilisateur est connecté avec le rôle "provider"
**Scénario Principal**:
1. L'utilisateur accède à son tableau de bord
2. L'utilisateur clique sur "Ajouter Service"
3. L'utilisateur remplit le formulaire (nom, type, ville, adresse, téléphone, détails, image)
4. L'utilisateur soumet le formulaire
5. Le système enregistre le service avec le statut "pending"
6. Le système notifie l'administrateur
**Postconditions**: Le service est proposé et en attente de validation

#### UC-20: Gérer ses services locaux
**Acteur**: Prestataire
**Description**: Un prestataire modifie ou supprime ses services.
**Préconditions**: L'utilisateur a des services proposés
**Scénario Principal**:
1. L'utilisateur accède à son tableau de bord
2. L'utilisateur sélectionne un service
3. L'utilisateur modifie les informations
4. L'utilisateur soumet les modifications
5. Le système met à jour le service
**Postconditions**: Le service est modifié

### 4.7 Cas d'Utilisation pour les Guides

#### UC-21: Créer un plan de voyage
**Acteur**: Guide
**Description**: Un guide crée un nouveau plan de voyage/tour.
**Préconditions**: L'utilisateur est connecté avec le rôle "guide"
**Scénario Principal**:
1. L'utilisateur accède à son tableau de bord
2. L'utilisateur clique sur "Ajouter Tour"
3. L'utilisateur remplit le formulaire (titre, ville, prix, durée, image)
4. L'utilisateur soumet le formulaire
5. Le système enregistre le tour avec le statut "pending"
6. Le système notifie l'administrateur
**Postconditions**: Le tour est créé et en attente de validation

#### UC-22: Gérer ses plans de voyage
**Acteur**: Guide
**Description**: Un guide modifie ou supprime ses tours.
**Préconditions**: L'utilisateur a des tours créés
**Scénario Principal**:
1. L'utilisateur accède à son tableau de bord
2. L'utilisateur sélectionne un tour
3. L'utilisateur modifie les informations
4. L'utilisateur soumet les modifications
5. Le système met à jour le tour
**Postconditions**: Le tour est modifié

### 4.8 Cas d'Utilisation pour l'Administrateur

#### UC-23: Accéder au tableau de bord d'administration
**Acteur**: Administrateur
**Description**: L'administrateur accède au panneau d'administration.
**Préconditions**: L'utilisateur est connecté avec le rôle "admin"
**Scénario Principal**:
1. L'utilisateur est redirigé vers /AdminDashboard
2. Le système affiche le tableau de bord
3. Le système affiche les statistiques globales
4. Le système affiche la distribution par ville
**Postconditions**: Le tableau de bord est affiché

#### UC-24: Consulter les statistiques globales
**Acteur**: Administrateur
**Description**: L'administrateur consulte les statistiques de la plateforme.
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur est sur l'onglet "Aperçu"
2. Le système affiche le nombre d'hôtels actifs
3. Le système affiche le nombre de restaurants
4. Le système affiche le nombre d'utilisateurs
5. Le système affiche le nombre de plans de voyage
**Postconditions**: Les statistiques sont affichées

#### UC-25: Gérer les hôtels (CRUD)
**Acteur**: Administrateur
**Description**: L'administrateur gère les hôtels (créer, modifier, supprimer).
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur accède à l'onglet "Hotels"
2. Le système affiche la liste des hôtels
3. L'utilisateur peut ajouter un nouvel hôtel
4. L'utilisateur peut modifier un hôtel existant
5. L'utilisateur peut supprimer un hôtel
6. Le système met à jour la base de données
**Postconditions**: Les modifications sont appliquées

#### UC-26: Gérer les restaurants (CRUD)
**Acteur**: Administrateur
**Description**: L'administrateur gère les restaurants (créer, modifier, supprimer).
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur accède à l'onglet "Restaurants"
2. Le système affiche la liste des restaurants
3. L'utilisateur peut ajouter un nouveau restaurant
4. L'utilisateur peut modifier un restaurant existant
5. L'utilisateur peut supprimer un restaurant
6. Le système met à jour la base de données
**Postconditions**: Les modifications sont appliquées

#### UC-27: Gérer les stades (CRUD)
**Acteur**: Administrateur
**Description**: L'administrateur gère les stades (créer, modifier, supprimer).
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur accède à l'onglet "Stades"
2. Le système affiche la liste des stades
3. L'utilisateur peut ajouter un nouveau stade
4. L'utilisateur peut modifier un stade existant
5. L'utilisateur peut supprimer un stade
6. Le système met à jour la base de données
**Postconditions**: Les modifications sont appliquées

#### UC-28: Gérer les lieux/places (CRUD)
**Acteur**: Administrateur
**Description**: L'administrateur gère les lieux (créer, modifier, supprimer).
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur accède à l'onglet "Places / Lieux"
2. Le système affiche la liste des lieux
3. L'utilisateur peut ajouter un nouveau lieu
4. L'utilisateur peut modifier un lieu existant
5. L'utilisateur peut supprimer un lieu
6. Le système met à jour la base de données
**Postconditions**: Les modifications sont appliquées

#### UC-29: Gérer les plans de voyage (CRUD)
**Acteur**: Administrateur
**Description**: L'administrateur gère les plans de voyage (créer, modifier, supprimer).
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur accède à l'onglet "Tours / Plans"
2. Le système affiche la liste des tours
3. L'utilisateur peut ajouter un nouveau tour
4. L'utilisateur peut modifier un tour existant
5. L'utilisateur peut supprimer un tour
6. Le système met à jour la base de données
**Postconditions**: Les modifications sont appliquées

#### UC-30: Gérer les transports (CRUD)
**Acteur**: Administrateur
**Description**: L'administrateur gère les transports (créer, modifier, supprimer).
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur accède à l'onglet "Transport"
2. Le système affiche la liste des transports
3. L'utilisateur peut ajouter un nouveau transport
4. L'utilisateur peut modifier un transport existant
5. L'utilisateur peut supprimer un transport
6. Le système met à jour la base de données
**Postconditions**: Les modifications sont appliquées

#### UC-31: Gérer les services locaux (Validation)
**Acteur**: Administrateur
**Description**: L'administrateur valide ou rejette les services locaux proposés.
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur accède à l'onglet "Services Locaux"
2. Le système affiche la liste des services avec leur statut
3. L'utilisateur peut accepter un service (statut → "accepted")
4. L'utilisateur peut rejeter un service (statut → "rejected")
5. L'utilisateur peut supprimer un service
6. Le système met à jour le statut
**Postconditions**: Le statut du service est mis à jour

#### UC-32: Gérer les utilisateurs
**Acteur**: Administrateur
**Description**: L'administrateur gère les utilisateurs de la plateforme.
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur accède à l'onglet "Users"
2. Le système affiche la liste des utilisateurs
3. L'utilisateur peut voir le rôle de chaque utilisateur
4. L'utilisateur peut valider les prestataires et guides (statut → "accepted")
5. L'utilisateur peut rejeter les prestataires et guides (statut → "rejected")
6. L'utilisateur peut supprimer un utilisateur
**Postconditions**: Les modifications sont appliquées

#### UC-33: Gérer les commentaires
**Acteur**: Administrateur
**Description**: L'administrateur modère les commentaires.
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur accède à l'onglet "Commentaires"
2. Le système affiche la liste des commentaires
3. L'utilisateur peut supprimer un commentaire inapproprié
**Postconditions**: Le commentaire est supprimé

#### UC-34: Gérer les numéros d'urgence
**Acteur**: Administrateur
**Description**: L'administrateur gère les numéros d'urgence.
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur accède à l'onglet "Urgences"
2. Le système affiche la liste des numéros
3. L'utilisateur peut ajouter un nouveau numéro
4. L'utilisateur peut modifier un numéro existant
5. L'utilisateur peut supprimer un numéro
**Postconditions**: Les modifications sont appliquées

#### UC-35: Gérer les villes
**Acteur**: Administrateur
**Description**: L'administrateur gère les villes disponibles.
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur accède à l'onglet "Villes" (via actions rapides)
2. L'utilisateur peut ajouter une nouvelle ville
3. L'utilisateur peut modifier une ville existante
4. L'utilisateur peut supprimer une ville
**Postconditions**: Les modifications sont appliquées

#### UC-36: Rechercher dans le tableau de bord
**Acteur**: Administrateur
**Description**: L'administrateur recherche des éléments dans le tableau de bord.
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur tape un terme de recherche
2. Le système filtre les résultats par nom ou ville
3. Le système affiche les résultats filtrés
**Postconditions**: Les résultats filtrés sont affichés

#### UC-37: Rafraîchir les données
**Acteur**: Administrateur
**Description**: L'administrateur rafraîchit les données du tableau de bord.
**Préconditions**: UC-23 est exécuté
**Scénario Principal**:
1. L'utilisateur clique sur "Refresh Data"
2. Le système recharge toutes les données depuis l'API
3. Le système met à jour l'affichage
**Postconditions**: Les données sont à jour

---

## 5. SCÉNARIOS DE DIAGRAMMES DE SÉQUENCE

### 5.1 Scénario 1: Inscription d'un nouvel utilisateur

**Acteurs**: Visiteur, Système
**Flux**:
1. Visiteur → Système: Clique sur "S'inscrire"
2. Système → Visiteur: Affiche le formulaire d'inscription
3. Visiteur → Système: Remplit le formulaire (nom, email, mot de passe, type de compte)
4. Visiteur → Système: Soumet le formulaire
5. Système → Système: Valide les données
6. Système → Système: Crée l'utilisateur dans la base de données
7. Système → Système: Génère un token d'authentification
8. Système → Visiteur: Retourne le token et les données utilisateur
9. Système → Système: Stocke le token dans le localStorage
10. Système → Visiteur: Redirige vers la page d'accueil

### 5.2 Scénario 2: Connexion d'un utilisateur

**Acteurs**: Visiteur, Système
**Flux**:
1. Visiteur → Système: Clique sur "Se connecter"
2. Système → Visiteur: Affiche le formulaire de connexion
3. Visiteur → Système: Saisit email et mot de passe
4. Visiteur → Système: Soumet le formulaire
5. Système → Système: Vérifie les identifiants
6. Système → Système: Génère un token d'authentification
7. Système → Visiteur: Retourne le token et les données utilisateur
8. Système → Système: Stocke le token dans le localStorage
9. Système → Système: Vérifie le rôle de l'utilisateur
10. Système → Visiteur: Redirige (admin → /AdminDashboard, autre → /)

### 5.3 Scénario 3: Consultation des hôtels avec filtres

**Acteurs**: Voyageur, Système, API Laravel
**Flux**:
1. Voyageur → Système: Accède à la section Hôtels
2. Système → API Laravel: GET /api/hotels
3. API Laravel → Système: Retourne la liste des hôtels
4. Système → Voyageur: Affiche la liste des hôtels par ville
5. Voyageur → Système: Sélectionne une ville (ex: Marrakech)
6. Système → Système: Filtre les hôtels par ville
7. Système → Voyageur: Affiche les hôtels filtrés
8. Voyageur → Système: Tape un terme de recherche
9. Système → Système: Filtre par nom
10. Système → Voyageur: Affiche les résultats de recherche

### 5.4 Scénario 4: Réservation d'un hôtel

**Acteurs**: Voyageur, Système, API Laravel, Système d'Email
**Flux**:
1. Voyageur → Système: Clique sur "Voir Détails" d'un hôtel
2. Système → Voyageur: Affiche le modal de détails
3. Voyageur → Système: Clique sur "Réserver Maintenant"
4. Système → Voyageur: Affiche le formulaire de réservation
5. Voyageur → Système: Remplit le formulaire (nom, email, téléphone, dates, nombre de personnes)
6. Voyageur → Système: Soumet le formulaire
7. Système → Système: Valide les données
8. Système → API Laravel: POST /api/reservation avec les données
9. API Laravel → Système: Valide la réservation
10. API Laravel → Système d'Email: Envoie l'email de réservation
11. Système d'Email → API Laravel: Confirme l'envoi
12. API Laravel → Système: Retourne un message de succès
13. Système → Voyageur: Affiche "Demande Envoyée !"

### 5.5 Scénario 5: Ajout d'un commentaire

**Acteurs**: Voyageur, Système, API Laravel
**Flux**:
1. Voyageur → Système: Consulte les détails d'un service
2. Système → API Laravel: GET /api/commentaires?service_type=hotel&service_id=X
3. API Laravel → Système: Retourne les commentaires existants
4. Système → Voyageur: Affiche les commentaires
5. Voyageur → Système: Remplit le formulaire de commentaire (nom, pays, contenu)
6. Voyageur → Système: Soumet le formulaire
7. Système → API Laravel: POST /api/commentaires avec les données
8. API Laravel → Système: Enregistre le commentaire
9. API Laravel → Système: Retourne le commentaire créé
10. Système → Voyageur: Affiche le nouveau commentaire dans la liste

### 5.6 Scénario 6: Interaction avec le Chatbot IA

**Acteurs**: Voyageur, Système, API Groq, API Laravel
**Flux**:
1. Voyageur → Système: Clique sur le bouton du chatbot
2. Système → Voyageur: Ouvre la fenêtre du chatbot
3. Système → API Laravel: GET /api/chat-context
4. API Laravel → Système: Retourne le contexte (villes, hôtels, restaurants, tours)
5. Voyageur → Système: Tape un message
6. Système → Système: Formate le prompt avec le contexte
7. Système → API Groq: POST /chat/completions avec le message
8. API Groq → Système: Retourne la réponse de l'IA
9. Système → Voyageur: Affiche la réponse
10. Système → Système: Sauvegarde la conversation dans le localStorage

### 5.7 Scénario 7: Validation d'un service local par l'administrateur

**Acteurs**: Administrateur, Système, API Laravel
**Flux**:
1. Administrateur → Système: Accède au tableau de bord
2. Système → API Laravel: GET /api/service-locals
3. API Laravel → Système: Retourne la liste des services locaux
4. Système → Administrateur: Affiche la liste avec statuts
5. Administrateur → Système: Sélectionne un service avec statut "pending"
6. Administrateur → Système: Clique sur "Accepter"
7. Système → API Laravel: PUT /api/service-locals/{id} avec status="accepted"
8. API Laravel → Système: Met à jour le statut
9. API Laravel → Système: Retourne le service mis à jour
10. Système → Administrateur: Affiche le nouveau statut "Accepté"

### 5.8 Scénario 9: Création d'un plan de voyage par un guide

**Acteurs**: Guide, Système, API Laravel
**Flux**:
1. Guide → Système: Accède à son tableau de bord
2. Système → Guide: Affiche ses tours existants
3. Guide → Système: Clique sur "Ajouter Tour"
4. Système → Guide: Affiche le formulaire de création
5. Guide → Système: Remplit le formulaire (titre, ville, prix, durée, image)
6. Guide → Système: Soumet le formulaire
7. Système → API Laravel: POST /api/plan-tours avec les données
8. API Laravel → Système: Enregistre le tour avec status="pending"
9. API Laravel → Système: Retourne le tour créé
10. Système → Guide: Affiche le tour dans la liste avec statut "En attente"

### 5.9 Scénario 10: Suppression d'un hôtel par l'administrateur

**Acteurs**: Administrateur, Système, API Laravel
**Flux**:
1. Administrateur → Système: Accède à l'onglet "Hotels"
2. Système → API Laravel: GET /api/hotels
3. API Laravel → Système: Retourne la liste des hôtels
4. Système → Administrateur: Affiche la liste des hôtels
5. Administrateur → Système: Sélectionne un hôtel
6. Administrateur → Système: Clique sur "Supprimer"
7. Système → Administrateur: Affiche une confirmation
8. Administrateur → Système: Confirme la suppression
9. Système → API Laravel: DELETE /api/hotels/{id}
10. API Laravel → Système: Supprime l'hôtel de la base de données
11. API Laravel → Système: Retourne un message de succès
12. Système → Administrateur: Met à jour la liste (l'hôtel n'apparaît plus)

---

## 6. ENDPOINTS API REST

### 6.1 Authentification
- POST /api/register - Inscription d'un nouvel utilisateur
- POST /api/login - Connexion d'un utilisateur
- POST /api/logout - Déconnexion (nécessite authentification)

### 6.2 Services (Public)
- GET /api/villes - Liste des villes
- GET /api/hotels - Liste des hôtels (avec filtre ville)
- GET /api/restaurants - Liste des restaurants (avec filtre ville)
- GET /api/stades - Liste des stades (avec filtre ville)
- GET /api/lieu-places - Liste des lieux (avec filtre ville)
- GET /api/plan-tours - Liste des plans de voyage (avec filtre ville)
- GET /api/plan-tours/{id} - Détails d'un plan de voyage
- GET /api/service-locals - Liste des services locaux (avec filtre ville)
- GET /api/transports - Liste des transports
- GET /api/urgence-phonens - Liste des numéros d'urgence
- GET /api/commentaires - Liste des commentaires (avec filtres service_type, service_id)
- POST /api/commentaires - Ajouter un commentaire
- POST /api/reservation - Envoyer une réservation
- GET /api/chat-context - Contexte pour le chatbot

### 6.3 Services Admin (Nécessitent authentification)
- POST /api/hotels - Créer un hôtel
- DELETE /api/hotels/{id} - Supprimer un hôtel
- POST /api/restaurants - Créer un restaurant
- DELETE /api/restaurants/{id} - Supprimer un restaurant
- GET /api/user - Informations de l'utilisateur connecté

---

## 7. TECHNOLOGIES UTILISÉES

### 7.1 Backend
- **Framework**: Laravel 11 (PHP)
- **Base de données**: SQLite (développement), MySQL (production)
- **Authentification**: Laravel Sanctum
- **API**: RESTful
- **Email**: Laravel Mail

### 7.2 Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **Animations**: GSAP
- **Carousel**: Swiper
- **Internationalisation**: react-i18next
- **Icons**: Lucide React, Font Awesome
- **AI**: Groq API (Llama 3.3-70b-versatile)

### 7.3 Déploiement
- **Backend**: Render.com / InfinityFree
- **Frontend**: Vercel / Netlify
- **Base de données**: MySQL (InfinityFree)

---

## 8. CONCLUSION

Ce document présente une vue complète du système MoroVista, incluant :
- La structure des données (MCD)
- Les acteurs du système
- Les cas d'utilisation détaillés
- Les scénarios de diagrammes de séquence
- Les endpoints API

Ces informations permettent de créer les diagrammes UML nécessaires pour la documentation du PFE (Projet de Fin d'Études).
