import React, { useState } from 'react';
import { createUser } from '../services/api';

const CreateUser: React.FC = () => {
    const [userData, setUserData] = useState({ name: '', email: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await createUser(userData);
            console.log('User created:', response.data);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" onChange={handleChange} placeholder="名前" required />
            <input type="email" name="email" onChange={handleChange} placeholder="メールアドレス" required />
            <button type="submit">ユーザー作成</button>
        </form>
    );
};

export default CreateUser;
