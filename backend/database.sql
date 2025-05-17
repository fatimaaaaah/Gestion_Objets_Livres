CREATE TABLE Utilisateurs(
	idutilisateur SERIAL PRIMARY KEY,
	nom varchar(255),
	prenom varchar(255),
	email varchar(255),
	mot_de_passe varchar(255)
);


CREATE TABLE IF NOT EXISTS livres (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    auteur VARCHAR(255),
    rating DECIMAL(3,1),
    nombre_pages INTEGER NOT NULL,
    fichier VARCHAR(255),
    idutilisateur INTEGER NOT NULL,
    date_ajout TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_utilisateur FOREIGN KEY (idutilisateur) 
        REFERENCES Utilisateurs(idutilisateur) ON DELETE CASCADE
);

-- Ajouter la contrainte de clé étrangère
ALTER TABLE livres
ADD CONSTRAINT fk_utilisateur
FOREIGN KEY (idutilisateur)
REFERENCES Utilisateurs(idutilisateur)
ON DELETE CASCADE;
