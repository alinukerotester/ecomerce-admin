import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const adminEmails = process.env.YO_M_L ? process.env.YO_M_L.split(',') : [];

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
	],
	adapter: MongoDBAdapter(clientPromise),
	callbacks: {
		session: ({ session, token, user }) => {
			if (adminEmails.includes(session?.user?.email)) {
				return session;
			} else {
				return false;
			}
		},
	},
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!adminEmails.includes(session?.user?.email)) {
		res
			.status(401)
			.json({ error: 'Nu ai permisiunea să accesezi această resursă.' });
		return;
	}
}
