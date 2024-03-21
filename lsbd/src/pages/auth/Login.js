import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'antd';
import { GoogleOutlined, LoginOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { signInWithEmailAndPassword, signInWithPopup, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { createOrUpdateUser } from "../../functions/auth";

const Login = () => {
  const [email, setEmail] = useState("laurynasseredochas@gmail.com");
  const [password, setPassword] = useState("admin2");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const googleAuthProvider = new GoogleAuthProvider();

  const {user} = useSelector(state => ({...state}))

    useEffect(()=>{
        if(user && user.token){
          roleBasedRedirect(user);
        }
    },[user])

    let dispatch = useDispatch();

    const roleBasedRedirect = (res) => {
      if (res.data && res.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/history');
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        // console.log(result);
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
  
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
            roleBasedRedirect(res);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
  
    const googleLogin = async () => {
      setLoading(true);
      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
    
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
            roleBasedRedirect(res);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='email'
          className='form-control'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email address'
          autoFocus
        />
        <input
          type='password'
          className='form-control'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          autoFocus
        />
      </div>
      <br/>
      <Button 
        onClick={handleSubmit} // Assign the click handler
        type='primary' 
        className='mb-3' 
        block
        shape='round'
        icon={<LoginOutlined />}
        size='large'
        loading={loading} // Show a loading spinner on the button
        disabled={!email || password.length < 6 || loading}
      > 
        Login
      </Button>
    </form>
  );

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          {loading ? (
          <h4 className='text-danger'>Loading...</h4>
          ) : (
          <h4>Login</h4>
          )}
          {loginForm()}
        <Button 
            onClick={googleLogin} // Assign the click handler
            type='primary' 
            danger
            className='mb-3' 
            block
            shape='round'
            icon={<GoogleOutlined />}
            size='large'
        > 
            Google login
        </Button>
        <Link to="/forgot/password" style={{ float: 'right', color: 'red' }}>Forgot Password?</Link>

        </div>
      </div>
    </div>
  );
};

export default Login;
