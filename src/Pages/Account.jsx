import React, { useRef } from 'react';
import { BsPersonCircle } from "react-icons/bs";
import Form from '../components/Form';

const Account = () => {
  const addNewPhoto = useRef(null);
  const handleClick = (event) => {
    addNewPhoto.current.click(event);
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
          ref={addNewPhoto}
          style={{ display: 'none' }}
        />
      </div>
      <Form />
    </>
  )
}
export default Account