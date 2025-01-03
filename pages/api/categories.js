import { mongooseConnect } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { isAdminRequest } from './auth/[...nextauth]';

export default async function handle(req, res) {
	const { method } = req;
	await mongooseConnect();

	// Verifică dacă utilizatorul este admin
	try {
		await isAdminRequest(req, res); // Verifică dacă utilizatorul este admin înainte de a continua
	} catch (error) {
		return res
			.status(401)
			.json({ message: 'Unauthorized: Only admins can perform this action' });
	}

	if (method === 'GET') {
		res.json(await Category.find().populate('parent'));
	}

	if (method === 'POST') {
		const { name, parentCategory, properties } = req.body;
		const categoryDoc = await Category.create({
			name,
			parent: parentCategory || undefined,
			properties,
		});
		res.json(categoryDoc);
	}

	if (method === 'PUT') {
		const { name, parentCategory, properties, _id } = req.body;
		const categoryDoc = await Category.updateOne(
			{ _id },
			{
				name,
				parent: parentCategory || undefined,
				properties,
			},
		);
		res.json(categoryDoc);
	}

	if (method === 'DELETE') {
		const { _id } = req.query;
		await Category.deleteOne({ _id });
		res.json('ok');
	}
}
