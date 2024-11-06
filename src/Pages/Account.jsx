import React, { useRef } from 'react';
import Typography from '@mui/material/Typography';
import { BsPersonCircle } from "react-icons/bs";
import Form from '../components/Form';
const Account = () => {

  const hiddenFileInput = useRef(null);
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };

  return (
    <>
      <div className='profile-header' style={{ marginTop: 50, gap: 25, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <BsPersonCircle fontSize={150} className="button-upload" onClick={handleClick}>
        </BsPersonCircle>
        <input
          type="file"
          onChange={handleChange}
          ref={hiddenFileInput}
          style={{ display: 'none' }} // Make the file input element invisible
        />
        <Typography variant="h6">Username</Typography>
      </div>
      <Form />
    </>
  )
}
export default Account