import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Header from "@/components/navigation/Header";
import MainSidebar from "@/components/dashboard/MainSidebar";
import ProjectSelector from "@/components/dashboard/ProjectSelector";
import { Button } from "@/components/ui/button";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20">
        <Header />
      </div>

      {/* Mobile Menu Toggle - Only visible on mobile */}
      <div className="md:hidden fixed top-20 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-lg"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Content Container */}
      <div className="flex flex-1 pt-16 md:pt-20 overflow-hidden">
        {/* Permanent Main Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <MainSidebar />
        </div>

        {/* Project Selector - Hidden on mobile unless menu is open */}
        <div className={`${isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-30 mt-16 md:mt-20 bg-white shadow-xl md:shadow-none' : 'hidden'} md:block md:relative md:mt-0`}>
          <ProjectSelector onMobileClose={() => setIsMobileMenuOpen(false)} />
        </div>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-20 mt-16"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 overflow-auto bg-slate-50"
        >
          <div className="p-3 sm:p-4 md:p-6">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;


