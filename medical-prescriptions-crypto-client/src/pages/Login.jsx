import { use, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { Container, Stack, Box, Card, Typography, CardContent, TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, AccountCircle } from '@mui/icons-material';
import ThemeMaterialUI from '../components/ThemeMaterialUI.js';
import Navbar from '../components/navbar/Navbar.jsx';
import ButtonsMod from '../components/layout/ButtonsMod.jsx';

import '../css/login/login.css';
import background from '../img/background.jpg';
import logo from '../img/virus2.svg';

import Auth from '../services/auth/auth';
import { useAlert } from '../context/Alert/AlertContext.jsx';
import { useAuth } from '../context/Auth/AuthContext.jsx';
import { extractDerivedKey, generateAndSaveKeys } from '../services/crypto/patient.keys.service.js';
import Patient from '../services/patient/patient.js';
import { deriveAESKey } from '../services/crypto/crypto.utils.js';
import { fromBase64 } from '../services/crypto/file.utils.js';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const { login, auth } = useAuth();
  const { showAlert } = useAlert();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await Auth.login(formData);
    if(data.status >= 400) {
      if(data.errors) {
        const errorValidation = Object.values(data.errors)[0];
        showAlert(errorValidation, 'error');
      }

      else {
        showAlert(data.message, 'error');
      }
      return;
    }

    login(data);
    if(data.rol === 'ADMIN') {
      navigate('/home-admin');
    } else if(data.rol === 'MEDICO') {
      navigate('/home-medic');
    } else if(data.rol === 'FARMACEUTICO') {
      navigate('/home-pharmacist');
    } else if(data.rol === 'PACIENTE') {

      let privateKeyBase64;
      if(data.keys) {
        const { encryptedKey } = await Patient.getPrivateKey(data.userId, data.token);
        privateKeyBase64 = encryptedKey;
      }

      else {
        privateKeyBase64 = await generateAndSaveKeys(data.userId, formData.password, data.nombre, data.token);
        console.log('Generando llaves');
      }

      extractDerivedKey(privateKeyBase64, formData.password);
      navigate('/home-patient');
    }
    else {
      showAlert('Rol no reconocido', 'error');
      return;
    }
    showAlert(data.message, 'success');
  };
  
  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Navbar/>
      <Box sx={{
          width: '100%',
          height: '100vh',
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Card sx= {{ width: { xs: '70%', md: '40%'}, padding: '4%'}}>
            <CardContent>
              <Stack direction='row'>
                <div className='login-div'/>
                <Stack direction='column'>
                  <div className='login-logo-div'>
                    <img src={logo} alt='Logo' className='login-logo'/>
                  </div>
                  <Typography fontSize='3rem' fontWeight='800' >
                    Login
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>

            <CardContent>
              <Stack direction='column' sx= {{ marginTop: '30px', marginBottom: '30px'  }}>
                <div className='login-matricula-div'>
                  <TextField
                    sx={{ width: '100%' }}
                    required
                    variant='outlined'
                    label='Correo electrónico'
                    placeholder='Ej. user@example.com'
                    onChange={handleChange}
                    autoComplete='off'
                    name='email'
                    value={formData.email}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>

                <div className='login-matricula-div'>
                  <TextField
                    sx= {{ width: '100%' }}
                    required
                    variant='outlined'
                    type={showPassword ? 'text' : 'password'}
                    label='Contraseña'
                    placeholder='Ingresa tu contraseña'
                    onChange={handleChange}
                    name='password'
                    autoComplete='off'
                    value={formData.password}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge='end'
                              aria-label='mostrar/ocultar contraseña'
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>
              </Stack>

              <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                <ButtonsMod
                  variant='principal'
                  textCont='Login'
                  width='100%'
                  height='2.5rem'
                  clickEvent={handleSubmit}
                  type='submit'
                />
              </Box>

            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Login;