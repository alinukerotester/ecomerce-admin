import Layout from '@/components/Layout';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Admins() {
	const [admins, setAdmins] = useState([]);
	const [newAdminEmail, setNewAdminEmail] = useState('');
	const [editedAdmin, setEditedAdmin] = useState(null); // Stare pentru urmărirea adminului care este editat
	const [editedEmail, setEditedEmail] = useState(''); // Stare pentru email-ul editat

	useEffect(() => {
		fetchAdmins();
	}, []);

	// Obține lista de admini de la API
	const fetchAdmins = async () => {
		const response = await axios.get('/api/admins'); // Adaptează la endpoint-ul API-ului tău
		setAdmins(response.data);
	};

	// Adaugă un admin nou
	const addAdmin = async (email) => {
		await axios.post('/api/admins', { email });
		setNewAdminEmail('');
		fetchAdmins(); // Reîmprospătează lista de admini
	};

	// Șterge un admin
	const removeAdmin = async (email) => {
		try {
			await axios.delete('/api/admins', { data: { email } }); // Trimite email-ul în body
			fetchAdmins(); // Reîmprospătează lista de admini
		} catch (error) {
			console.error('Eroare la ștergerea adminului:', error);
		}
	};

	// Actualizează email-ul unui admin
	const updateAdmin = async (oldEmail, newEmail) => {
		await axios.put('/api/admins', { oldEmail, newEmail }); // Trimite cererea PUT
		setEditedAdmin(null); // Resetează starea de editare
		fetchAdmins(); // Reîncarcă lista de admini
	};

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
											setEditedEmail(admin.email); // Setează email-ul de editat
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
