import React from 'react'
import { useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

const Account = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  return (
    <>
      <IconButton size='large' edge='start' aria-label='logo' onClick={() => setIsDrawerOpen(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor='left' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box p={2} width='250px' textAlign='center' role='presentation'>
          <Typography variant='h6' component='div'>
            Side Panel
          </Typography>
        </Box>
      </Drawer>
    </>
  )
}
export default Account