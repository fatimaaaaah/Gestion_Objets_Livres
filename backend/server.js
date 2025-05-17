require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Configuration CORS unique
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.urlencoded({ extended: true }));
// Middleware
app.use(express.json()); // Pour parser les requêtes JSON

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Création du dossier uploads
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log(`Dossier ${uploadsDir} créé !`);
}

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes pour les livres
// GET tous les livres ou par type
app.get('/livres', async (req, res) => {
  const { type } = req.query;
  try {
    const query = type
      ? 'SELECT * FROM livres WHERE type = $1'
      : 'SELECT * FROM livres';
    const values = type ? [type] : [];
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
const jwtSecret = process.env.JWT_SECRET || 'secret_key';

app.post("/login", async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const user = await pool.query(
      "SELECT * FROM utilisateurs WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Aucun utilisateur trouvé avec cet email." });
    }

    const isValidPassword = await bcrypt.compare(mot_de_passe, user.rows[0].mot_de_passe);

    if (!isValidPassword) {
      return res.status(400).json({ error: "Mot de passe incorrect." });
    }

    // Générer un token JWT avec un payload simplifié
    const utilisateur = user.rows[0];
    const token = jwt.sign(
      { id: utilisateur.id, email: utilisateur.email },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: "Connexion réussie", utilisateur, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST - Ajouter un livre avec fichier
app.post('/livres', upload.single('fichier'), async (req, res) => {
  try {
    console.log('Données reçues:', req.body);

    // Extraction avec compatibilité ascendante
    const {
      nom,
      type,
      description = '',
      auteur = req.body.author || '', 
      rating,
      nombre_pages = req.body.page || req.body.nombre_pages, 
      idutilisateur
    } = req.body;

    // Validation
    const missingFields = [];
    if (!nom) missingFields.push('nom');
    if (!type) missingFields.push('type');
    if (!nombre_pages) missingFields.push('nombre_pages/page');
    if (!idutilisateur) missingFields.push('idutilisateur');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Champs manquants',
        missingFields,
        received: req.body
      });
    }

    const newBook = await pool.query(
      `INSERT INTO livres 
       (nom, type, description, auteur, rating, nombre_pages, fichier, idutilisateur) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        nom,
        type,
        description,
        auteur,
        rating ? parseFloat(rating) : null,
        parseInt(nombre_pages),
        req.file ? req.file.filename : null,
        idutilisateur
      ]
    );

    res.status(201).json(newBook.rows[0]);
  } catch (error) {
    console.error('Erreur détaillée:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});
// Route pour la connexion

// app.post('/livres', upload.single('fichier'), async (req, res) => {
//   try {
//     // Extraction avec compatibilité ascendante
//     const {
//       nom,
//       type,
//       description = '',
//       auteur = req.body.author || '', // Accepte 'author' comme alias
//       rating,
//       nombre_pages = req.body.page || req.body.nombre_pages, // Accepte les deux formats
//       idutilisateur
//     } = req.body;

//     // Validation
//     if (!nom || !type || !nombre_pages || !idutilisateur) {
//       return res.status(400).json({
//         error: 'Nom, type, nombre de pages et utilisateur sont requis',
//         received: req.body
//       });
//     }

//     const newBook = await pool.query(
//       `INSERT INTO livres 
//        (nom, type, description, auteur, rating, nombre_pages, fichier, idutilisateur) 
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
//       [
//         nom,
//         type,
//         description,
//         auteur,
//         rating ? parseFloat(rating) : null,
//         parseInt(nombre_pages),
//         req.file ? req.file.filename : null,
//         idutilisateur
//       ]
//     );

//     res.status(201).json(newBook.rows[0]);
//   } catch (error) {
//     console.error('Erreur:', error);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });

app.post("/utilisateurs", async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe } = req.body;

    // Vérifier si l'email existe déjà
    const emailExists = await pool.query(
      "SELECT * FROM utilisateurs WHERE email = $1",
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({ error: "Cet email est déjà utilisé. Veuillez utiliser une autre adresse email." });
    }

    // Vérifier si un utilisateur avec le même nom et prénom existe déjà
    const userExists = await pool.query(
      "SELECT * FROM utilisateurs WHERE nom = $1 AND prenom = $2",
      [nom, prenom]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Un utilisateur avec ce nom et prénom existe déjà. Veuillez vérifier vos informations." });
    }

    // Si tout est bon, hacher le mot de passe et insérer le nouvel utilisateur
    const saltRounds = 10;
    const motDePasseHache = await bcrypt.hash(mot_de_passe, saltRounds);
    const newUtilisateur = await pool.query(
      "INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe) VALUES ($1, $2, $3, $4) RETURNING *",
      [nom, prenom, email, motDePasseHache]
    );

    res.json(newUtilisateur.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Une erreur s'est produite lors de l'inscription. Veuillez réessayer plus tard." });
  }
});
// Route pour les livres


// 🔹 PUT - Modifier un livre
app.put('/livres/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, type, description, auteur, rating, nombre_pages } = req.body;

  try {
    const result = await pool.query(
     `UPDATE livres SET 
      nom = $1, type = $2, description = $3, 
      auteur = $4, rating = $5, nombre_pages = $6
      WHERE id = $7 RETURNING *`,
      [nom, type, description, auteur, rating, nombre_pages, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur SQL PUT /livres/:id:', err);
    res.status(500).json({ error: err.message });
  }
});


//  DELETE - Supprimer un livre
app.delete('/livres/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM livres WHERE id = $1', [id]);
    res.json({ message: 'Livre supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Démarrer le serveur
app.listen(5000, () => {
  console.log("Server is running on port 5000");
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }
});
