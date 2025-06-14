import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, Stack, TextField, Box, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
//* Componentes
import PrescriptionData from './PrescriptionData';
import PrescriptionDiagnosis from './PrescriptionDiagnosis';
import PrescriptionTreatment from './PrescriptionTreatment';
import ButtonsMod from '../../layout/ButtonsMod';
import Subtitle from '../../layout/Subtitle';
import { signFile } from '../../../services/eddsa/eddsa.service';

function GeneratePrescription({ setView }) {
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamientoState, setTratamientoState] = useState([]);
  const [privateKey, setPrivateKey] = useState(null);
  const [password, setPassword] = useState('');
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  const inputRef = useRef(null); // Referencia al input de archivo

  const handleClickBoton = () => {
    if (inputRef.current) {
      inputRef.current.click(); // Simula el clic en el input de archivo
    }
  };

  const handleArchivoCargado = (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = () => {
        const contenido = reader.result;
        setPrivateKey(contenido);
        console.log('Contenido del archivo:', contenido);
      };
      reader.readAsText(archivo);
    }
  };

  const handleGenerateAndSign = async () => {
    if (!privateKey) {
      alert('Por favor, carga tu clave privada antes de generar la receta.');
      return;
    }

    setOpenPasswordDialog(true);
  };

  const handlePasswordSubmit = async () => {
    const fechaEmision = new Date().toISOString().split('T')[0];

    const tratamiento = tratamientoState.map(({id, ...rest}) => rest);

    const receta = {
      id_paciente: '78df21a8-48ab-456e-93ea-b9c965033444',
      id_medico: '0e4e1348-4637-40c9-a94f-07a53a837bb1',
      fechaEmision,
      diagnostico,
      tratamiento: tratamiento,
    };

    const jsonBuffer = new TextEncoder().encode(JSON.stringify(receta));
    
    try {
      const signature = await signFile(jsonBuffer, privateKey, password);
      console.log('Firma generada:', signature);
      const recetaFirmada = {
        ...receta,
        firma_medico: signature.base64,
      };

      console.log('Json que se envía al backend:', recetaFirmada);
      setPassword(''); // Limpiar la contraseña después de usarla
      alert('Receta generada y firmada exitosamente');
    } catch (error) {
      alert('Error al firmar la receta: ' + error.message);
    }

  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: { md: '80%', xs: '100%' }, padding: '2%' }}>
        <IconButton onClick={() => setView('buscar')} sx={{ alignSelf: 'flex-start' }}>
          <ArrowBack />
        </IconButton>

        <CardHeader title='Generar receta' />
        <CardContent>
          {/* Datos generales ---------------------- */}
          <Stack direction="column" sx={{ marginBottom: '30px' }}>
            <Subtitle subtitulo='Datos generales'/>
            <PrescriptionData
              matricula="202249885"
              nombrePaciente="Aarón Reyes"
              fechaNacimiento="23/01/2003"
              sexo="Masculino"
              fechaEmision="11/06/2025"
              nombreMedico="Paolina Olvera"
              clinica="Clínica de Iztapalacra"
              especialidad="Alta especialidad"
              cedula="299309403"
            />
          </Stack>

          <Divider />

          {/* Diagnóstico ---------------------- */}
          <Stack direction="column" sx={{ marginTop: '30px', marginBottom: '30px' }}>
            <Subtitle subtitulo='Diagnóstico'/>
            <PrescriptionDiagnosis value={diagnostico} onChange={setDiagnostico} />
          </Stack>

          <Divider />

          {/* Tratamiento ---------------------- */}
          <Stack direction="column" sx={{ marginTop: '30px', marginBottom: '30px' }}>
            <Subtitle subtitulo='Tratamiento'/>
            <PrescriptionTreatment value={tratamientoState} onChange={setTratamientoState} />
          </Stack>

          <Divider />

          <Box sx={{ marginTop: '30px', width: '100%' }}>
            <input
              type="file"
              accept=".key,.pem"
              ref={inputRef} // Asignar la referencia al input de archivo
              onChange={handleArchivoCargado}
              style={{ display: 'none' }} // Ocultar el input de archivo
            />
            <Button
              variant="outlined"
              onClick={handleClickBoton} // Activar el input de archivo
              fullWidth
              sx={{ marginBottom: '20px' }}
            >
              Cargar clave privada
            </Button>
            {/* Generar receta ---------------------- */}
            <ButtonsMod
              variant="principal"
              textCont="Generar y firmar receta"
              height="2.5rem"
              width="100%"
              clickEvent={handleGenerateAndSign}
              type="button"
            />
          </Box>


          {/* HACER COMPONENTE MÁS BONITO */}
          <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
            <DialogTitle>Ingresa tu contraseña</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Contraseña"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPasswordDialog(false)} color="primary">
                Cancelar
              </Button>
              <Button onClick={handlePasswordSubmit} color="primary">
                Aceptar
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
}

export default GeneratePrescription;