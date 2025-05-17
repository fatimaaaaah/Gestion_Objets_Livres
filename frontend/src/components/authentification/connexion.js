import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import image1 from "../../image/1.jpg";
import avatarImage from "../../image/5.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    if (!email) {
      newErrors.email = "L'email est requis.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "L'email est invalide.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleForgotPassword = () => {
    setOpenDialog(true);
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetError("Veuillez entrer un email.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Un email de réinitialisation a été envoyé.");
        setOpenDialog(false);
      } else {
        setResetError(data.error || "Erreur lors de l'envoi.");
      }
    } catch (err) {
      setResetError("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mot_de_passe: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Stockez l'ID de l'utilisateur dans le localStorage
        localStorage.setItem('userId', data.utilisateur.idutilisateur);
        // Stockez également d'autres infos si nécessaire
        localStorage.setItem('userEmail', data.utilisateur.email);
        localStorage.setItem('userName', data.utilisateur.nom);
        
        navigate("/home");
      } else {
        setErrors({
          ...errors,
          general: data.error || "Email ou mot de passe incorrect",
        });
      }
    } catch (err) {
      console.error(err.message);
      setErrors({
        ...errors,
        general: "Erreur de connexion au serveur",
      });
    }
  }
};
  const paperStyle = {
    padding: "30px 20px",
    width: 400,
    minHeight: 450,
    margin: "20px auto",
    borderRadius: "10px",
  };

  const marginTop = { marginTop: 10 };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        sx={{
          width: "500px",
          height: "100vh",
          backgroundImage: `url(${image1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          flex: 1,
          zIndex: -1,
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        style={{ overflowY: "auto", height: "100vh", padding: "10px" }}
      >
        <Paper elevation={3} style={paperStyle}>
          <Grid align="center">
            <Box
              style={{
                width: 100,
                height: 70,
                margin: "0 auto 10px",
                backgroundImage: `url(${avatarImage})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
            <Typography variant="h5" style={{ margin: "10px 0" }}>
              Connexion
            </Typography>
          </Grid>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              placeholder="Entrez votre email"
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              InputLabelProps={{
                shrink: true,
                required: false, // désactive l'affichage de l'étoile
              }}
              helperText={errors.email}
              sx={{
                '& label.Mui-focused': {
                  color: 'black',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              InputLabelProps={{
                shrink: true,
                required: false, // désactive l'affichage de l'étoile
              }}
              helperText={errors.password}
              sx={{
                '& label.Mui-focused': {
                  color: 'black',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.general && (
              <Typography color="error" align="center" style={marginTop}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{
                ...marginTop,
                backgroundColor: "black",
                color: "white",
              }}
            >
              Se connecter
            </Button>
          </form>
          <Typography align="center" style={marginTop}>
            Mot de passe{" "}
            <Link
              href="#"
              onClick={handleForgotPassword}
              style={{ cursor: "pointer", color: "#F3BB00", textDecoration: "none", }}
            >
              oublié ?
            </Link>
          </Typography>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Entrez votre email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                error={!!resetError}
                helperText={resetError}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Annuler
              </Button>
              <Button onClick={handleResetPassword} color="primary">
                Envoyer l'email
              </Button>
            </DialogActions>
          </Dialog>

          <Typography align="center" style={marginTop}>
            Pas encore de compte ?{" "}
            <Link
              href="#"
              onClick={() => navigate("/signUp")}
              style={{ cursor: "pointer", color: "#F3BB00", textDecoration: "none", }}
            >
              S'inscrire
            </Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
