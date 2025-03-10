'use client';

import { OctagonAlertIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { User } from '@/lib/models/UserModel';
import { formatId } from '@/lib/utils';

export default function Users() {
  const { data: users, error } = useSWR(`/api/admin/users`);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { trigger: deleteUser } = useSWRMutation(
    `/api/admin/users`,
    async (url, { arg }: { arg: { userId: string } }) => {
      const toastId = toast.loading('Deleting user...');
      const res = await fetch(`${url}/${arg.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success('User deleted successfully', {
            id: toastId,
          })
        : toast.error(data.message, {
            id: toastId,
          });
    },
  );

  const openDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUserId) {
      deleteUser({ userId: selectedUserId });
    }
    setIsModalOpen(false);
  };

  if (error) return 'An error has occurred.';
  if (!users) return 'Loading...';

  return (
    <div>
      <h1 className='py-4 text-2xl'>Users</h1>

      <div className='overflow-x-auto'>
        <table className='table table-zebra'>
          <thead className='text-orange-500'>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user._id}>
                <td>{formatId(user._id)}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td
                  className={`${
                    user.isAdmin ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {user.isAdmin ? 'YES' : 'NO'}
                </td>

                <td>
                  <Link
                    href={`/admin/users/${user._id}`}
                    type='button'
                    className='btn btn-ghost btn-sm'
                  >
                    <PencilIcon className='h-4 w-5 text-blue-500' />
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => openDeleteModal(user._id!)}
                    type='button'
                    className='btn btn-ghost btn-sm'
                  >
                    <Trash2Icon className='h-4 w-5 text-red-600' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='rounded-lg bg-gray-800 p-6 shadow-lg'>
            <h2 className='flex items-center text-lg font-bold text-red-600'>
              <OctagonAlertIcon className='mr-1 h-5 w-5' /> Confirm Delete
            </h2>{' '}
            <p>Are you sure you want to delete this user?</p>
            <div className='mt-4 flex justify-end space-x-2'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='btn btn-sm bg-gray-100 text-black'
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className='btn btn-error btn-sm'>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
