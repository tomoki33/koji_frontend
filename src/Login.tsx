// src/components/Login.tsx
import React, { useState } from 'react';
import { createUser, loginUser, confirmUser } from './services/auth';
import LoginForm from './components/LoginForm';
import ConfirmForm from './components/ConfirmForm';
import SignupForm from './components/SignupForm';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import { validatePassword, validateEmail,validateUsername } from './utils/validation'; // バリデーション関数をインポート
import './styles/Login.css';

const Login: React.FC = () => {
    const navigate = useNavigate(); // useNavigateフックを使用
    const [step, setStep] = useState<'login' | 'signup' | 'confirm'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError('メールアドレス形式で入力してください。');
            return;
        }
        if (!validatePassword(password)) {
            setError('パスワードは大文字と記号を含む必要があります。');
            return;
        }
        try {
            const token = await loginUser(email, password);            
            sessionStorage.setItem('accessToken', token.accessToken); // アクセストークンを保存
            sessionStorage.setItem('refreshToken', token.refreshToken);
            navigate('/chart'); // /historyに遷移
        } catch (err) {
            setError((err as Error).message || 'メールアドレスかパスワードが間違っています。');
        }
    };

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError('無効なメールアドレスです。');
            return;
        }
        
        if (!validatePassword(password)) {
            setError('パスワードは大文字と記号を含む必要があります。');
            return;
        }
        try {
            await createUser(email, password);
            setEmail(email); // confirm に渡すため
            setStep('confirm');
        } catch (err) {
            setError('ユーザー作成に失敗しました。もう一度やり直してください。');
        }
    };

    const handleConfirmUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await confirmUser(email, confirmationCode);
            setStep('login');
        } catch (err) {
            if ((err as Error).message.includes('invalid code')) {
                setError('確認コードが無効です。再度確認してください。');
            } else {
                setError('確認に失敗しました');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    return (
        <div onClick={() => setError('')}>
            {step === 'login' && (
                <LoginForm
                    email={email}
                    password={password}
                    onChange={handleChange}
                    onSubmit={handleLogin}
                    onSwitchToSignup={() => setStep('signup')}
                    error={error}
                />
            )}
            {step === 'signup' && (
                <SignupForm
                    email={email}
                    password={password}
                    onEmailChange={(e:any) => setEmail(e.target.value)}
                    onPasswordChange={(e:any) => setPassword(e.target.value)}
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