import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate hook for navigation
import { signInWithEmailLink, updatePassword, getIdTokenResult, getAuth } from 'firebase/auth'; // Import necessary functions
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";

const RegisterVerification = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for programmatically navigating
  const auth = getAuth();

  const { user } = useSelector((state) => ({ ...state }));
  let dispatch = useDispatch();

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
    // console.log(window.location.href);
    // console.log(window.localStorage.getItem("emailForRegistration"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation
    if (!email || !password) {
      toast.error("Email and password is required");
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be longer than 6 characters');
      return;
    }
    try {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      if (result.user.emailVerified) {
        window.localStorage.removeItem('emailForRegistration');
        await updatePassword(result.user, password);
        const idTokenResult = await getIdTokenResult(result.user);
        //console.log('user', result.user, 'idTokenResult', idTokenResult);
        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((err) => console.log(err));
        navigate('/'); // Adjust the path as needed
      }
    } catch (error) {
      console.error("Error in sign-in:", error);
      toast.error(error.message);
    }
  };

  const completeRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <input type='email' className='form-control' value={email} disabled />
      <input type='password' className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' autoFocus />
      <br />
      <button type='submit' className='btn btn-light'>Complete Registration</button>
    </form>
  );

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h4>Register Complete</h4>
          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterVerification;