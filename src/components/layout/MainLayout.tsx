import { ReactNode } from "react";
import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";

interface MainLayoutProps {
  children: ReactNode;
  hideLeftSidebar?: boolean;
}

const MainLayout = ({ children, hideLeftSidebar }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex gap-4">
          {!hideLeftSidebar && <LeftSidebar />}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
