import React from 'react';

type Props = {
    email: string;
    password: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onSwitchToLogin: () => void;
    error: string;
};

const SignupForm: React.FC<Props> = ({ email, password, onEmailChange, onPasswordChange, onSubmit, onSwitchToLogin, error }) => (
    <form onSubmit={onSubmit}>
        <h2>新規ユーザー作成</h2>
        <input type="text" name="email" value={email} onChange={onEmailChange} placeholder="メールアドレス" required />
        <input type="password" name="password" value={password} onChange={onPasswordChange} placeholder="パスワード" required />
        <button type="submit">ユーザー作成</button>
        <button type="button" onClick={onSwitchToLogin}>ログイン画面に戻る</button>
        {error && <p className="error-message">{error}</p>}
    </form>
);

export default SignupForm;
