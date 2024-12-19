import { mongooseConnect } from '../../lib/mongoose';
import Admin from '../../models/Admin';

export default async function handler(req, res) {
	const { method } = req;

	await mongooseConnect(); // Conectează-te la MongoDB cu Mongoose

	// GET: Obține toți adminii
	if (method === 'GET') {
		const admins = await Admin.find({});
		return res.status(200).json(admins);
	}

	// POST: Adaugă un nou admin
	if (method === 'POST') {
		const { email } = req.body;
		const existingAdmin = await Admin.findOne({ email });

		if (existingAdmin) {
			return res.status(400).json({ message: 'Admin already exists' });
		}

		const newAdmin = new Admin({ email });
		await newAdmin.save();
		return res.status(201).json({ message: 'Admin added successfully' });
	}

	// PUT: Actualizează un admin
	if (method === 'PUT') {
		const { oldEmail, newEmail } = req.body;

		const admin = await Admin.findOne({ email: oldEmail });

		if (!admin) {
			return res.status(404).json({ message: 'Admin not found' });
		}

		admin.email = newEmail;
		await admin.save();

		return res.status(200).json({ message: 'Admin updated successfully' });
	}

	// DELETE: Șterge un admin
	if (method === 'DELETE') {
		const { email } = req.body;

		await Admin.deleteOne({ email });
		return res.status(200).json({ message: 'Admin removed successfully' });
	}

	// Dacă metoda nu este gestionată
	res.status(405).json({ message: 'Method Not Allowed' });
}
