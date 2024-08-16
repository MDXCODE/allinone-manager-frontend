'use client'; 

import './css/globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/authProvider';
import Sidebar from '../components/sidebar'; 
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children } : { children: React.ReactNode }) {
  
  const pathname = usePathname(); 
  const sidebarExcludedRoutes = ['/', '/signup', '/signupsuccess'];

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {!sidebarExcludedRoutes.includes(pathname) && <Sidebar />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
