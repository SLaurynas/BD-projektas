import React, {useState} from 'react'
import UserNav from '../../components/nav/UserNav';
import { getAuth, updatePassword } from 'firebase/auth';
import { toast } from 'react-toastify'

const Password = () => {
    const [password, setPassword]=useState('');
    const [loading, setLoading]=useState(false);
    const auth = getAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        await updatePassword(auth.currentUser, password)
        .then(() =>{
            setLoading(false)
            toast.success('Password changed successfully')
        })
        .catch(err => {
            setLoading(false)
            toast.error(err.message)
        })
    }

    const passwordUpdateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <input type='password' 
                onChange={e => setPassword(e.target.value)} 
                className='form-control' 
                placeholder='Enter new password'
                disabled={loading}
                value={password}
                />
                <button 
                 className='btn btn-primary'
                 disabled={!password || password.length < 6 || loading}
                 >
                    Submit
                </button>
            </div>
        </form>
    )
return(
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-md-2'>
                <UserNav/>
            </div>
            <div className='col'>
            <h4>Change Password</h4>
            {passwordUpdateForm()}
            </div>
        </div>
    </div>
)};

export default Password;