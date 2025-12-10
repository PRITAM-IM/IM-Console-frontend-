
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoveRight, Menu, X, User, LogOut, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const LandingLayout = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
            {/* Navigation */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-200/50" : "bg-transparent py-5"
                    }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo - Matching Dashboard Style */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200 group-hover:shadow-red-300 transition-all duration-300 group-hover:scale-105">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col -gap-1">
                                <span className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
                                    IM Console
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                                    Hotel Analytics
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors">
                                Home
                            </Link>
                            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors">
                                Features
                            </a>
                            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors">
                                How it Works
                            </a>

                            <div className="h-6 w-px bg-slate-200 mx-2"></div>

                            <div className="flex items-center gap-3">
                                {isAuthenticated ? (
                                    <>
                                        <Link to="/dashboard">
                                            <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6">
                                                <User className="w-4 h-4 mr-2" /> Dashboard
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" className="text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={logout}>
                                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login">
                                            <Button variant="ghost" className="text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-full font-semibold">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link to="/register">
                                            <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg shadow-red-200 hover:shadow-red-300 transition-all duration-300 rounded-full px-6 font-semibold">
                                                Get Started <MoveRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                        <Link to="/" className="text-sm font-medium text-slate-600 p-3 hover:bg-slate-50 rounded-lg">
                            Home
                        </Link>
                        <a href="#features" className="text-sm font-medium text-slate-600 p-3 hover:bg-slate-50 rounded-lg">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-sm font-medium text-slate-600 p-3 hover:bg-slate-50 rounded-lg">
                            How it Works
                        </a>
                        <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="w-full">
                                        <Button className="w-full justify-center bg-red-600 hover:bg-red-700 text-white rounded-full">
                                            <User className="w-4 h-4 mr-2" /> Dashboard
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" className="w-full justify-center text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={logout}>
                                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="w-full">
                                        <Button variant="ghost" className="w-full justify-center hover:bg-slate-100 rounded-full">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link to="/register" className="w-full">
                                        <Button className="w-full justify-center bg-red-600 hover:bg-red-700 text-white rounded-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="pt-24 min-h-[calc(100vh-400px)]">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 text-slate-600 py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <Link to="/" className="flex items-center gap-2 mb-6 group">
                                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold border border-red-500">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-slate-900">IM Console</span>
                            </Link>
                            <p className="text-sm leading-relaxed text-slate-500">
                                Data-driven insights for modern hoteliers. Manage your digital presence, ads, and analytics in one unified dashboard.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-wider">Product</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#features" className="hover:text-red-600 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-red-600 transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-red-600 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-red-600 transition-colors">Enterprise</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-wider">Resources</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-red-600 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-red-600 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-red-600 transition-colors">Community</a></li>
                                <li><a href="#" className="hover:text-red-600 transition-colors">Help Center</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-wider">Legal</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/privacy-policy" className="hover:text-red-600 transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/terms-of-service" className="hover:text-red-600 transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} IM Console. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons Placeholder */}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingLayout;
