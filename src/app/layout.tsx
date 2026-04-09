import { ReduxProvider } from '@/store/provider'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import ThemeController from '@/components/ThemeController/ThemeController'
import GlobalModals from '@/components/GlobalModals/GlobalModals'
import "./(store)/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ReduxProvider>
          <ThemeController />
          {children}
          <GlobalModals />
        </ReduxProvider>
      </body>
    </html>
  )
}