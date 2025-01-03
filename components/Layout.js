import Nav from '@/components/Nav';
import { useSession, signIn } from 'next-auth/react';

export default function Layout({ children }) {
	const { data: session } = useSession();
	if (!session) {
		return (
			<div className='bg-bgGray w-screen h-screen flex items-center'>
				<div className='text-center w-full'>
					<button
						onClick={() => signIn('google')}
						className='bg-white p-2 px-4 rounded-lg'>
						<span>Login with </span>
						<span className='google-logo'>
							{'Google'.split('').map((letter, index) => (
								<span key={index} className={`letter letter-${index % 4}`}>
									{letter}
								</span>
							))}
						</span>
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-bgGray min-h-screen flex'>
			<Nav />
			<div className='bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4'>
				{children}
			</div>
		</div>
	);
}
