import { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config';

const prisma = new PrismaClient();

const createUserIntoDB = async (userData: User) => {
    const hashedPassword = await bcrypt.hash(
        userData.password,
        Number(config.bcrypt_salt_rounds)
    );

    const result = await prisma.user.create({
        data: {
            ...userData,
            password: hashedPassword,
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
};

const loginUser = async (payload: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordMatched = await bcrypt.compare(
        payload.password,
        user.password
    );

    if (!isPasswordMatched) {
        throw new Error('Password incorrect');
    }

    const jwtPayload = {
        email: user.email,
        role: user.role,
        id: user.id
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt.secret as string, {
        expiresIn: config.jwt.expires_in,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
        token: accessToken,
        user: userWithoutPassword,
    };
};

export const AuthService = {
    createUserIntoDB,
    loginUser,
};
