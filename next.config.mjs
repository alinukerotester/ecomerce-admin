/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'next-ecomercity-alinukes.s3.amazonaws.com', // Adăugăm domeniul S3 aici
				port: '',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
