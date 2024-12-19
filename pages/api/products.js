import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
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
		if (req.query?.id) {
			res.json(await Product.findOne({ _id: req.query.id }));
		} else {
			res.json(await Product.find());
		}
	}

	if (method === 'POST') {
		const { title, description, price, images, category, properties } =
			req.body;
		const productDoc = await Product.create({
			title,
			description,
			price,
			images,
			category: category || null,
			properties,
		});
		res.json(productDoc);
	}

	if (method === 'PUT') {
		const { title, description, price, images, category, properties, _id } =
			req.body;
		await Product.updateOne(
			{ _id },
			{
				title,
				description,
				price,
				images,
				category: category || null,
				properties,
			},
		);
		res.json(true);
	}

	if (method === 'DELETE') {
		if (req.query?.id) {
			await Product.deleteOne({ _id: req.query.id });
			res.json(true);
		}
	}
}
