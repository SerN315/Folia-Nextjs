import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "./scss/styles.scss";
import "./scss/index.scss";
import "./scss/intro.scss";
import "./scss/hub.scss";
import "./scss/home.scss";
import "./scss/pro5.scss";
import "./scss/setting.scss";
import TopNav from "./Component/header";
import Footer from "./Component/footer";
import { TranslationProvider } from "./Component/TranslationProvider"; // Use named import if it was defined as such

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children, params: { locale } }) {
  return (
    <html lang={locale || "en"}>
      <body className={inter.className}>
        <TranslationProvider locale={locale} namespaces={['footer', 'profile+setting']}>
          <TopNav />
          {children}
          <Footer />
        </TranslationProvider>
      </body>
    </html>
  );
}
