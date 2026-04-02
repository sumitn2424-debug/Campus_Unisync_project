import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'otp'
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.post('/user/login', data);
      login(res.data.user || { email: data.email, name: res.data.user?.username || res.data.username });
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data) => {
    try {
      setLoading(true);
      setErrorMsg('');
      await api.post('/user/signup', data);
      setRegisteredEmail(data.email);
      setMode('otp');
      setErrorMsg('OTP sent to your email.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (data) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const payload = { email: registeredEmail || watch('email'), otp: data.otp };
      await api.post('/user/verify-otp', payload);
      setMode('login');
      setErrorMsg('Signup complete! Please login now.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const submitter = (data) => {
    if (mode === 'login') return handleLogin(data);
    if (mode === 'signup') return handleSignup(data);
    return handleVerifyOtp(data);
  };


  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="glass-panel p-8 w-full max-w-md rounded-2xl relative overflow-hidden">
        {/* Decorative blur elements inside panel */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/20 blur-[50px] -z-10 rounded-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] -z-10 rounded-full" />
        
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
          {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Verify Email'}
        </h1>
        <p className="text-slate-400 mb-8 text-sm">
          {mode === 'login' ? 'Enter your credentials to access your dashboard' : 
            mode === 'signup' ? 'Join us and explore amazing features' : 'Enter the OTP sent to your email'}
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(submitter)} className="space-y-4">
          {(mode === 'login' || mode === 'signup') && (
            <>
              {mode === 'signup' && (
                <div>
                  <input {...register('username')} placeholder="Username" className="input-field" required />
                </div>
              )}
              <div>
                <input {...register('email')} type="email" placeholder="Email Address" className="input-field" required />
              </div>
              <div>
                <input {...register('password')} type="password" placeholder="Password" className="input-field" required />
              </div>
            </>
          )}

          {mode === 'otp' && (
            <div>
              <input {...register('otp')} placeholder="Enter OTP" className="input-field tracking-widest text-center text-xl" required />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Verify'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {mode === 'login' ? (
            <p>New here? <button onClick={() => setMode('signup')} className="text-primary-400 hover:text-primary-300 font-medium ml-1">Create an account</button></p>
          ) : mode === 'signup' ? (
            <p>Already have an account? <button onClick={() => setMode('login')} className="text-primary-400 hover:text-primary-300 font-medium ml-1">Sign in</button></p>
          ) : (
            <p><button onClick={() => setMode('signup')} className="text-primary-400 hover:text-primary-300 font-medium">Back to Sign Up</button></p>
          )}
        </div>
      </div>
    </div>
  );
}
