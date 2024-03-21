import React, { useState, useEffect } from 'react';
import { sendSignInLinkToEmail, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const {user} = useSelector(state => ({...state}))

    useEffect(()=>{
        if(user && user.token){
            navigate('/')
        }
    },[user])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, config);
      toast.success(`Email is sent to ${email}. Click the link to complete your registration.`);
      window.localStorage.setItem('emailForRegistration', email);
      setEmail('');
    } catch (error) {
        // Log the full error details
        console.error('Error sending sign-in link to email:', error);
        toast.error(error.message);
      }
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type='email'
        className='form-control'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Enter email address'
        autoFocus
      />
      <br/>
      <button type='submit' className='btn btn-primary'>
        Register
      </button>
    </form>
  );

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h4>Register</h4>
          {registerForm()}
        </div>
      </div>
    </div>
  );
};

export default Register;
