import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import multiparty from 'multiparty';
import fs from 'fs';
import mime from 'mime-types';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';

const bucketName = process.env.BUCKET_NAME;

export default async function handle(req, res) {
	await mongooseConnect();

	// Verifică dacă utilizatorul este admin
	try {
		await isAdminRequest(req, res); // Verifică dacă utilizatorul este admin înainte de a continua
	} catch (error) {
		return res
			.status(401)
			.json({ message: 'Unauthorized: Only admins can perform this action' });
	}

	const form = new multiparty.Form();
	const { fields, files } = await new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) reject(err);
			resolve({ fields, files });
		});
	});
	const client = new S3Client({
		region: 'us-east-1',
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		},
	});
	const links = [];
	for (const file of files.file) {
		const ext = file.originalFilename.split('.').pop();
		const newFilename = Date.now() + '.' + ext;
		await client.send(
			new PutObjectCommand({
				Bucket: bucketName,
				Key: newFilename,
				Body: fs.readFileSync(file.path),
				ACL: 'public-read',
				ContentType: mime.lookup(file.path),
			}),
		);
		const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
		links.push(link);
	}
	return res.json({ links });
}

export const config = {
	api: {
		bodyParser: false,
	},
};
