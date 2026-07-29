import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { InputProvider } from '@/context/InputContext';

export const metadata: Metadata = {
  title: 'unilagcompass | UNILAG Campus Navigation',
  description: 'Navigation and campus route guide for the University of Lagos (UNILAG)',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-slate-50 text-slate-900" suppressHydrationWarning>
        <InputProvider>
          {children}
        </InputProvider>
      </body>
    </html>
  );
}
