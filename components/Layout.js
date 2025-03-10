import Nav from '@/components/Nav';
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import Logo from './Logo';

export default function Layout({ children }) {
	const [showNav, setShowNav] = useState(false);
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
		<div className='bg-bgGray min-h-screen'>
			<div className='md:hidden flex items-center justify-between p-4'>
				<button onClick={() => setShowNav(true)}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='w-6 h-6'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
						/>
					</svg>
				</button>
				<div className='flex-grow flex justify-center items-center'>
					<Logo />
				</div>
			</div>
			<div className='flex'>
				<Nav show={showNav} />
				<div className='flex-grow p-4'>{children}</div>
			</div>
		</div>
	);
}
