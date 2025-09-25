import Header from "../app/Header";
import Footer from "../app/Footer";
import { PropsWithChildren } from "react";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
