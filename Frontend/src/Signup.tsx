import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

const Signup = () => {
    // Initialize Firebase authentication and navigation
    const auth = getAuth();
    const navigate = useNavigate();

    // State variables for managing authentication state, email, password, confirm password, and error messages
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [emailSent, setEmailSent] = useState(false); // State to track if email verification has been sent

    // Function to handle sign-up with Google
    const signUpWithGoogle = async () => {
        setAuthing(true);

        // Use Firebase to sign up with Google
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(response => {
                console.log(response.user.uid);
                navigate('/login');
            })
            .catch(error => {
                console.log(error);
                setAuthing(false);
            });
    };

    // Function to handle sign-up with email and password
    const signUpWithEmail = async () => {
        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setAuthing(true);
        setError('');
        setEmailSent(false); // Reset email sent state

        // Use Firebase to create a new user with email and password
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (response) => {
                console.log(response.user.uid);

                // Send email verification after successful sign-up
                await sendEmailVerification(response.user);
                setEmailSent(true); // Update the state to show email verification message

                // Optionally navigate after email verification is sent
                // navigate('/login'); 
            })
            .catch(error => {
                console.log(error);
                setError(error.message);
                setAuthing(false);
            });
    };

    return (
        <div className='w-full min-h-screen flex flex-col md:flex-row'>
            <div className='w-full md:w-1/2 h-[300px] md:h-screen flex flex-col bg-[#282c34] items-center justify-center'>
                <h1 className="text-white text-3xl font-semibold flex items-center gap-2">
                    Get Started
                    <ArrowRightIcon className="w-6 h-6 text-white" />
                </h1>

            </div>

            {/* Right half - signup form */}
            <div className='w-full md:w-1/2 h-full bg-[#1a1a1a] flex flex-col p-6 md:p-20 justify-center'>
                <div className='w-full flex flex-col max-w-[450px] mx-auto'>

                    {/* Header section */}
                    <div className='w-full flex flex-col mb-10 text-white'>
                        <h3 className='text-3xl md:text-4xl font-bold mb-2'>Sign Up</h3>
                        <p className='text-base md:text-lg mb-4'>Welcome! Please enter your information below to begin.</p>
                    </div>

                    {/* Input fields */}
                    <div className='w-full flex flex-col mb-6'>
                        <input
                            type='email'
                            placeholder='Email'
                            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Re-Enter Password'
                            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {/* Feedback messages */}
                    {error && <div className='text-red-500 mb-4'>{error}</div>}
                    {emailSent && <div className='text-green-500 mb-4'>A verification email has been sent. Please check your inbox.</div>}

                    {/* Email signup button */}
                    <div className='w-full flex flex-col mb-4'>
                        <button
                            onClick={signUpWithEmail}
                            disabled={authing}
                            className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer'>
                            Sign Up With Email and Password
                        </button>
                    </div>

                    {/* Divider */}
                    <div className='w-full flex items-center justify-center relative py-4'>
                        <div className='w-full h-[1px] bg-gray-500'></div>
                        <p className='text-sm md:text-lg absolute text-gray-500 bg-[#1a1a1a] px-2'>OR</p>
                    </div>

                    {/* Google signup */}
                    <button
                        onClick={signUpWithGoogle}
                        disabled={authing}
                        className='w-full bg-white text-black font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer mt-5'>
                        Sign Up With Google
                    </button>
                </div>

                {/* Link to login */}
                <div className='w-full flex items-center justify-center mt-10'>
                    <p className='text-sm font-normal text-gray-400'>
                        Already have an account?
                        <span className='font-semibold text-white cursor-pointer underline ml-1'>
                            <a href='/login'>Log In</a>
                        </span>
                    </p>
                </div>
            </div>
        </div>

    );
}

export default Signup;
