import { Inter } from 'next/font/google';
import "./globals.css";
import { TimerProvider } from './context/TimerContext';
import { SettingsProvider } from './context/SettingsContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './hooks/useNotifications';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { AchievementProvider } from './context/AchievementContext';
import { MainNav } from './components/navigation/MainNav';
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
                <AnalyticsProvider>
                  <AchievementProvider>
                    <div className="min-h-screen bg-background">
                      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="container flex h-14 items-center">
                          <MainNav />
                        </div>
                      </header>
                      <main className="flex-1">
                        {children}
                      </main>
                    </div>
                    <ToastManager />
                  </AchievementProvider>
                </AnalyticsProvider>
              </TimerProvider>
            </SettingsProvider>
          </DataProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
