import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';

import { api } from "~/utils/api";

import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SessionProvider>
      <main  className={`font-sans ${inter.variable}`}>
        <Component {...pageProps} />
        <Toaster />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
