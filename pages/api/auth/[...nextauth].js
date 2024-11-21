import NextAuth from 'next-auth';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '../../../lib/db';
import User from '../../../models/User';
import AdminUser from '../../../models/AdminUser';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token = { ...token, ...user }; // Merge user info into token
        if (account?.provider === 'admin-credentials') {
          token.role = admin;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        _id: token._id,
        name: token.name,
        role: token.role,
        inviteCode: token.inviteCode,
        phoneNumber: token.phoneNumber,
        registrationStatus: token.registrationStatus,
      };

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      async authorize(credentials) {
        await db.connect();
        let user;
        if (credentials.callbackUrl.includes('/admin')) {
          user = await AdminUser.findOne({ email: credentials.email });
        } else {
          user = await User.findOne({ username: credentials.email });
        }

        await db.disconnect();
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.firstName,
            email: user.username,
            role: user.role,
            image: 'f',
            inviteCode: user.inviteCode,
            phoneNumber: user.phoneNumber,
            registrationStatus: user.registrationStatus,
          };
        }
        throw new Error('Invalid email or password');
      },
    }),
  ],
});
