import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import ThemeMaterialUI from '../components/ThemeMaterialUI';
import { styled, useTheme } from '@mui/material/styles';
import {
  AppBar as MuiAppBar,
  Toolbar,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Drawer,
  CssBaseline,
  List,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Vaccines as VaccinesIcon,
} from '@mui/icons-material';

import '../css/medic/medic.css';
import NavbarDashboard from '../components/navbar/NavbarDashboard';
import P_HMain from '../components/patient/P_Home/P_HMain';
import P_GenerateKeys from '../components/patient/P_GenerateKeys/P_GenerateKeys';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const HomePatient = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('home');
5
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={ThemeMaterialUI}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />

        <AppBar position='fixed' open={open} sx={{ backgroundColor: 'white' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton
              color='black'
              aria-label='open-drawer'
              onClick={handleDrawerOpen}
              edge='start'
              sx={[ { mr: 2},
                open && { display: 'none' },
              ]}
            >
              <MenuIcon />
            </IconButton>
            {/* Navegador superior del Dashboard --------- */}
            <NavbarDashboard />
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{ width: drawerWidth, flexShrink: 0,
            '& .MuiDrawer-paper': {
              backgroundColor: '#00a1b4',
              color: 'white',
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant='persistent'
          anchor='left'
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {[
              { text: 'Home', view: 'home', icon: <HomeIcon/> },
              { text: 'Generar llaves', view: 'generar', icon: <VaccinesIcon/> },
            ].map(({ text, view: viewName, icon }) => (
              <ListItem key={text} disablePadding onClick={() => setView(viewName)}>
                <ListItemButton>
                  <ListItemIcon sx={{ color: 'white' }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
        
        {/* Aquí se maneja la vista de páginas dentro del Dashboard */}
        <Main open={open}>
          <DrawerHeader />
          { view === 'home' ? (
            <>
            <P_HMain/>
            </>
          ) : view === 'generar' ? (
            <P_GenerateKeys/>
          ) : (
            <>
            </>
          )}
        </Main>

      </Box>
    </ThemeProvider>
  );
};

export default HomePatient;