import type { Metadata } from 'next';
import './globals.css';
import { NataProvider } from '@/lib/store';
import AppShell from '@/components/ui/AppShell';

export const metadata: Metadata = {
  title: 'NATA - Nata Aktivitas, Target, dan Anggaran Mahasiswa Kos',
  description: 'Aplikasi manajemen perkuliahan, jadwal, tugas, link Google Drive, dan keuangan anak kos mandiri.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <NataProvider>
          <AppShell>{children}</AppShell>
        </NataProvider>
      </body>
    </html>
  );
}
