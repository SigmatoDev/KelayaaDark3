'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ValidationRule, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { Product } from '@/lib/models/ProductModel';
import { formatId } from '@/lib/utils';

export default function ProductEditForm({ productId }: { productId: string }) {
  const { data: product, error } = useSWR(`/api/admin/products/${productId}`);
  const router = useRouter();
  const { trigger: updateProduct, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/products/${productId}`,
    async (url, { arg }) => {
      const res = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success('Product updated successfully');
      router.push('/admin/products');
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Product>();

  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [additionalFields, setAdditionalFields] = useState<string[]>([]);

  const productTypes: string[] = [
    'Pendants',
    'Rings',
    'Earrings',
    'Bangles',
    'Bracelets',
    'Sets',
    'Toe Rings',
    'Necklaces',
    'Chain',
  ];

  const categoryTypes: string[] = [
    'Turquoise',
    'Silver',
    'Enamel',
    'Coral',
    'Moon Stone',
    'Semi-Precious Stones',
    'Amathyst',
    'Garnet',
    'Agate',
    'Onyx',
    'Agate and Semi Precious Stones',
    'Synthetic Stones',
    'Crystal',
    'Rose Quartz',
    'Pearl',
    'Topaz',
    'AD',
    'Ox-Silver',
    'Lapis Lazuli',
    'Ox-Silver (Beads)',
  ];

  const ringCategoryTypes: string[] = [
    'Cocktail Ring',
    'Cocktail Rings',
    'Silver',
    'Minimalist',
  ];

  const categoryMapping: { [key: string]: string[] } = {
    Men: ['Ring', 'Earring', 'Bracelet'],
    Women: ['Necklace', 'Earring', 'Bangle', 'Ring'],
    Children: ['Ring', 'Pendant', 'Charm'],
  };

  const selectedCategory = watch('category');
  const selectedProductCategory = watch('productCategory');

  useEffect(() => {
    if (!product) return;
    setValue('name', product.name);
    setValue('productCode', product.productCode);
    setValue('weight', product.weight);
    setValue('price_per_gram', product.price_per_gram);
    setValue('info', product.info);
    setValue('slug', product.slug);
    setValue('price', product.price);
    setValue('image', product.image);
    setValue('category', product.category);
    setValue('productCategory', product.productCategory);
    setValue('description', product.description);
    if (product.category) {
      setSubcategories(categoryMapping[product.category] || []);
    }
  }, [product, setValue]);

  useEffect(() => {
    if (selectedCategory) {
      setSubcategories(categoryMapping[selectedCategory] || []);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedProductCategory === 'Ring') {
      setAdditionalFields(['ringSize', 'grossWeight', 'goldWeight']);
    } else {
      setAdditionalFields([]);
    }
  }, [selectedProductCategory]);

  // Dynamically calculate price
  useEffect(() => {
    const weight = Number(watch('weight') || 0);
    const pricePerGram = Number(watch('price_per_gram') || 0);
    const calculatedPrice = weight * pricePerGram;

    if (!isNaN(calculatedPrice)) {
      setValue('price', Number(calculatedPrice.toFixed(2)));
    }
  }, [watch('weight'), watch('price_per_gram')]);

  const formSubmit = async (formData: any) => {
    await updateProduct(formData);
  };

  const uploadHandler = async (e: any) => {
    const toastId = toast.loading('Uploading image...');
    try {
      const resSign = await fetch('/api/cloudinary-sign', {
        method: 'POST',
      });
      const { signature, timestamp } = await resSign.json();
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );
      const data = await res.json();
      setValue('image', data.secure_url);
      toast.success('File uploaded successfully', {
        id: toastId,
      });
    } catch (err: any) {
      toast.error(err.message, {
        id: toastId,
      });
    }
  };

  if (error) return error.message;

  if (!product) return 'Loading...';

  const FormInput = ({
    id,
    name,
    required,
    pattern,
    type = 'text',
    options,
    className = '',
  }: {
    id: keyof Product;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
    type?: string;
    options?: { label: string; value: string }[];
    className?: string; // Add this line
  }) => (
    <div className='mb-1'>
      <label className='label' htmlFor={id}>
        {name}
      </label>
      <div className='w-full'>
        {options ? (
          <select
            {...register(id, {
              required: required && `${name} is required`,
            })}
            className={`select select-bordered w-full ${className}`}
          >
            <option value=''>Select {name}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={id}
            {...register(id, {
              required: required && `${name} is required`,
              pattern,
            })}
            className={`input input-bordered w-full ${className}`} // Add className here
          />
        )}
        {errors[id]?.message && (
          <div className='text-error'>{errors[id]?.message}</div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className='my-4 py-1 text-2xl text-orange-500'>
        Edit Product {formatId(productId)}
      </h1>
      <form
        onSubmit={handleSubmit(formSubmit)}
        className='grid grid-cols-1 gap-2 sm:grid-cols-2'
      >
        <FormInput
          name='Product Category'
          id='productCategory'
          required
          options={productTypes.map((type) => ({
            label: type,
            value: type,
          }))}
        />
        <FormInput name='Name' id='name' required />
        <FormInput name='ProductCode' id='productCode' required />
        <FormInput name='Weight (Grms)' id='weight' required />
        <FormInput name='Price/gram' id='price_per_gram' required />
        <FormInput
          name='Price'
          id='price'
          required
          className='w-f input input-bordered  text-red-500'
        />
        <FormInput
          name='Info'
          id='info'
          required
          options={categoryTypes.map((type) => ({
            label: type,
            value: type,
          }))}
        />

        {selectedProductCategory === 'Rings' && (
          <FormInput
            name='Category'
            id='category'
            required
            options={ringCategoryTypes.map((type) => ({
              label: type,
              value: type,
            }))}
          />
        )}
        <FormInput name='Slug' id='slug' required />
        <FormInput name='Image' id='image' />
        <FormInput name='Description' id='description' required />

        <div className='mb-6'>
          <label className='label' htmlFor='imageFile'>
            Upload Image
          </label>
          <input
            type='file'
            className='file-input w-full'
            id='imageFile'
            onChange={uploadHandler}
          />
        </div>

        <div className='col-span-2 my-3 flex gap-4 '>
          <button
            type='submit'
            disabled={isUpdating}
            className='btn btn-primary flex-1'
          >
            {isUpdating && <span className='loading loading-spinner'></span>}
            Update
          </button>
          <Link
            className='btn flex-1 bg-red-600 text-white'
            href='/admin/products'
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
