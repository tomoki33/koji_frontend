// src/services/auth.ts
import {
    CognitoUser,
    AuthenticationDetails,
    CognitoUserPool,
    CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'ap-northeast-1_A8Sxb2Gzd', // ユーザープールID
    ClientId: '3rgpb68dlf94mudskupag0b721', // アプリクライアントID
};

const userPool = new CognitoUserPool(poolData);

// Define an interface for the tokens
interface AuthTokens {
    idToken: string;
    accessToken: string;
    refreshToken: string;
}

// ログイン処理
export const loginUser = (email: string, password: string): Promise<AuthTokens> => {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({ Username: email, Pool: userPool });
        const authDetails = new AuthenticationDetails({ Username: email, Password: password });

        user.authenticateUser(authDetails, {
            onSuccess: (result: any) => {
                resolve({
                    idToken: result.getIdToken().getJwtToken(),
                    accessToken: result.getAccessToken().getJwtToken(),
                    refreshToken: result.getRefreshToken().getToken(),
                });
            },
            onFailure: (err: any) => {
                reject(err);
            },
        });
    });
};

// ユーザー作成（サインアップ）
export const createUser = ( email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const attributeList = [
            new CognitoUserAttribute({ Name: 'email', Value: email }),
        ];


        userPool.signUp(email, password, attributeList, [], (err: any, result: any) => {
            if (err) {
                console.error('SignUp error:', err);
                reject(err);
                return;
            }
            resolve(); // ユーザー作成成功
        });
    });
};

// ユーザー確認（メールで届いたコードを使用）
export const confirmUser = (email: string, code: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({ Username: email, Pool: userPool });

        user.confirmRegistration(code, true, (err, result) => {
            if (err) {
                console.error('Confirm error:', err);
                reject(err);
                return;
            }
            resolve(); // 確認成功
        });
    });
};

export const handleLogout = async () => {
    try {
        sessionStorage.removeItem('accessToken'); // セッションストレージからトークンを削除
        sessionStorage.removeItem('refreshToken'); // リフレッシュトークンも削除
        // ログイン画面にリダイレクト
        window.location.href = '/'; // または、React Routerを使用してリダイレクト
    } catch (error) {
        console.error('Error logging out', error);
    }
};
