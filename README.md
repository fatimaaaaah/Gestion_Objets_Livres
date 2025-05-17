#  Gestion des Objets Livres – 2025
À propos
Ce projet permet aux utilisateurs de créer leur propre bibliothèque numérique, de sauvegarder des livres, de faire les opérations CRUD(Create,Read,Update,Delete).De gérer ces livres avec des catégories, de filtrer mais aussi d'avoir une statistiques de la bibliothéque.
Application web complète pour la gestion de livres (ajout, modification, suppression, téléchargement de fichiers), réalisée avec React pour le frontend et Node.js/Express + PostgreSQL pour le backend.

---

 Fonctionnement de l'application
 1. Connexion / Inscription
L'utilisateur peut créer un compte ou se connecter pour accéder aux fonctionnalités de gestion.

 2. Tableau de bord
Une fois connecté, l’utilisateur accède à un tableau de bord présentant les livres enregistrés sous forme de cartes ou de liste.

 3. Ajout d’un livre
Un formulaire permet à l’utilisateur de :

Saisir le titre, l’auteur, le type, la note , etc.

Télécharger éventuellement un fichier joint

 4. Modification ou suppression
Depuis la liste des livres, chaque élément dispose d'actions :

Modifier : affiche un formulaire prérempli

Supprimer : demande confirmation avant suppression

 5. Filtrage et recherche
L’utilisateur peut filtrer les livres par type.
 6. Téléchargement de fichiers PDF associés
 7.  Interface moderne avec Material-UI
---
## Structure du projet 

Gestion_Objets_Livres_2025/
├── backend/              # API Node.js (Express, PostgreSQL/MongoDB)
│   ├── uploads/          # stockage de fichier
    ├── server.js         # fichier des routes backend
│   ├── db.js             # Configuration de la BD
│   └── database.sql      # Schémas des données
├── frontend/             # Interface utilisateur React
│   ├── components/       # Composants réutilisables Pages principales (Accueil, Ajout, etc.)
│          
├── README.md
└── package.json



##  Technologies utilisées

* **Frontend** : React, Material-UI
* **Backend** : Node.js, Express
* **Base de données** : PostgreSQL
* **Stockage des fichiers** :multer pour l'instant 

---

##  Installation

### 1. Cloner le projet

```bash
git clone https://github.com/fatimaaaaah/Gestion_Objets_Livres.git
cd Gestion_Objets_Livres_2025
```

### 2. Installation du frontend

```bash
cd frontend
npm install
```

### 3. Installation du backend

```bash
cd ../backend
npm install
```

> ⚠️ Assurez-vous d’avoir PostgreSQL installé et de créer une base de données (par exemple : `livresdb`).
> Le fichier `db.js` doit contenir vos informations de connexion à la base :

```db
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=livresdb
```

### 4. Démarrer le backend

```bash
npm start
```

Le backend est accessible sur `http://localhost:5000`.

### 5. Démarrer le frontend

```bash
cd ../frontend
npm start
```

Le frontend est accessible sur `http://localhost:3000`.

---

## 🧪 Utilisation

1. Lancer le frontend et le backend.
2. Accédez à `http://localhost:3000`.
3. Ajoutez, modifiez ou supprimez des livres via l’interface.
4. Cliquez sur “Télécharger” pour obtenir les fichiers PDF associés.
5. Authentification

---



##  Autrice

**Fatima Nguenar Diouf**
GitHub : [fatimaaaaah](https://github.com/fatimaaaaah)

---



