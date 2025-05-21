import React, { useState } from 'react';
import { createUser, loginUser, confirmUser } from './services/auth';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ConfirmForm from './components/ConfirmForm';
import './styles/Login.css';

const validatePassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasSpecialChar;
};

const Login: React.FC = () => {
    const [step, setStep] = useState<'login' | 'signup' | 'confirm'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validatePassword(password)) {
            setError('パスワードは大文字と記号を含む必要があります。');
            return;
        }
        try {
            await loginUser(email, password);
            alert('ログイン成功！');
        } catch (err) {
            setError((err as Error).message || 'ログインに失敗しました');
        }
    };

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validatePassword(password)) {
            setError('パスワードは大文字と記号を含む必要があります。');
            return;
        }
        try {
            await createUser('dummy', email, password); // nameは将来対応
            setStep('confirm');
        } catch (err) {
            setError((err as Error).message || 'ユーザー作成に失敗しました');
        }
    };

    const handleConfirmUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await confirmUser(email, confirmationCode);
            alert('確認成功！ログインしてください');
            setStep('login');
        } catch (err) {
            setError((err as Error).message || '確認に失敗しました');
        }
    };

    return (
        <div onClick={() => setError('')}>
            {step === 'login' && (
                <LoginForm
                    email={email}
                    password={password}
                    onChange={(e) => {
                        const { name, value } = e.target;
                        if (name === 'email') setEmail(value);
                        if (name === 'password') setPassword(value);
                    }}
                    onSubmit={handleLogin}
                    onSwitchToSignup={() => setStep('signup')}
                    error={error}
                />
            )}
            {step === 'signup' && (
                <SignupForm
                    email={email}
                    password={password}
                    onEmailChange={(e) => setEmail(e.target.value)}
                    onPasswordChange={(e) => setPassword(e.target.value)}
                    onSubmit={handleCreateUser}
                    onSwitchToLogin={() => setStep('login')}
                    error={error}
                />
            )}
            {step === 'confirm' && (
                <ConfirmForm
                    confirmationCode={confirmationCode}
                    onCodeChange={(e) => setConfirmationCode(e.target.value)}
                    onSubmit={handleConfirmUser}
                    onSwitchToLogin={() => setStep('login')}
                    error={error}
                />
            )}
        </div>
    );
};

export default Login;
