import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import WordStreamBackground from '../components/ui/WordStreamBackground';
import FireArrowButton from '../components/ui/FireArrowButton';
import PageTransition from '../components/layouts/PageTransition';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please check your credentials.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-navy-950 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Animated background term stream */}
        <WordStreamBackground />

        <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
          {/* Left Brand Panel */}
          <div className="p-8 sm:p-12 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 border-r border-slate-800 flex flex-col justify-between hidden lg:flex">
            <div>
              <Logo size="lg" />
              <div className="mt-12 space-y-4">
                <span className="text-xs uppercase font-mono font-bold tracking-widest text-pulse-orange">
                  Predictive Intelligence Platform
                </span>
                <h2 className="text-3xl font-extrabold text-white leading-tight">
                  Commercial Project & Deadline Risk Intelligence
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Real-time telemetry, backend deadline predictions, and interactive What-If simulation engine for enterprise engineering teams.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-mono text-pulse-orange font-bold">LIVE DATABASE AUTH</span>
              <p>Sign in using registered PostgreSQL database accounts.</p>
            </div>
          </div>

          {/* Right Login Form Card */}
          <div className="p-8 sm:p-12 bg-navy-950/90 flex flex-col justify-center">
            <div className="mb-8">
              <div className="lg:hidden mb-6">
                <Logo size="md" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
              <p className="text-xs text-slate-400 mt-1">Sign in with your registered email and password</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Accounts Helper */}
            <div className="mb-5 p-3 rounded-xl bg-navy-900/80 border border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-400 font-semibold block">Quick-fill Test Database Accounts:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('alex.rivera@projectpulse.io', 'password123')}
                  className="py-1 px-2 rounded-lg bg-navy-950 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 font-medium text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('sarah.j@projectpulse.io', 'password123')}
                  className="py-1 px-2 rounded-lg bg-navy-950 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 font-medium text-center"
                >
                  Leader
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('david.c@projectpulse.io', 'password123')}
                  className="py-1 px-2 rounded-lg bg-navy-950 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 font-medium text-center"
                >
                  Employee
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pulse-orange/60 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pulse-orange/60 transition-all"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex justify-between items-center text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-navy-900 border-slate-800 text-pulse-orange focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-pulse-orange hover:underline font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 space-y-3">
                <FireArrowButton
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full"
                >
                  {isSubmitting ? 'Signing in...' : 'Login'}
                </FireArrowButton>
              </div>
            </form>

            <div className="mt-8 text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-pulse-orange hover:underline font-bold">
                Register now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
