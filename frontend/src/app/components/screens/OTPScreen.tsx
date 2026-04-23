import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { StatusBar, BackArrow } from '../ui/shared';

export default function OTPScreen() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(42);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const t = setInterval(() => setTimer((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const handleInput = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[i] = val.slice(-1);
    setOtp(updated);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-white">
      <StatusBar />

      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <BackArrow to="/" />
        <h1 className="text-base font-semibold text-gray-900">Verify Identity</h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-10 pb-8">
        <div className="text-6xl mb-5">📲</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">OTP Verification</h2>
        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
          Enter the 6-digit OTP sent to{' '}
          <span className="font-semibold text-gray-800">+91 98XXX XXXXX</span>
        </p>

        {/* OTP Boxes */}
        <div className="flex gap-2.5 mb-6">
          {otp.map((val, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={val}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              maxLength={1}
              className={`w-12 h-14 text-center text-xl font-bold rounded-2xl border-[1.5px] outline-none transition-all
                ${val
                  ? 'border-[#4338CA] bg-indigo-50 text-[#4338CA]'
                  : 'border-gray-200 bg-white text-gray-900 focus:border-[#4338CA]'
                }`}
            />
          ))}
        </div>

        {/* Timer */}
        <p className={`text-sm font-medium mb-8 ${timer > 0 ? 'text-[#D97706]' : 'text-[#4338CA] cursor-pointer'}`}>
          {timer > 0
            ? `Resend OTP in 0:${String(timer).padStart(2, '0')}`
            : 'Resend OTP'}
        </p>

        <button
          onClick={() => navigate('/app')}
          className="w-full py-4 bg-[#4338CA] text-white font-bold text-base rounded-2xl hover:bg-[#3730A3] active:scale-[0.98] transition-all mb-5"
        >
          Verify & Continue →
        </button>

        <p className="text-xs text-gray-400 mt-6">
          Having trouble?{' '}
          <span className="text-[#4338CA] font-medium">Call 1800-XXX-XXXX</span>
        </p>
      </div>
    </div>
  );
}
