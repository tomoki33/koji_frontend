// src/components/Login.tsx
import React, { useState } from 'react';
import { createUser, loginUser, confirmUser } from './services/auth';
import LoginForm from './components/LoginForm';
import ConfirmForm from './components/ConfirmForm';
import SignupForm from './components/SignupForm';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import { validatePassword, validateEmail } from './utils/validation'; // バリデーション関数をインポート
import './styles/Login.css';

const Login: React.FC = () => {
    const navigate = useNavigate(); // useNavigateフックを使用
    const [step, setStep] = useState<'login' | 'signup' | 'confirm'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userData, setUserData] = useState({ name: '', email: '' }); // userDataを定義
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
            await loginUser(email, password);
            navigate('/history'); // /historyに遷移
        } catch (err) {
            setError((err as Error).message || 'メールアドレスかパスワードが間違っています。');
        }
    };

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
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
            await createUser(userData.name, userData.email, password);
            setEmail(userData.email); // confirm に渡すため
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (step === 'signup') {
            setUserData({ ...userData, [name]: value }); // userDataを更新
        } else {
            if (name === 'email') setEmail(value);
            if (name === 'password') setPassword(value);
        }
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