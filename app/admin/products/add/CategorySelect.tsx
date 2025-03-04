// components/CategorySelect.tsx
import { useEffect } from 'react';

interface CategorySelectProps {
  onCategoryChange: (category: string) => void;
}

const CategorySelect = ({ onCategoryChange }: CategorySelectProps) => {
  const categories = [
    'Pendants',
    'Rings',
    'Earrings',
    'Bangles',
    'Bracelets',
    'Sets',
    'Toe Rings',
    'Necklaces',
    'Chain',
  ]; // You can expand this list later.

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value);
  };

  return (
    <div className='mb-6'>
      <label className='label' htmlFor='category'>
        Choose Category
      </label>
      <select
        id='category'
        className='select select-bordered w-full max-w-md'
        onChange={handleChange}
      >
        <option value=''>Select Category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
