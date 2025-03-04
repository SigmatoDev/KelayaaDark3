"use client";
import { useState } from 'react';


import Form from './Form';



const RegisterPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div>
      <Form isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default RegisterPage;
