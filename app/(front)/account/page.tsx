

import React from 'react'
import Link from 'next/link'
export const page = () => {
  return (
    <div>
      <Link 
  href="/custom-design" 
  className="flex items-center p-4 border rounded-lg hover:border-pink-500 transition-all"
>
  <div>
    <h3 className="font-semibold">Custom Design</h3>
    <p className="text-sm text-gray-600">Create your own unique jewelry design</p>
  </div>
</Link> 
    </div>
  )
}
