import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { ReactSortable } from 'react-sortablejs';

export default function ProductForm({
	_id,
	title: existingTitle,
	description: existingDescription,
	price: existingPrice,
	images: existingImages,
	category: assignedCategory,
	properties: assignedProperties,
}) {
	const [title, setTitle] = useState(existingTitle || '');
	const [description, setDescription] = useState(existingDescription || '');
	const [category, setCategory] = useState(assignedCategory || '');
	const [productProperties, setProductProperties] = useState(
		assignedProperties || {},
	);
	const [price, setPrice] = useState(existingPrice || '');
	const [images, setImages] = useState(
		existingImages?.map((link) => ({ id: link, src: link })) || [],
	);
	const [goToProducts, setGoToProducts] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [categories, setCategories] = useState([]);
	const router = useRouter();
	useEffect(() => {
		axios.get('/api/categories').then((result) => {
			setCategories(result.data);
		});
	}, []);
	async function saveProduct(ev) {
		ev.preventDefault();
		const data = {
			title,
			description,
			price,
			images: images.map((image) => image.src),
			category,
			properties: productProperties,
		};
		if (_id) {
			//UPDATE
			await axios.put('/api/products', { ...data, _id });
		} else {
			//CREATE
			await axios.post('/api/products', data);
		}
		setGoToProducts(true);
	}

	if (goToProducts) {
		router.push('/products');
	}

	async function uploadImages(ev) {
		const files = ev.target?.files;
		if (files?.length > 0) {
			setIsUploading(true);
			const data = new FormData();
			for (const file of files) {
				data.append('file', file);
			}
			const res = await axios.post('/api/upload', data);
			setImages((oldImages) => [
				...oldImages,
				...res.data.links.map((link) => ({ id: link, src: link })),
			]);
			setIsUploading(false);
		}
	}

	function updateImagesOrder(newImages) {
		setImages(newImages);
	}

	function setProductProp(propName, value) {
		setProductProperties((prev) => {
			const newProductProps = { ...prev };
			newProductProps[propName] = value;
			return newProductProps;
		});
	}

	const propertiesToFill = [];
	if (categories.length > 0 && category) {
		let catInfo = categories.find(({ _id }) => _id === category);
		propertiesToFill.push(...catInfo.properties);
		while (catInfo?.parent?._id) {
			const parentCat = categories.find(
				({ _id }) => _id === catInfo?.parent?._id,
			);
			propertiesToFill.push(...parentCat.properties);
			catInfo = parentCat;
		}
	}

	return (
		<form onSubmit={saveProduct}>
			<label>Product name</label>
			<input
				type='text'
				placeholder='product name'
				value={title}
				onChange={(ev) => setTitle(ev.target.value)}
			/>
			<label>Category</label>
			<select value={category} onChange={(ev) => setCategory(ev.target.value)}>
				<option value=''>Uncategorized</option>
				{categories.length > 0 &&
					categories.map((c) => (
						<option key={c._id} value={c._id}>
							{c.name}
						</option>
					))}
			</select>
			{propertiesToFill.length > 0 &&
				propertiesToFill.map((p, index) => (
					<div key={index} className=''>
						<label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
						<div>
							<select
								value={productProperties[p.name]}
								onChange={(ev) => setProductProp(p.name, ev.target.value)}>
								{p.values.map((v, idx) => (
									<option key={idx} value={v}>
										{v}
									</option>
								))}
							</select>
						</div>
					</div>
				))}
			<label>Photos</label>
			<div className='mb-2 flex flex-wrap gap-1'>
				<ReactSortable
					list={images}
					setList={updateImagesOrder}
					className='flex flex-wrap gap-1'>
					{!!images?.length &&
						images.map((image) => (
							<div
								key={image.id}
								className='p-4 bg-white shadow-sm rounded-sm border border-gray-200'>
								<div className='h-24 w-24 relative overflow-hidden'>
									<Image
										src={image.src}
										alt='any image'
										layout='fill'
										objectFit='cover'
									/>
								</div>
							</div>
						))}
				</ReactSortable>
				{isUploading && (
					<div className='h-24 flex items-center'>
						<Spinner />
					</div>
				)}
				<div className='p-4 bg-white shadow-sm rounded-sm border border-primary'>
					<label className='w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
							/>
						</svg>
						<div>Add Image</div>
						<input type='file' onChange={uploadImages} className='hidden' />
					</label>
				</div>
			</div>
			<label>Description</label>
			<textarea
				placeholder='description'
				value={description}
				onChange={(ev) => setDescription(ev.target.value)}
			/>
			<label>Price (in USD)</label>
			<input
				type='number'
				placeholder='price'
				value={price}
				onChange={(ev) => setPrice(ev.target.value)}
			/>
			<button type='submit' className='btn-primary'>
				Save
			</button>
		</form>
	);
}
