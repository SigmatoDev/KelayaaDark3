import Image from 'next/image';
import Link from 'next/link';

import Overlay from './Overlay';
import Silver1 from '../../public/images/categories/Silver4.jpg';
import Silver3 from '../../public/images/categories/Silver3.jpg';
import Silver5 from '../../public/images/categories/Silver5.avif';

const Categories = () => {
  return (
    <div className='flex flex-col md:grid md:auto-rows-[330px] md:grid-cols-4 gap-4'>
      <Link
        href='/search?category=Necklaces'
        className='group relative h-[330px] md:col-span-2 md:row-span-2 overflow-hidden'
      >
        <Image
          src={Silver1}
          alt='Collection of necklaces'
          width={500}
          height={500}
          className='h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110'
          placeholder='blur'
          loading='lazy'
        />
        <Overlay category='Necklaces' />
      </Link>
      <Link
        href='/search?category=Rings'
        className='group relative h-[330px] md:col-span-2 overflow-hidden'
      >
        <Image
          src={Silver3}
          alt='Collection of rings'
          width={500}
          height={500}
          className='h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110'
          placeholder='blur'
          loading='lazy'
        />
        <Overlay category='Rings' />
      </Link>
      <Link
        href='/search?category=Pendants'
        className='group relative h-[330px] md:col-span-2 overflow-hidden'
      >
        <Image
          src={Silver5}
          alt='Collection of pendant'
          width={500}
          height={500}
          className='h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110'
          placeholder='blur'
          loading='lazy'
        />
        <Overlay category='Pendants' />
      </Link>
    </div>
  );
};

export default Categories;
