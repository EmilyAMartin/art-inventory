import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TextField from '@mui/material/TextField';
import { BsPersonCircle } from "react-icons/bs";

import { NavLink } from 'react-router-dom'


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    paddingLeft: theme.spacing(32),
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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Account = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{}}>
      <IconButton
        onClick={handleDrawerOpen}
        sx={[open && { display: 'none' },]}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            zIndex: -1,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20, gap: '1.5rem' }}>
          <Typography>Account</Typography>
          <Typography>Settings</Typography>
          <Typography>Help</Typography>
        </div>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <div style={{ gap: 25, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <BsPersonCircle fontSize={150} />
          <Typography variant="h6">Jane Doe</Typography>
        </div>
        <TextField
          required
          id="outlined-required"
          fullWidth
          margin="normal"
          label="Required"
          defaultValue="Full Name"
        />
        <TextField
          required
          id="outlined-required"
          fullWidth
          margin="normal"
          label="Required"
          defaultValue="Email Address"
        />
        <TextField
          required
          id="outlined-required"
          fullWidth
          margin="normal"
          label="Required"
          defaultValue="Password"
        />
      </Main>
    </Box>
  )
}
export default Account