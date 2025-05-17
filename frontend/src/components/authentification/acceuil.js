import React, { useState } from 'react';
import {
  Button, Container, Typography, Grid, AppBar, Toolbar, IconButton, Link, Box, TextField, Paper
} from '@mui/material';
import { Brightness4, Brightness7, Book, Search, Group } from '@mui/icons-material';
import logoImage from '../../image/51.png';

const testimonials = [
  {
    name: "Alice Dupont",
    text: "BookNest a complètement changé ma façon de gérer ma bibliothèque personnelle. Facile et intuitif !",
  },
  {
    name: "Jean Martin",
    text: "J'adore la fonctionnalité de recherche rapide, elle me fait gagner un temps fou.",
  },
  {
    name: "Sophie Bernard",
    text: "La communauté est très active, c'est super pour découvrir de nouveaux livres.",
  },
];

const Acceuil = () => {
  const [email, setEmail] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    // Ajoute ici une vraie logique de ThemeProvider si nécessaire
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Logique d’abonnement à la newsletter ici
    alert(`Merci pour votre abonnement : ${email}`);
    setEmail('');
  };

  return (
    <>
      {/* AppBar avec nom et icône de thème */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#242423' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" href="/">
            <img src={logoImage} alt="Logo" style={{ height: 50, width: 100 }} />
          </IconButton>

          <Typography variant="h6" sx={{ color: 'white', ml: 2 }}>
            BookNest
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Bouton pour basculer le thème */}
          <IconButton color="inherit" onClick={handleThemeToggle}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <Container maxWidth="lg" sx={{ marginTop: 5, pb: 8 }}>
        <Typography variant="h2" align="center" gutterBottom color="textPrimary">
          Bienvenue sur BookNest
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Que vous soyez un lecteur passionné, un bibliothécaire ou un gestionnaire de collection,
          BookNest vous offre une plateforme moderne, intuitive et puissante pour organiser,
          retrouver et suivre tous vos livres en un seul endroit.
        </Typography>

        {/* Boutons centrés */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
          <Button
            href="/signup"
            size="large"
            sx={{
              backgroundColor: '#F3BB00',
              color: 'white',
              border: '2px solid white',
              px: 4,
              py: 1.5,
              '&:hover': { backgroundColor: '#d9a400' },
            }}
          >
            S'inscrire
          </Button>
          <Button
            href="/login"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: '#F3BB00',
              border: '2px solid #F3BB00',
              px: 4,
              py: 1.5,
              '&:hover': { backgroundColor: '#f9f9f9' },
            }}
          >
            Se connecter
          </Button>
        </Box>

        {/* Section Fonctionnalités */}
        <Box sx={{ mt: 10 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Nos Fonctionnalités
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Book sx={{ fontSize: 50, color: '#F3BB00' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Catalogue complet
                </Typography>
                <Typography color="textSecondary" sx={{ mt: 1 }}>
                  Gérez vos livres avec des informations détaillées et organisées.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Search sx={{ fontSize: 50, color: '#F3BB00' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Recherche rapide
                </Typography>
                <Typography color="textSecondary" sx={{ mt: 1 }}>
                  Trouvez vos livres en un instant grâce à notre moteur de recherche puissant.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Group sx={{ fontSize: 50, color: '#F3BB00' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Communauté active
                </Typography>
                <Typography color="textSecondary" sx={{ mt: 1 }}>
                  Partagez et découvrez des recommandations avec d'autres passionnés.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Section Avis utilisateurs */}
        <Box sx={{ mt: 10 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Ce que disent nos utilisateurs
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
            {testimonials.map(({ name, text }, i) => (
              <Grid key={i} item xs={12}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    "{text}"
                  </Typography>
                  <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      — {name}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#fff', color: '#000', padding: '40px 0 20px', borderTop: '1px solid #ddd' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="flex-start">
            {/* Newsletter */}
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" gutterBottom>Newsletter</Typography>
                <Typography paragraph sx={{ mb: 2 }}>
                  Abonnez-vous à notre newsletter pour recevoir les dernières actualités...
                </Typography>
                <Box component="form" sx={{ display: 'flex', gap: 1 }} onSubmit={handleSubscribe}>
                  <TextField
                    variant="outlined"
                    placeholder="Entrez votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    size="small"
                    type="email"
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: '#F3BB00',
                      color: 'white',
                      whiteSpace: 'nowrap',
                      px: 3,
                      '&:hover': { backgroundColor: '#d9a400' },
                    }}
                  >
                    S'abonner
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Contact & Adresse */}
            <Grid item xs={12} md={6} container spacing={6}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>Contact</Typography>
                  <Typography sx={{ mb: 1 }}>
                    Email: <Link href="mailto:contact@booknest.com" color="#F3BB00">contact@booknest.com</Link>
                  </Typography>
                  <Typography>Téléphone: +33 1 23 45 67 89</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>Adresse</Typography>
                  <Typography>
                    123 Fann<br />
                    75000 Dakar<br />
                    Sénégal
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Copyright */}
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #ddd', textAlign: 'center' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} BookNest. Tous droits réservés.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Acceuil;
