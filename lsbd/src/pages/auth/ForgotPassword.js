import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useSelector} from 'react-redux'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // navigate is declared but not used. You might use it for redirection after successful email submission.

    const {user} = useSelector(state => ({...state}))

    useEffect(()=>{
        if(user && user.token){
            navigate('/')
        }
    },[user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const auth = getAuth(); // Get the auth instance.
        const config = {
            url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT, // Ensure this environment variable is set in your .env file.
            handleCodeInApp: true,
        };

        sendPasswordResetEmail(auth, email, config)
            .then(() => {
                setEmail('');
                setLoading(false);
                toast.success(`A message has been sent to ${email}. Check your inbox for further instructions.`);
                navigate('/');
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error.message);
            });
    };

    return (
        <div className='container col-md-6 offset-md-3 p-5'>
            {loading ? (
                <h4 className='text-danger'>Loading...</h4>
            ) : (
                <h4>Forgot Password</h4>
            )}

            <form onSubmit={handleSubmit}>
                <input 
                    type='email' 
                    className='form-control' 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    autoFocus
                />
                <br/>
                <button className='btn btn-raised' disabled={!email || loading}>Submit</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
