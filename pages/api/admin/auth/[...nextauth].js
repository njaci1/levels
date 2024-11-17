import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import AdminUser from '../../../../models/AdminUser';
import db from '../../../../lib/db';
import bcrypt from 'bcrypt';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await db.connect();
        const user = await AdminUser.findOne({ email: credentials.email });
        await db.disconnect();

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { email: user.email, name: user.username };
        }
        throw new Error('Invalid email or password');
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.adminUser = token.adminUser;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.adminUser = user;
      }
      return token;
    },
  },
});
