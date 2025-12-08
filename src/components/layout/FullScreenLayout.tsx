import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const FullScreenLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Main Content Area - Full Screen */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-hidden"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default FullScreenLayout;
