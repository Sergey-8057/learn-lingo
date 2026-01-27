import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import ToastProvider from './providers/ToastProvider';

import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header/Header';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-family',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: 'LearnLingo',
  description: 'Online platform for learning foreign languages with professional teachers.',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} container`}>
        <ToastProvider />
        <AuthProvider>
          <Header />
          <main>
            {children}
            {modal}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
