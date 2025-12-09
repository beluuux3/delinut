import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Delinut - Almuerzos Saludables",
  description:
    "Ofrecemos almuerzos saludables, con un excelente sabor y directo a tu puerta - La Paz, Bolivia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
