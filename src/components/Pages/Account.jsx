import React from 'react'
import { useState } from 'react'
import { Drawer, Box, Typography, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';

const Account = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  return (
    <>
      <IconButton size='large' edge='start' aria-label='logo' onClick={() => setIsDrawerOpen(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor='left' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box p={2} width='250px' textAlign='left' role='presentation'>
          <Typography><AccountCircleIcon />Account</Typography>
          <Typography><SettingsIcon />Settings</Typography>
          <Typography><HelpIcon />Help</Typography>
        </Box>
      </Drawer>
    </>
  )
}
export default Account