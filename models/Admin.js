import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
	},
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

export default Admin;
