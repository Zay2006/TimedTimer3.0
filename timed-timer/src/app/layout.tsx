import { Inter } from 'next/font/google';
import "./globals.css";
import { TimerProvider } from './context/TimerContext';
import { SettingsProvider } from './context/SettingsContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './hooks/useNotifications';
import ToastManager from './components/feedback/ToastManager';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NotificationProvider>
          <DataProvider>
            <SettingsProvider>
              <TimerProvider>
                {children}
                <ToastManager />
              </TimerProvider>
            </SettingsProvider>
          </DataProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
