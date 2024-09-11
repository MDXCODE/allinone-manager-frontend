"use client";

import "../css/globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "../context/auth-context/authProvider";
import { NotesProvider } from "../context/page-context/notesContext";
import { AuxRequestsProvider } from "../context/api-context/auxRequests";
import Sidebar from "../components/nav/sidebar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sidebarExcludedRoutes = ["/", "/signup", "/signupsuccess"];

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuxRequestsProvider>
            <NotesProvider>
              {!sidebarExcludedRoutes.includes(pathname) && <Sidebar />}
              {children}
            </NotesProvider>
          </AuxRequestsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
