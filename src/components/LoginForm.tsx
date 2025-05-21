import React from 'react';

type Props = {
    email: string;
    password: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onSwitchToSignup: () => void;
    error: string;
};

const LoginForm: React.FC<Props> = ({ email, password, onChange, onSubmit, onSwitchToSignup, error }) => (
    <form onSubmit={onSubmit}>
        <h2>ログイン</h2>
        <input type="email" name="email" value={email} onChange={onChange} placeholder="メールアドレス" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="パスワード" required />
        <button type="submit">ログイン</button>
        <button type="button" onClick={onSwitchToSignup}>新規登録</button>
        {error && <p className="error-message">{error}</p>}
    </form>
);

export default LoginForm;
