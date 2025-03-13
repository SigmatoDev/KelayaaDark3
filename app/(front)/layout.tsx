import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelayaa',
  description: 'Kelayaa – your ultimate destination for gold and diamond jewellery',
  icons: {
    icon: '/favicon.ico',        // /public/favicon.ico
    shortcut: '/favicon.ico',    // /public/favicon.ico
    apple: '/favicon.ico',    // /public/apple-icon.png
   
  },
};
export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className='flex-grow'>{children}</main>;
}
