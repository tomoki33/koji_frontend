// パスワードのバリデーション関数
export const validatePassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasSpecialChar;
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // メールアドレスの正規表現
    return emailRegex.test(email);
};

export const validateUsername = (username: string): boolean => {
    const usernamePattern = /^[\p{L}\p{M}\p{S}\p{N}\p{P}]+$/u; // 正規表現パターン
    return username.length > 0 && usernamePattern.test(username); // 長さとパターンをチェック
};