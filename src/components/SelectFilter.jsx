import React, { useState } from 'react'
import Data from '../components/ArtData.json'

const BasicSelect = () => {
  const [value, setValue] = useState('')
  const options = [
    { label: "Recently Added", value: 100 },
    { label: "Favorites", value: JSON.parse(localStorage.getItem('favoritesList')) },
  ]
  function handleSelect(e) {
    setValue(e.target.value)
  }
  return (
    < div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center'
    }}>
      <select
        style={{
          borderColor: 'lightgrey',
          borderRadius: '0.3rem',
          width: '25rem',
          height: '3rem',
          fontSize: '1rem',
        }}
        onChange={handleSelect}>
        {options.map(option => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
      <p>{value}</p>
    </div>
  )
}

export default BasicSelect