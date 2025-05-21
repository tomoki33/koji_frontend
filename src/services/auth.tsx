// src/services/auth.ts
import {
    CognitoUser,
    AuthenticationDetails,
    CognitoUserPool,
    CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'ap-northeast-1_R2FIhKujJ', // ユーザープールID
    ClientId: '35olan5anhngns337q3aer6nmi', // アプリクライアントID
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
export const createUser = (name: string, email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const attributeList = [
            new CognitoUserAttribute({ Name: 'email', Value: email }),
            new CognitoUserAttribute({ Name: 'name', Value: name }),
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
