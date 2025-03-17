import React from 'react'
import Link from 'next/link'

const SubCustomDesign = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
        <Link className='bg-pink-500 px-6 py-3 rounded-sm text-white' href="/custom-design">Lets Create Amazing Design</Link>
    </div>
  )
}

export default SubCustomDesign