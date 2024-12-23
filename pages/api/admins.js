import { mongooseConnect } from '../../lib/mongoose';
import Admin from '../../models/Admin';
import { isAdminRequest } from './auth/[...nextauth]';

export default async function handler(req, res) {
	const { method } = req;

	// Verifică dacă utilizatorul este admin
	try {
		await isAdminRequest(req, res); // Verifică dacă utilizatorul este admin înainte de a continua
	} catch (error) {
		return res
			.status(401)
			.json({ message: 'Unauthorized: Only admins can perform this action' });
	}

	await mongooseConnect(); // Conectează-te la MongoDB cu Mongoose

	// GET: Obține toți adminii
	if (method === 'GET') {
		try {
			const admins = await Admin.find({});
			return res.status(200).json(admins);
		} catch (error) {
			return res.status(500).json({ message: 'Error fetching admins' });
		}
	}

	// POST: Adaugă un nou admin
	if (method === 'POST') {
		const { email } = req.body;
		if (!email || !email.includes('@')) {
			return res.status(400).json({ message: 'Please provide a valid email' });
		}

		try {
			const existingAdmin = await Admin.findOne({ email });
			if (existingAdmin) {
				return res.status(400).json({ message: 'Admin already exists' });
			}

			const newAdmin = new Admin({ email });
			await newAdmin.save();
			return res.status(201).json({ message: 'Admin added successfully' });
		} catch (error) {
			return res.status(500).json({ message: 'Error adding admin' });
		}
	}

	// PUT: Actualizează un admin
	if (method === 'PUT') {
		const { oldEmail, newEmail } = req.body;

		if (!newEmail || !newEmail.includes('@')) {
			return res
				.status(400)
				.json({ message: 'Please provide a valid new email' });
		}

		try {
			const admin = await Admin.findOne({ email: oldEmail });
			if (!admin) {
				return res.status(404).json({ message: 'Admin not found' });
			}

			admin.email = newEmail;
			await admin.save();
			return res.status(200).json({ message: 'Admin updated successfully' });
		} catch (error) {
			return res.status(500).json({ message: 'Error updating admin' });
		}
	}

	// DELETE: Șterge un admin
	if (method === 'DELETE') {
		const { email } = req.body;

		try {
			await Admin.deleteOne({ email });
			return res.status(200).json({ message: 'Admin removed successfully' });
		} catch (error) {
			return res.status(500).json({ message: 'Error removing admin' });
		}
	}

	// Dacă metoda nu este gestionată
	res.status(405).json({ message: 'Method Not Allowed' });
}
