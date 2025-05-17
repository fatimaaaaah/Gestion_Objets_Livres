import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import image1 from "../../image/4.jpg";
import avatarImage from "../../image/5.jpg";

const SignUp = () => {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [conditions, setConditions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (!nom || !prenom || !email || !mot_de_passe || !confirmPassword) {
      setErrorMessage("Tous les champs sont obligatoires.");
      setOpenSnackbar(true);
      return;
    }

    if (!conditions) {
      setErrorMessage("Vous devez accepter les conditions d'utilisation.");
      setOpenSnackbar(true);
      return;
    }

    if (mot_de_passe !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setOpenSnackbar(true);
      return;
    }

    if (!validatePassword(mot_de_passe)) {
      setErrorMessage(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      setOpenSnackbar(true);
      return;
    }

    try {
      const body = { nom, prenom, email, mot_de_passe };
      const response = await fetch("http://localhost:5000/utilisateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setErrorMessage(data.error || "Erreur lors de l'inscription. Veuillez réessayer.");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error(err.message);
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const paperStyle = {
    padding: "30px 20px",
    width: 450,
    minHeight: 450,
    margin: "20px auto",
    borderRadius: "10px",
  };

  const marginTop = { marginTop: 10 };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid
        item
        sx={{
          width: "50vh",
          height: "100vh",
          backgroundImage: `url(${image1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          flex: 1,
          zIndex: -1,
        }}
      />
      <Grid item xs={12} sm={8} md={5} style={{ overflowY: "auto", height: "100vh", padding: "10px" }}>
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
            <Typography variant="h6" style={{ margin: "10px 0" }}>
              Inscription
            </Typography>
          </Grid>

          <form onSubmit={onSubmitForm}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  placeholder="Entrez votre nom"
                  margin="normal"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                    required: false, 
                  }}
                  required
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  placeholder="Entrez votre prénom"
                  margin="normal"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                    required: false, // désactive l'affichage de l'étoile
                  }}
                  required
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  placeholder="Entrez votre email"
                  margin="normal"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                    required: false, // désactive l'affichage de l'étoile
                  }}
                  required
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe"
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  value={mot_de_passe}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                    required: false, // désactive l'affichage de l'étoile
                  }}
                  required
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
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirmer le mot de passe"
                  placeholder="Confirmez votre mot de passe"
                  margin="normal"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                    required: false, 
                  }}
                  required
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
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Checkbox
                  name="conditions"
                  color="primary"
                  checked={conditions}
                  onChange={(e) => setConditions(e.target.checked)}
                  required
                />
              }
              label={<span>J'accepte les conditions d'utilisation</span>}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ ...marginTop, backgroundColor: "black", color: "white" }}
            >
              S'inscrire
            </Button>
          </form>

          <Typography align="center" style={marginTop}>
            Déjà un compte ?{" "}
            <Link
              onClick={() => navigate("/login")}
              style={{
                cursor: "pointer",
                color: "#F3BB00",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Se connecter
            </Link>

          </Typography>
        </Paper>
      </Grid>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default SignUp;
