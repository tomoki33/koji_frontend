import React from 'react';

type Props = {
    confirmationCode: string;
    onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onSwitchToLogin: () => void;
    error: string;
};

const ConfirmForm: React.FC<Props> = ({ confirmationCode, onCodeChange, onSubmit, onSwitchToLogin, error }) => (
    <form onSubmit={onSubmit}>
        <h2>確認コードの入力</h2>
        <input type="text" value={confirmationCode} onChange={onCodeChange} placeholder="確認コード" required />
        <button type="submit">確認する</button>
        <button type="button" onClick={onSwitchToLogin}>ログイン画面に戻る</button>
        {error && <p className="error-message">{error}</p>}
    </form>
);

export default ConfirmForm;
