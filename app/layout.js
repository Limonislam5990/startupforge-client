import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TokenSync from "../components/TokenSync";

export const metadata = {
  title: {
    default: "StartupForge | Startup Team Builder",
    template: "%s | StartupForge",
  },
  description:
    "StartupForge connects startup founders with developers, designers and marketers who want to join a team.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <TokenSync />
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      </body>
    </html>
  );
}
