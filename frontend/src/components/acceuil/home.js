import React, { useState, useEffect } from 'react';
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  TextField,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  GetApp,
} from '@mui/icons-material';
import logoImage from '../../image/51.png';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import StarIcon from '@mui/icons-material/Star';

const bookTypes = [
  'Fiction',
  'Loupgarous',
  'Roman',
  'Science',
  'Histoire',
  'Fantastique',
  'Biographie',
  'Philosophie',
  'Poésie',
  'Aventure',
  'Policier',
  'Thriller',
  'Jeunesse',
  'Manga',
  'Développement',
  'Religion',
  'Économie',
  'Informatique',
  'Psychologie',
  'Art'
];


const typeColors = {
  Fiction: '#ffcc80',
  Loupgarous: '#90caf9',
  Roman: '#a5d6a7',
  Science: '#ce93d8',
  Histoire: '#f48fb1',
  Fantastique: '#b39ddb',
  Biographie: '#ffe082',
  Philosophie: '#bcaaa4',
  Poésie: '#80cbc4',
  Aventure: '#ffab91',
  Policier: '#ef9a9a',
  Thriller: '#c5e1a5',
  Jeunesse: '#81d4fa',
  Manga: '#f8bbd0',
  Développement: '#b0bec5',
  Religion: '#d7ccc8',
  Économie: '#dcedc8',
  Informatique: '#aed581',
  Psychologie: '#ffecb3',
  Art: '#f3e5f5',
};

const Home = () => {
  const [books, setBooks] = useState([]);
  const [nbAuthor, setNbAuthor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('view');
  const [currentBook, setCurrentBook] = useState(null);
  const userId = localStorage.getItem('userId');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    description: '',
    page: '',
    author: '',
    rating: '',
    fichier: null,
  });
  const [selectedFileName, setSelectedFileName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  // Charger les livres au montage du composant
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/livres");
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des livres');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
      showSnackbar('Erreur lors du chargement des livres', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, fichier: file });
      setSelectedFileName(file.name);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onAddBooks = async (e) => {
    e.preventDefault();

    // Validation côté client
    if (!formData.nom || !formData.type || !formData.page || !userId) {
      showSnackbar('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('auteur', formData.author); 
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('nombre_pages', formData.page); 
      formDataToSend.append('idutilisateur', userId);

      if (formData.fichier) {
        formDataToSend.append('fichier', formData.fichier);
      }

      // Debug
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await fetch("http://localhost:5000/livres", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Erreur lors de l'ajout");
      }

      const data = await response.json();
      showSnackbar('Livre ajouté avec succès!', 'success');
      fetchBooks();
      closeAddDialog();
    } catch (err) {
      console.error('Erreur complète:', err);
      showSnackbar(err.message || "Erreur lors de la communication avec le serveur", 'error');
    }
  };

  const handleSave = async () => {
    try {
      // Préparer les données à envoyer
      const updatedBook = {
        nom: currentBook.nom,
        type: currentBook.type,
        description: currentBook.description,
        auteur: currentBook.auteur,
        rating: currentBook.rating ? parseFloat(currentBook.rating) : null,  // convertir en float
        nombre_pages: currentBook.nombre_pages ? parseInt(currentBook.nombre_pages, 10) : null, // convertir en int
      };
  
    
      if (!updatedBook.nom || !updatedBook.type || !updatedBook.nombre_pages) {
        alert("Les champs 'Titre', 'Type' et 'Nombre de pages' sont obligatoires");
        return;
      }
      if (isNaN(updatedBook.nombre_pages)) {
        alert("Le champ 'Nombre de pages' doit être un nombre valide");
        return;
      }
      if (updatedBook.rating !== null && isNaN(updatedBook.rating)) {
        alert("Le champ 'Note' doit être un nombre valide");
        return;
      }
  
      // Envoi de la requête PUT au backend
      const response = await fetch(`http://localhost:5000/livres/${currentBook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
      });
  
      if (!response.ok) {
        // Si erreur, on récupère le message d’erreur
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }
      
      await fetchBooks();
      const data = await response.json();
      closeDialog();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du livre', error);
      alert(`Erreur lors de la mise à jour : ${error.message}`);
    }
  };
  const handleUpdate = () => {
    if (!currentBook.nom || currentBook.nombre_pages <= 0) {
      alert("Veuillez remplir correctement les champs.");
      return;
    }
  
    fetch(`http://localhost:5000/livres/${currentBook.id}`, {  // <- ici on utilise currentBook.id
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentBook),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la mise à jour');
        return res.json();
      })
      .then((updatedBook) => {
        setBooks((prevBooks) =>
          prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
        );
        closeDialog();
      })
      .catch((error) => {
        alert("Erreur: " + error.message);
      });
  };
  
  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/livres/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      showSnackbar('Livre supprimé avec succès', 'success');
      fetchBooks(); // Rafraîchir la liste
    } catch (error) {
      console.error(error);
      showSnackbar('Erreur lors de la suppression du livre', 'error');
    }
  };

  const openDialog = (mode, book) => {
    setDialogMode(mode);
    setCurrentBook(book);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentBook(null);
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
    setFormData({
      nom: '',
      type: '',
      description: '',
      author: '',
      rating: '',
      page: '',
      fichier: null,
    });
    setSelectedFileName('');
  };

  const filteredBooks = filterType
    ? books.filter(book => book.type === filterType)
    : books;

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#242423' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" href="/">
            <img src={logoImage} alt="Logo" style={{ height: 50, width: 100 }} />
          </IconButton>

          <Typography variant="h6" sx={{ color: 'white', ml: 2 }}>
            BookNest
          </Typography>
          <Box sx={{ flexGrow: 30}} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountCircleIcon sx={{ color: 'white' }} />
            <Typography variant="body1" sx={{ color: 'white' }}>
              {userEmail}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
          </Box>
          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        
          {/* Bouton de déconnexion */}
          <Box>
          <IconButton
            color="inherit"
            onClick={() => {
              localStorage.clear(); // Supprimer les données utilisateur
              window.location.href = '/acceuil'; // Rediriger vers la page d'accueil
            }}
          >
            <LogoutIcon />
          </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={15}>
          <Grid item xs={3}>
            <Card style={{ border: '1px solid #F3BB00', borderRadius: '10px' }}>
              <CardContent>
                <Typography variant="h5" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                <MenuBookIcon style={{ marginRight: '10px' }} />
                  Nombres de livres
                </Typography>
                <Typography variant="h3" style={{ fontSize: '2rem' }}>{books.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ border: '1px solid #F3BB00', borderRadius: '10px' }}>
              <CardContent>
                <Typography variant="h5" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                <PersonIcon style={{ marginRight: '10px' }} />
                  Nombres d'auteurs
                </Typography>
                <Typography variant="h3" style={{ fontSize: '2rem' }}>{books.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ border: '1px solid #F3BB00', borderRadius: '10px' }}>
              <CardContent>
                <Typography variant="h5" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                <StarIcon style={{ marginRight: '10px', color: 'black' }} />
                  Livres populaires
                </Typography>
                <Typography variant="h3" style={{ fontSize: '2rem' }}>75%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ border: '1px solid #F3BB00', borderRadius: '10px' }}>
              <CardContent>
                <Typography variant="h5" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                <LibraryAddCheckIcon style={{ marginRight: '10px' }} />
                  Livres récement ajoutés
                </Typography>
                <Typography variant="h3" style={{ fontSize: '2rem' }}>1</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Liste des livres
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Select
              sx={{ minWidth: 180 }}
              displayEmpty
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              size="small"
            >
              <MenuItem value="">Tous les types</MenuItem>
              {bookTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              onClick={() => setAddDialogOpen(true)}
              style={{ backgroundColor: "#F3BB00", color: "white" }}
            >
              Ajouter un livre
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Titre</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Auteur</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Nb Pages</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.nom}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: typeColors[book.type] || '#e0e0e0',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: 'inline-block',
                        }}
                      >
                        {book.type}
                      </Box>
                    </TableCell>
                    <TableCell>{book.auteur}</TableCell>
                    <TableCell>{book.rating}</TableCell>
                    <TableCell>{book.nombre_pages}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => openDialog('view', book)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => openDialog('edit', book)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteBook(book.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Dialog Ajout */}
        <Dialog open={addDialogOpen} onClose={closeAddDialog} fullWidth maxWidth="sm">
          <DialogTitle>Ajouter un livre</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                name="nom"
                label="Titre"
                placeholder="Entrez le nom du livre"
                value={formData.nom}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  required: false, // désactive l'affichage de l'étoile
                }}
                required
                sx={{
                  '& label.Mui-focused': {
                    color: '#F3BB00', // couleur du label au focus
                  },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#F3BB00', // couleur de la bordure au focus
                    },
                  },
                }}
              />

              <Select
                name="type"
                label="Type"
                value={formData.type}
                onChange={handleInputChange}
                displayEmpty
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  required: false, // désactive l'affichage de l'étoile
                }}
                required
                
              >
                <MenuItem value="">Sélectionnez un type</MenuItem>
                {bookTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                name="description"
                label="Description"
                placeholder="Entrez le résumé"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                required
                multiline
                InputLabelProps={{
                  shrink: true,
                  required: false, // désactive l'affichage de l'étoile
                }}
                rows={3}
                sx={{
                  '& label.Mui-focused': {
                    color: '#F3BB00', // couleur du label au focus
                  },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#F3BB00', // couleur de la bordure au focus
                    },
                  },
                }}
              />
              <TextField
                name="author"
                label="Auteur"
                placeholder="Entrez le nom de l'auteur"
                value={formData.author}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  required: false, // désactive l'affichage de l'étoile
                }}
                required
                sx={{
                  '& label.Mui-focused': {
                    color: '#F3BB00', // couleur du label au focus
                  },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#F3BB00', // couleur de la bordure au focus
                    },
                  },
                }}
              />
              <TextField
                name="rating"
                label="Note"
                type="number"
                placeholder="Entrez la note (0-5)"
                value={formData.rating}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                  required: false, // désactive l'affichage de l'étoile
                }}
                fullWidth
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                sx={{
                  '& label.Mui-focused': {
                    color: '#F3BB00', // couleur du label au focus
                  },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#F3BB00', // couleur de la bordure au focus
                    },
                  },
                }}
              />

              <TextField
              
                name="page"
                label="Nombre de pages"
                type="number"
                placeholder="Entrez le nombre de pages"
                value={formData.page}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                  required: false, // désactive l'affichage de l'étoile
                }}
                inputProps={{ min: 0, }}
                sx={{
                  '& label.Mui-focused': {
                    color: '#F3BB00', // couleur du label au focus
                  },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#F3BB00', // couleur de la bordure au focus
                    },
                  },
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Fichier PDF :
            </Typography>

            <Button
              variant="contained"
              component="label"
              sx={{ mt: 1, backgroundColor: "black", color: "white" }}
            >
              Sélectionner un fichier
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                hidden
              />
            </Button>

            {selectedFileName && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Fichier sélectionné : {selectedFileName}
              </Typography>
            )}

            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={closeAddDialog} color="inherit">
              Annuler
            </Button>
            <Button
              onClick={onAddBooks}
              variant="contained"
              style={{
                backgroundColor: "#F3BB00",
                color: "white",
              }}
            >
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog View/Edit */}
        <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            {dialogMode === 'view' ? 'Détails du livre' : 'Modifier le livre'}
          </DialogTitle>
          <DialogContent>
            {currentBook && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                  label="Titre"
                  value={currentBook.nom}
                  onChange={(e) =>
                    setCurrentBook({ ...currentBook, nom: e.target.value })
                  }
                  sx={{
                    '& label.Mui-focused': {
                      color: '#F3BB00', // couleur du label au focus
                    },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#F3BB00', // couleur de la bordure au focus
                      },
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    required: false, // désactive l'affichage de l'étoile
                  }}
                  fullWidth
                  disabled={dialogMode === 'view'}
                />

                <Select
                  label="Type"
                  value={currentBook.type}
                  fullWidth
                  displayEmpty
                  onChange={(e) =>
                    setCurrentBook({ ...currentBook, type: e.target.value })
                  }
                  sx={{
                    '& label.Mui-focused': {
                      color: '#F3BB00', // couleur du label au focus
                    },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#F3BB00', // couleur de la bordure au focus
                      },
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    required: false, // désactive l'affichage de l'étoile
                  }}
                  disabled={dialogMode === 'view'}
                >
                  <MenuItem value="">Sélectionnez un type</MenuItem>
                {bookTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}

                </Select>

                <TextField
                  label="Description"
                  value={currentBook.description}
                  fullWidth
                  onChange={(e) =>
                    setCurrentBook({ ...currentBook, description: e.target.value })
                  }
                  sx={{
                    '& label.Mui-focused': {
                      color: '#F3BB00', // couleur du label au focus
                    },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#F3BB00', // couleur de la bordure au focus
                      },
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    required: false, // désactive l'affichage de l'étoile
                  }}
                  multiline
                  rows={3}
                  disabled={dialogMode === 'view'}
                />
                <TextField
                  type="number"
                  label="Nombre de pages"
                  value={currentBook.nombre_pages}
                  fullWidth
                  onChange={(e) =>
                    setCurrentBook({ ...currentBook, nombre_pages: e.target.value })
                  }
                  sx={{
                    '& label.Mui-focused': {
                      color: '#F3BB00', // couleur du label au focus
                    },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#F3BB00', // couleur de la bordure au focus
                      },
                    },
                  }}
                  inputProps={{ min: 1 }}
                  error={currentBook.nombre_pages <= 0}
                  helperText={
                    currentBook.nombre_pages <= 0
                      ? "Le nombre de pages doit être supérieur à 0"
                      : ""
                  }
                 
                  InputLabelProps={{
                    shrink: true,
                    required: false, // désactive l'affichage de l'étoile
                  }}
                  disabled={dialogMode === 'view'}
                />

                <TextField
                  label="Auteur"
                  value={currentBook.auteur}
                  fullWidth
                  onChange={(e) =>
                    setCurrentBook({ ...currentBook, auteur: e.target.value })
                  }
                  sx={{
                    '& label.Mui-focused': {
                      color: '#F3BB00', // couleur du label au focus
                    },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#F3BB00', // couleur de la bordure au focus
                      },
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    required: false, // désactive l'affichage de l'étoile
                  }}
                  disabled={dialogMode === 'view'}
                />
                <TextField
                  type="number"
                  label="Note"
                  value={currentBook.rating}
                  fullWidth
                  onChange={(e) =>
                    setCurrentBook({ ...currentBook, rating: e.target.value })
                  }
                  inputProps={{ min: 0, max: 10, step: 1 }}
                  error={currentBook.rating < 0 || currentBook.rating > 10}
                  helperText={
                    currentBook.rating < 0 || currentBook.rating > 10
                      ? "La note doit être comprise entre 0 et 10"
                      : ""
                  }
                  sx={{
                    '& label.Mui-focused': {
                      color: '#F3BB00', // couleur du label au focus
                    },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#F3BB00', // couleur de la bordure au focus
                      },
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                    required: false, // désactive l'affichage de l'étoile
                  }}
                  disabled={dialogMode === 'view'}
                />

              {dialogMode === 'view' && currentBook.fichier && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Fichier PDF :
                </Typography>
                <Button
                variant="contained"
                startIcon={<GetApp />}
                href={`http://localhost:5000/uploads/${currentBook.fichier}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1 }}
                style={{
                  backgroundColor: "#F3BB00",
                  color: "white",
                }}
              >
              Télécharger
            </Button>
            </Box>
            )}
              {dialogMode === 'edit' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Fichier PDF :
              </Typography>

              {currentBook.fichierFile ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Nouveau fichier sélectionné : {currentBook.fichierFile.name}
            </Typography>
              ) : currentBook.fichier ? (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Fichier actuel : {currentBook.fichier}
                </Typography>
              ) : null}


            <Button
              variant="contained"
              component="label"
              sx={{ mt: 1, backgroundColor: "#F3BB00", color: "white" }}
            >
              Choisir un fichier
              <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setCurrentBook(prevBook => ({ ...prevBook, fichierFile: file }));
                }
                e.target.value = null; // reset pour pouvoir sélectionner le même fichier plusieurs fois
                }}
              />

            </Button>
          </Box>
        )}

      

         </Box>
         )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}
            style={{
              backgroundColor: "black",
              color: "white",
            }}
            >Fermer</Button>
             {dialogMode === 'edit' && (
                <Button
                  onClick={handleUpdate}  // <-- ici la fonction d'update
                  variant="contained"
                  style={{
                    backgroundColor: "#F3BB00",
                    color: "white",
                  }}
           
              >
                Enregistrer
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Snackbar pour les notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Home;