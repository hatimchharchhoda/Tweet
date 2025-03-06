import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { PersistGate } from "redux-persist/integration/react";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
// import { Provider } from 'react-redux';
//import store ,{ persistor } from '@/store/store';  Import both store and persistor
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <Provider store={store}> */}
          {/* PersistGate ensures state is rehydrated before rendering */}
          {/* <PersistGate loading={null} persistor={persistor}> */}
            <AuthProvider>
              <Navbar/>
              <main className="pt-16">{children}</main>
              <Toaster />
            </AuthProvider>
          {/* </PersistGate>
        </Provider> */}
      </body>
    </html>
  );
}
