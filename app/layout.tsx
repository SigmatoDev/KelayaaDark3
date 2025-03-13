import type { Metadata } from 'next';
import { Inter, Marko_One } from 'next/font/google';
import './globals.css';

import DrawerButton from '@/components/DrawerButton';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Providers from '@/components/Providers';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Kelayaa',
  description: 'Kelayaa – your ultimate destination for gold and diamond jewellery',
  icons: {
    icon: '/favicon.ico',        // /public/favicon.ico
    shortcut: '/favicon.ico',    // /public/favicon.ico
    apple: '/favicon.ico',    // /public/apple-icon.png
   
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
      <body className={`${inter.className} `}>
        <Providers>
          <div className='drawer'>
            <DrawerButton />
            <div className='drawer-content'>
              <div className='flex min-h-screen flex-col'>
                <Header />
                {children}
                <Footer />
              </div>
            </div>
            <div className='drawer-side z-50'>
              <label
                htmlFor='my-drawer'
                aria-label='close sidebar'
                className='drawer-overlay'
              ></label>
              <Sidebar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
