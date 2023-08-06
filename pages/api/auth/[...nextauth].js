import NextAuth from 'next-auth';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '../../../lib/db';
import User from '../../../models/User';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      if (user?.inviteCode) token.inviteCode = user.inviteCode;
      if (user?.phoneNumber) token.phoneNumber = user.phoneNumber;

      // return { ...token, ...user };
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.inviteCode) session.user.inviteCode = token.inviteCode;
      if (token?.phoneNumber) session.user.phoneNumber = token.phoneNumber;

      // session.user = token;
      // console.log(session.user);
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({
          username: credentials.email,
        });
        await db.disconnect();
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.firstName,
            email: user.username,
            image: 'f',
            inviteCode: user.inviteCode,
            phoneNumber: user.phoneNumber,
          };
        }
        throw new Error('Invalid email or password');
      },
    }),
  ],
});
