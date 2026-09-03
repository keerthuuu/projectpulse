import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import WordStreamBackground from '../components/ui/WordStreamBackground';
import FireArrowButton from '../components/ui/FireArrowButton';
import PageTransition from '../components/layouts/PageTransition';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ fullName, email, password, role });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. An account with this email may already exist.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-navy-950 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        <WordStreamBackground />

        <div className="relative z-10 w-full max-w-xl glass-panel rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <Logo size="md" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Create your Account</h2>
            <p className="text-xs text-slate-400 mt-1">Start tracking projects and predicting deadline risks</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Sarah Jenkins"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pulse-orange/60"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="sarah@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pulse-orange/60"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'Admin', label: 'Admin / Manager' },
                  { key: 'Team Leader', label: 'Team Leader' },
                  { key: 'Employee', label: 'Employee' },
                ].map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      role === r.key
                        ? 'bg-pulse-orange/20 border-pulse-orange text-white shadow-glow-orange/20'
                        : 'bg-navy-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r.key}
                  </button>
                ))}
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pulse-orange/60"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pulse-orange/60"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <FireArrowButton
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full"
              >
                {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
              </FireArrowButton>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-pulse-orange hover:underline font-bold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
