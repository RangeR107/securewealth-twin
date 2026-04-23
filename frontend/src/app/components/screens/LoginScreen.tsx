import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Phone, Lock, CheckCircle } from 'lucide-react';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-full flex flex-col bg-white font-sans">
      {/* Status Bar */}
      <div className="h-11 bg-transparent flex items-center justify-between px-4 text-xs absolute top-0 left-0 right-0 z-10">
        <span className="text-white font-medium">9:41</span>
        <div className="flex gap-1 items-center">
          <div className="w-4 h-3 border-2 border-white rounded-sm opacity-80" />
          <div className="w-4 h-3 border-2 border-white rounded-sm opacity-80" />
          <div className="w-6 h-3 border-2 border-white rounded-sm relative opacity-80">
            <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-1 h-1.5 bg-white rounded-sm" />
          </div>
        </div>
      </div>

      {/* Gradient Header - Swapped to Bank Green */}
      <div className="bg-gradient-to-b from-[#14532D] via-[#15803D] to-white pt-16 pb-20 px-8 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-[22px] border border-white/30 flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">🛡️</span>
          </div>
        </div>
        <h1 className="text-white text-[22px] font-bold tracking-tight mb-1.5">
          SecureWealth Twin
        </h1>
        <p className="text-white/75 text-sm">Your wealth. Protected.</p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-t-[28px] -mt-7 px-5 pt-8 pb-10 flex-1 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h2>
        <p className="text-sm text-gray-500 mb-7">Sign in to your PSB wealth account</p>

        {/* Mobile Input */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            Mobile Number
          </label>
          <div className="flex items-center border-[1.5px] border-gray-200 rounded-2xl px-4 py-3.5 gap-3 focus-within:border-[#15803D] transition-colors">
            <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="flex-1 outline-none text-sm text-gray-900 bg-transparent placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-2">
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            MPIN / Password
          </label>
          <div className="flex items-center border-[1.5px] border-gray-200 rounded-2xl px-4 py-3.5 gap-3 focus-within:border-[#15803D] transition-colors">
            <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your MPIN"
              className="flex-1 outline-none text-sm text-gray-900 bg-transparent placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="text-right mb-7">
          <span className="text-xs text-[#15803D] font-semibold cursor-pointer">
            Forgot MPIN?
          </span>
        </div>

        {/* Action Button - Swapped to Bank Green */}
        <button
          onClick={() => navigate('/otp')}
          className="w-full py-4 bg-[#15803D] text-white font-bold text-base rounded-2xl hover:bg-[#14532D] active:scale-[0.98] transition-all shadow-lg shadow-green-900/20"
        >
          Login Securely →
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          New user?{' '}
          <span className="text-[#15803D] font-semibold cursor-pointer">Register</span>
        </p>

        {/* Trust Badges */}
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          {['RBI Compliant', 'PSB Secure'].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full border border-green-100"
            >
              <CheckCircle className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="text-[10px] text-[#16A34A] font-semibold">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}