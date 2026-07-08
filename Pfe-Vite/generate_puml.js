import encoder from 'plantuml-encoder';

const puml = `
@startuml
left to right direction
skinparam packageStyle rectangle
skinparam usecase {
  BackgroundColor White
  BorderColor Black
}

actor "Visiteur" as Visiteur
actor "Guide" as Guide
actor "Prestataire" as Prestataire
actor "Admin" as Admin

' Force strict vertical order
Visiteur -[hidden]right- Guide
Guide -[hidden]right- Prestataire
Prestataire -[hidden]right- Admin

' Inheritance arrows pointing UP to Visiteur
Guide -left-|> Visiteur
Prestataire -left-|> Visiteur
Admin -left-|> Visiteur

' Visiteur Use Cases
usecase "Naviguer sur la plateforme" as UC_V1
usecase "Consulter les services" as UC_V2
usecase "Utiliser les outils (Météo...)" as UC_V3
usecase "Interagir avec Chatbot" as UC_V4
usecase "Gérer ses Favoris" as UC_V5
usecase "Laisser un commentaire" as UC_V6

Visiteur --> UC_V1
Visiteur --> UC_V2
Visiteur --> UC_V3
Visiteur --> UC_V4
Visiteur --> UC_V5

' Force UC_V6 to stay in the same rank to prevent messing up the tree depth
Visiteur -[hidden]-> UC_V6
UC_V2 -[hidden]right- UC_V6
UC_V6 .left.> UC_V2 : <<extend>>

' Guide Use Cases
usecase "Accéder Dashboard Guide" as UC_G1
usecase "Créer des Plans de Voyage" as UC_G2
usecase "Suivre l'état de ses plans" as UC_G3
usecase "Gérer son profil Guide" as UC_G4

Guide --> UC_G1
Guide --> UC_G2
Guide --> UC_G3
Guide --> UC_G4

' Prestataire Use Cases
usecase "Accéder Dashboard Prestataire" as UC_P1
usecase "Soumettre un Service Local" as UC_P2
usecase "Suivre l'état de son service" as UC_P3
usecase "Gérer profil Prestataire" as UC_P4

Prestataire --> UC_P1
Prestataire --> UC_P2
Prestataire --> UC_P3
Prestataire --> UC_P4

' Admin Use Cases
usecase "Accéder Dashboard Admin" as UC_A1
usecase "Consulter les Statistiques" as UC_A2
usecase "Valider/Refuser les services" as UC_A3
usecase "Gérer le contenu (CRUD)" as UC_A4
usecase "Gérer les utilisateurs" as UC_A5

Admin --> UC_A1
Admin --> UC_A2
Admin --> UC_A3
Admin --> UC_A4
Admin --> UC_A5

' Auth bubble placed far to the right
usecase "S'authentifier" as Auth

' Push Auth to the right of other use cases
UC_V5 -[hidden]-> Auth
UC_V6 -[hidden]-> Auth
UC_G4 -[hidden]-> Auth
UC_P4 -[hidden]-> Auth
UC_A5 -[hidden]-> Auth

Visiteur ..> Auth
Guide ..> Auth
Prestataire ..> Auth
Admin ..> Auth

@enduml
`;

const encoded = encoder.encode(puml);
const url = 'http://www.plantuml.com/plantuml/png/' + encoded;
console.log(url);
