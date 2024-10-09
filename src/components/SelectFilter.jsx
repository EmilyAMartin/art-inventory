import React from 'react'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const BasicSelect = () => {
  const [filter, setFilter] = React.useState('');
  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, maxWidth: 250 }}>
      <Select
        value={filter}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value="">Recently Added</MenuItem>
        <MenuItem value={'Favorites'}>Favorites</MenuItem>
      </Select>
    </FormControl>
  )
}

export default BasicSelect