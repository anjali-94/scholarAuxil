import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import { UserIcon } from '@heroicons/react/24/solid';

const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const signInWithGoogle = async () => {
        setAuthing(true);
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(response => {
                console.log(response.user.uid);
                navigate('/');
            })
            .catch(error => {
                console.log(error);
                setAuthing(false);
            });
    }

    const signInWithEmail = async () => {
        setAuthing(true);
        setError('');
        signInWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                navigate('/');
            })
            .catch(error => {
                console.log(error);
                setError(error.message);
                setAuthing(false);
            });
    }

    const handleForgotPassword = () => {
        setShowForgotPassword(true);
    }

    return (
        <div className='w-full min-h-screen flex flex-col md:flex-row'>
            {/* Left Panel */}
            <div className='w-full md:w-1/2 h-[300px] md:h-screen flex flex-col bg-[#282c34] items-center justify-center'>
                <h1 className="text-white text-3xl font-semibold flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-white" />
                    Welcome Back!
                </h1>
            </div>

            {/* Right Panel */}
            <div className='w-full md:w-1/2 h-auto md:h-screen bg-[#1a1a1a] flex flex-col p-6 sm:p-10 md:p-20 justify-center'>
                <div className='w-full flex flex-col max-w-[450px] mx-auto'>
                    <div className='w-full flex flex-col mb-6 text-white'>
                        <h3 className='text-3xl md:text-4xl font-bold mb-2'>Login</h3>
                        <p className='text-base md:text-lg mb-4'>Welcome Back! Please enter your details.</p>
                    </div>

                    {!showForgotPassword && (
                        <>
                            <div className='w-full flex flex-col mb-6'>
                                <input
                                    type='email'
                                    placeholder='Email'
                                    className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                                <input
                                    type='password'
                                    placeholder='Password'
                                    className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <div className='w-full flex flex-col mb-4'>
                                <button
                                    className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer'
                                    onClick={signInWithEmail}
                                    disabled={authing}>
                                    Log In With Email and Password
                                </button>
                            </div>

                            {error && <div className='text-red-500 mb-4'>{error}</div>}

                            <div className='w-full flex items-center justify-center relative py-4'>
                                <div className='w-full h-[1px] bg-gray-500'></div>
                                <p className='text-sm md:text-lg absolute text-gray-500 bg-[#1a1a1a] px-2'>OR</p>
                            </div>

                            <button
                                className='w-full bg-white text-black font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer mt-5'
                                onClick={signInWithGoogle}
                                disabled={authing}>
                                Log In With Google
                            </button>

                            <div className='w-full text-center mt-4'>
                                <button
                                    onClick={handleForgotPassword}
                                    className='text-blue-400'>
                                    Forgot Password?
                                </button>
                            </div>

                            <div className='w-full flex items-center justify-center mt-8'>
                                <p className='text-sm font-normal text-gray-400'>
                                    Don't have an account? <span className='font-semibold text-white cursor-pointer underline'><a href='/signup'>Sign Up</a></span>
                                </p>
                            </div>
                        </>


                    )}

                    {/* Show Forgot Password Component */}
                    {showForgotPassword && <ForgotPassword />}
                </div>
            </div>
        </div>
    );
}

export default Login;
