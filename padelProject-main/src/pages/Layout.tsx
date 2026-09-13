// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import NavigationMenu from "@/components/ui/navigation-menu";
import  Footer  from "@/components/ui/Footer";

export default function Layout() {
  return (
    <>
      <NavigationMenu />
      <div className="pt-[80px] bg-padel-dark text-padel-text">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
