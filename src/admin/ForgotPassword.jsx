import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1 = send otp, 2 = verify/reset
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('https://snmtc.in/parts/api/sendotp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.success !== false) {
                toast.success('OTP sent to your email!', { autoClose: 3000 });
                setStep(2);
            } else {
                throw new Error(data.message || 'Error sending OTP');
            }
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('https://snmtc.in/parts/api/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, password }),
            });

            const data = await response.json();

            if (response.ok && data.success !== false) {
                toast.success('Password reset successful!', { autoClose: 3000 });
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            } else {
                throw new Error(data.message || 'Invalid OTP or email');
            }
        } catch (error) {
            toast.error(error.message || 'Error resetting password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
                {step === 1 ? (
                    <>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                            Forgot Password
                        </h2>
                        <p className="text-center text-gray-600 mb-6">
                            Enter your email to receive an OTP
                        </p>

                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-70"
                            >
                                {isLoading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                            Reset Password
                        </h2>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-70"
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}

                <p className="mt-4 text-center text-sm">
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Back to Login
                    </Link>
                </p>
                <ToastContainer />
            </div>
        </div>
    );
}

export default ForgotPassword;
