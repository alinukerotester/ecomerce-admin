import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Funcție pentru a obține emailurile administratorilor din baza de date
async function getAdminEmails() {
	const client = await clientPromise;
	const db = client.db();
	const adminsCollection = db.collection('admins');
	const admins = await adminsCollection.find({}).toArray();
	return admins.map((admin) => admin.email); // Asigură-te că emailurile sunt stocate în câmpul "email"
}

// Funcție pentru a combina emailurile din variabila de mediu și baza de date
async function getCombinedAdminEmails() {
	let dbAdminEmails = [];
	try {
		dbAdminEmails = await getAdminEmails();
	} catch (error) {
		console.error('Eroare la obținerea emailurilor adminilor din DB:', error);
	}
	const envAdminEmails = process.env.YO_M_L
		? process.env.YO_M_L.split(',')
		: []; // Emailurile din variabila de mediu
	return [...new Set([...dbAdminEmails, ...envAdminEmails])]; // Combină și elimină duplicatele, dacă există
}

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
	],
	adapter: MongoDBAdapter(clientPromise),
	callbacks: {
		session: async ({ session, token, user }) => {
			const adminEmails = await getCombinedAdminEmails();
			if (adminEmails.includes(session?.user?.email)) {
				return session;
			} else {
				// Redirectează sau returnează un mesaj de acces interzis
				return null; // Poți personaliza comportamentul aici
			}
		},
	},
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session?.user?.email) {
		return res.status(401).json({ error: 'Nu ești autentificat.' });
	}

	const adminEmails = await getCombinedAdminEmails();
	if (!adminEmails.includes(session.user.email)) {
		return res
			.status(401)
			.json({ error: 'Nu ai permisiunea să accesezi această resursă.' });
	}
}
