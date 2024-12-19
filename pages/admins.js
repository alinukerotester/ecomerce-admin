import Layout from '@/components/Layout';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';

export default function Admins() {
	const { data: session, status } = useSession();
	const [admins, setAdmins] = useState([]);
	const [newAdminEmail, setNewAdminEmail] = useState('');
	const [editedAdmin, setEditedAdmin] = useState(null);
	const [editedEmail, setEditedEmail] = useState('');

	// Memorează fetchAdmins pentru a preveni recrearea la fiecare render
	const fetchAdmins = useCallback(async () => {
		try {
			const response = await axios.get('/api/admins');
			setAdmins(response.data);
		} catch (error) {
			console.error('Error fetching admins:', error);
		}
	}, []); // Nu mai ai nevoie de `session` ca dependență

	// Adaugă un admin nou
	const addAdmin = async (email) => {
		try {
			await axios.post('/api/admins', { email });
			setNewAdminEmail('');
			fetchAdmins(); // Reîmprospătează lista după adăugare
		} catch (error) {
			console.error('Error adding admin:', error);
		}
	};

	// Șterge un admin
	const removeAdmin = async (email) => {
		try {
			await axios.delete('/api/admins', { data: { email } });
			fetchAdmins(); // Reîmprospătează lista după ștergere
		} catch (error) {
			console.error('Eroare la ștergerea adminului:', error);
		}
	};

	// Actualizează email-ul unui admin
	const updateAdmin = async (oldEmail, newEmail) => {
		try {
			await axios.put('/api/admins', { oldEmail, newEmail });
			setEditedAdmin(null);
			fetchAdmins(); // Reîmprospătează lista după actualizare
		} catch (error) {
			console.error('Error updating admin:', error);
		}
	};

	// Verifică starea sesiunii
	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	if (status === 'unauthenticated') {
		return <p>You are not authorized to view this page.</p>;
	}

	return (
		<Layout>
			<h1>Admins</h1>

			<div className='flex gap-2'>
				<input
					type='email'
					placeholder='Email Admin'
					value={newAdminEmail}
					onChange={(e) => setNewAdminEmail(e.target.value)}
					className='border p-2 rounded'
				/>
				<button
					onClick={() => addAdmin(newAdminEmail)}
					className='bg-blue-500 text-white p-2 rounded'>
					Adaugă Admin
				</button>
			</div>

			<h2 className='mt-4 font-semibold mb-2'>Admini existenți</h2>
			<table className='basic'>
				<thead>
					<tr>
						<td>Email</td>
						<td>Acțiuni</td>
					</tr>
				</thead>
				<tbody>
					{admins.map((admin) => (
						<tr key={admin.email}>
							<td>
								{editedAdmin === admin.email ? (
									<input
										type='email'
										value={editedEmail}
										onChange={(e) => setEditedEmail(e.target.value)}
										className='border p-2 rounded'
									/>
								) : (
									admin.email
								)}
							</td>
							<td>
								{editedAdmin === admin.email ? (
									<button
										onClick={() => updateAdmin(admin.email, editedEmail)}
										className='bg-green-500 text-white p-1 rounded'>
										Salvează
									</button>
								) : (
									<button
										onClick={() => {
											setEditedAdmin(admin.email);
											setEditedEmail(admin.email);
										}}
										className='bg-yellow-500 text-white p-1 rounded'>
										Editează
									</button>
								)}
								<button
									onClick={() => removeAdmin(admin.email)}
									className='bg-red-500 text-white p-1 rounded ml-2'>
									Șterge
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Layout>
	);
}