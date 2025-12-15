
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    BarChart3,
    Globe,
    Layers,
    LayoutDashboard,
    LineChart,
    ShieldCheck,
    Zap,
    CheckCircle2,
    PieChart,
    TrendingUp,
    FileSpreadsheet,
    ChevronDown,
    Users,
    DollarSign,
    MousePointer,
    Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "What platforms does IM Console integrate with?",
            answer: "IM Console integrates with major digital marketing platforms including Google Analytics 4, Google Ads, Meta Ads (Facebook & Instagram), YouTube, and more. We are constantly adding new integrations."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, security is our top priority. We use enterprise-grade encryption for all data transmission and storage. We are compliant with major privacy regulations and never share your data with third parties."
        },
        {
            question: "Can I generate reports for my clients?",
            answer: "Absolutely. IM Console includes a powerful white-label reporting engine. You can generate PDF reports with your own branding and schedule them to be sent automatically."
        },
        {
            question: "Is there a free trial?",
            answer: "Yes, we offer a 14-day free trial on all plans so you can explore the platform features before committing."
        }
    ];

    return (
        <div className="flex flex-col w-full overflow-hidden">

            {/* Hero Section */}
            <section className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 md:pt-24 md:pb-32 lg:pt-40 lg:pb-48 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
                {/* Enhanced Background Design */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/5 blur-[140px]" />
                    <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/5 blur-[120px]" />
                    <div className="absolute top-[30%] left-[15%] w-[400px] h-[400px] rounded-full bg-orange-400/5 blur-[100px]" />
                    <div className="absolute top-[10%] right-[20%] w-[300px] h-[300px] rounded-full bg-green-400/5 blur-[80px]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-100 contrast-150 mix-blend-overlay"></div>
                    
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
                </div>

                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-10"
                    >
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-white"></div>
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white"></div>
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-2 border-white"></div>
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">+</div>
                            </div>
                            <span className="font-semibold">Multiple Hotels</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-slate-300"></div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="font-semibold">14-Day Free Trial</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-slate-300"></div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                            <ShieldCheck className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold">No Credit Card Required</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-slate-900 mb-6 sm:mb-8 leading-[1.05]"
                    >
                        Smarter Analytics for <br className="hidden md:block" />
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-red-600 animate-gradient">
                                Modern Hoteliers
                            </span>
                            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-full opacity-30"></span>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4"
                    >
                        Stop guessing with your marketing budget. IM Console unifies all your data into one powerful dashboard, giving you the <span className="text-slate-900 font-bold">clarity you need to grow bookings</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4"
                    >
                        <Link to="/register" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto group h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-base sm:text-lg rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-2xl shadow-red-200/50 hover:shadow-red-300/60 hover:scale-105 transition-all duration-300 font-bold">
                                Start Your Free Trial 
                                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-base sm:text-lg rounded-full border-2 border-slate-300 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:border-red-600 hover:text-red-700 transition-all duration-300 font-semibold">
                                Watch Live Demo
                            </Button>
                        </Link>
                    </motion.div>
                    
                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center justify-center gap-2 mb-20 text-sm text-slate-500"
                    >
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                            ))}
                        </div>
                        <span className="font-medium text-slate-600">4.9/5</span>
                        <span>from 200+ verified reviews</span>
                    </motion.div>

                    {/* Hero Image / Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative mx-auto max-w-7xl px-4"
                    >
                        <div className="relative rounded-xl md:rounded-2xl bg-slate-900 p-1 md:p-2 shadow-2xl ring-1 ring-slate-900/10">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800 to-black opacity-50 rounded-2xl -z-10"></div>
                            <div className="rounded-lg md:rounded-xl overflow-hidden bg-slate-100 aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] border border-slate-800/50 shadow-inner relative group">

                                {/* Simulated Dashboard UI */}
                                <div className="absolute inset-0 bg-slate-50 flex flex-col">
                                    {/* Top Bar */}
                                    <div className="h-8 sm:h-10 md:h-12 border-b border-slate-200 bg-white flex items-center px-2 sm:px-3 md:px-4 justify-between">
                                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                            <div className="flex items-center gap-1 sm:gap-2">
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                                                </div>
                                                <span className="font-bold text-slate-900 text-xs sm:text-sm">IM Console</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="hidden sm:block text-xs text-slate-500">Grand Plaza Hotel</div>
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
                                        </div>
                                    </div>
                                    {/* Layout */}
                                    <div className="flex-1 flex overflow-hidden">
                                        {/* Sidebar */}
                                        <div className="w-12 sm:w-16 md:w-60 border-r border-slate-200 bg-white hidden sm:block p-2 md:p-4 space-y-1 md:space-y-2">
                                            <div className="hidden md:block text-xs font-bold text-slate-400 uppercase px-2 mb-2">Analytics</div>
                                            <div className="flex items-center gap-2 px-1 md:px-2 py-1 md:py-2 rounded-lg bg-red-50 text-red-600">
                                                <LayoutDashboard className="w-3 h-3 md:w-4 md:h-4" />
                                                <span className="hidden md:block text-sm font-medium">Overview</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-1 md:px-2 py-1 md:py-2 rounded-lg hover:bg-slate-50 text-slate-600">
                                                <Globe className="w-3 h-3 md:w-4 md:h-4" />
                                                <span className="hidden md:block text-sm">Google Analytics</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-1 md:px-2 py-1 md:py-2 rounded-lg hover:bg-slate-50 text-slate-600">
                                                <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                                                <span className="hidden md:block text-sm">Meta Ads</span>
                                            </div>
                                        </div>
                                        {/* Main Content */}
                                        <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 bg-slate-50/50 overflow-auto">
                                            <div className="mb-2 md:mb-4">
                                                <h2 className="text-sm sm:text-base md:text-xl font-bold text-slate-900">Performance Overview</h2>
                                                <p className="text-xs sm:text-sm text-slate-500">Last 30 days</p>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-4">
                                                <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-3 md:p-4 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
                                                    <div className="relative">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                                                <DollarSign className="w-4 h-4 text-red-600" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-slate-500 mb-1">Total Revenue</div>
                                                        <div className="text-lg md:text-2xl font-bold text-slate-900">₹3.2M</div>
                                                        <div className="text-xs text-green-600 font-medium mt-1">+18.2%</div>
                                                    </div>
                                                </div>
                                                <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-3 md:p-4 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
                                                    <div className="relative">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                                <Users className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-slate-500 mb-1">Visitors</div>
                                                        <div className="text-lg md:text-2xl font-bold text-slate-900">48.5K</div>
                                                        <div className="text-xs text-green-600 font-medium mt-1">+12.5%</div>
                                                    </div>
                                                </div>
                                                <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-3 md:p-4 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
                                                    <div className="relative">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                                                <MousePointer className="w-4 h-4 text-orange-600" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-slate-500 mb-1">Conv. Rate</div>
                                                        <div className="text-lg md:text-2xl font-bold text-slate-900">4.8%</div>
                                                        <div className="text-xs text-red-600 font-medium mt-1">-2.1%</div>
                                                    </div>
                                                </div>
                                                <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-3 md:p-4 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
                                                    <div className="relative">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                                                <Activity className="w-4 h-4 text-purple-600" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-slate-500 mb-1">Avg. Session</div>
                                                        <div className="text-lg md:text-2xl font-bold text-slate-900">3m 24s</div>
                                                        <div className="text-xs text-green-600 font-medium mt-1">+8.3%</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-slate-100 p-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div>
                                                            <h3 className="text-sm font-bold text-slate-900">Revenue Trend</h3>
                                                            <p className="text-xs text-slate-500">Daily performance</p>
                                                        </div>
                                                        <div className="text-xs font-medium text-green-600 flex items-center gap-1">
                                                            <TrendingUp className="w-3 h-3" /> +18.2%
                                                        </div>
                                                    </div>
                                                    <div className="h-40 flex items-end justify-between gap-1">
                                                        {[65, 78, 72, 88, 75, 92, 85, 95, 88, 98, 90, 85, 92, 88, 95].map((h, i) => (
                                                            <div key={i} className="flex-1 group relative">
                                                                <div 
                                                                    style={{ height: `${h}%` }} 
                                                                    className={`w-full rounded-t transition-all duration-300 ${
                                                                        i === 14 ? 'bg-gradient-to-t from-red-500 to-orange-400' : 
                                                                        i >= 12 ? 'bg-gradient-to-t from-red-400 to-orange-300' :
                                                                        'bg-gradient-to-t from-blue-200 to-blue-100'
                                                                    } hover:from-red-600 hover:to-orange-500 cursor-pointer`}
                                                                >
                                                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                        ₹{(h * 1000 + 45000).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                                                        <span>Nov 26</span>
                                                        <span>Dec 10</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-4">
                                                    <h3 className="text-sm font-bold text-slate-900 mb-4">Traffic Sources</h3>
                                                    <div className="relative w-32 h-32 mx-auto mb-4">
                                                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="20"/>
                                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="20" strokeDasharray="125.6 251.2" strokeDashoffset="0"/>
                                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="75.36 251.2" strokeDashoffset="-125.6"/>
                                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray="50.24 251.2" strokeDashoffset="-200.96"/>
                                                        </svg>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                                <span className="text-slate-600">Organic</span>
                                                            </div>
                                                            <span className="font-medium text-slate-900">50%</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                                <span className="text-slate-600">Paid</span>
                                                            </div>
                                                            <span className="font-medium text-slate-900">30%</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                                                <span className="text-slate-600">Social</span>
                                                            </div>
                                                            <span className="font-medium text-slate-900">20%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg transform scale-95 group-hover:scale-100 transition-transform duration-300">
                                        Interactive Dashboard Preview
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-10 border-y border-slate-100">
                <div className="container mx-auto px-4">
                    <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Trusted by leading Hospitality groups</p>
                    <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><Zap className="w-6 h-6 text-red-500" /> CrownHotels</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><Globe className="w-6 h-6 text-blue-500" /> VistaGroup</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><Layers className="w-6 h-6 text-orange-500" /> PrimeStay</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><BarChart3 className="w-6 h-6 text-green-500" /> EliteResorts</div>
                    </div>
                </div>
            </section>

            {/* Feature Block 1: Unified Data */}
            <section className="py-24 bg-white" id="features">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="absolute -inset-4 bg-red-50 rounded-full blur-3xl opacity-60"></div>
                            <div className="relative rounded-2xl border border-slate-100 shadow-2xl bg-white p-6 md:p-8">
                                {/* Revenue Chart with Grid */}
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <div className="text-sm text-slate-500 uppercase font-semibold mb-1">Total Revenue</div>
                                        <div className="text-3xl font-bold text-slate-900">₹3,28,430</div>
                                        <div className="text-sm text-slate-500 mt-1">from Google Ads & Organic</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center">
                                            <TrendingUp className="w-4 h-4 mr-1" /> +12.5%
                                        </div>
                                        <div className="text-xs text-slate-400">vs last month</div>
                                    </div>
                                </div>
                                {/* Grid Lines */}
                                <div className="relative h-56 mb-2">
                                    <div className="absolute inset-0 flex flex-col justify-between">
                                        {[0, 1, 2, 3, 4].map((i) => (
                                            <div key={i} className="flex items-center">
                                                <span className="text-xs text-slate-400 w-12">₹{(100 - i * 25)}K</span>
                                                <div className="flex-1 border-t border-slate-100 border-dashed ml-2"></div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Bars */}
                                    <div className="relative h-full flex items-end gap-2 pt-4">
                                        {[
                                            { height: 40, label: 'W1' },
                                            { height: 65, label: 'W2' },
                                            { height: 45, label: 'W3' },
                                            { height: 80, label: 'W4' },
                                            { height: 55, label: 'W5' },
                                            { height: 90, label: 'W6' },
                                            { height: 70, label: 'W7' },
                                            { height: 85, label: 'W8' },
                                            { height: 60, label: 'W9' },
                                            { height: 95, label: 'W10' }
                                        ].map((bar, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center group">
                                                <div className="w-full relative" style={{ height: '100%' }}>
                                                    <div 
                                                        style={{ height: `${bar.height}%` }} 
                                                        className="w-full bg-gradient-to-t from-red-500 to-orange-400 rounded-t hover:from-red-600 hover:to-orange-500 transition-all duration-300 cursor-pointer absolute bottom-0 shadow-lg"
                                                    >
                                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                            ₹{(bar.height * 800 + 15000).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* X-axis labels */}
                                <div className="flex justify-between text-xs text-slate-400 px-1 mt-2">
                                    <span>Week 1</span>
                                    <span>Week 5</span>
                                    <span>Week 10</span>
                                </div>
                                {/* Legend */}
                                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-3 h-3 rounded bg-gradient-to-br from-red-500 to-orange-400"></div>
                                        <span className="text-slate-600">Direct Bookings</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-3 h-3 rounded bg-blue-200"></div>
                                        <span className="text-slate-600">Referrals</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-bold mb-6">
                                <LayoutDashboard className="w-4 h-4 mr-2" /> Unified Console
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                All your marketing data in one place.
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Say goodbye to spreadsheet chaos. IM Console connects automatically to Google, Facebook, Instagram, and more to bring you a single source of truth for your hotel's performance.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Real-time data synchronization",
                                    "Cross-channel performance comparison",
                                    "Automatic currency conversion",
                                    "Historical data retention"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-slate-700">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Block 2: Reporting */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-6">
                                <FileSpreadsheet className="w-4 h-4 mr-2" /> Automated Reporting
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                Reports that impress owners & stakeholders.
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Generate beautiful, branded PDF reports in seconds. Schedule them to be sent automatically so you never have to scramble for a monthly review again.
                            </p>
                            <div className="flex gap-4">
                                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex-1">
                                    <div className="text-3xl font-bold text-slate-900 mb-1">5h+</div>
                                    <div className="text-sm text-slate-500">Saved per week</div>
                                </div>
                                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex-1">
                                    <div className="text-3xl font-bold text-slate-900 mb-1">100%</div>
                                    <div className="text-sm text-slate-500">Accuracy rate</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
                            <div className="relative rounded-2xl border border-slate-200 shadow-xl bg-white p-6">
                                <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden relative p-6">
                                    {/* Report Preview */}
                                    <div className="bg-white rounded-lg shadow-2xl p-6 h-full flex flex-col">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                                    <BarChart3 className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-sm">Monthly Report</h3>
                                                    <p className="text-xs text-slate-500">November 2024</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500">Grand Plaza Hotel</div>
                                                <div className="text-xs font-bold text-slate-700">Performance Summary</div>
                                            </div>
                                        </div>
                                        
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <div className="text-xs text-slate-500 mb-1">Total Revenue</div>
                                                <div className="text-lg font-bold text-slate-900">₹3.2M</div>
                                                <div className="text-xs text-green-600 font-medium">↑ 18.2%</div>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <div className="text-xs text-slate-500 mb-1">Bookings</div>
                                                <div className="text-lg font-bold text-slate-900">1,248</div>
                                                <div className="text-xs text-green-600 font-medium">↑ 12.5%</div>
                                            </div>
                                        </div>
                                        
                                        {/* Mini Chart */}
                                        <div className="flex-1 flex items-end gap-1 mb-4">
                                            {[30, 45, 35, 60, 50, 70, 65, 80].map((h, i) => (
                                                <div key={i} className="flex-1 bg-gradient-to-t from-red-500 to-orange-400 rounded-t" style={{ height: `${h}%` }}></div>
                                            ))}
                                        </div>
                                        
                                        {/* Channel Breakdown */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-600">Google Ads</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="w-3/4 h-full bg-red-500"></div>
                                                    </div>
                                                    <span className="font-medium text-slate-900 w-8">75%</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-600">Meta Ads</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="w-1/2 h-full bg-blue-500"></div>
                                                    </div>
                                                    <span className="font-medium text-slate-900 w-8">50%</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-600">Organic</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="w-2/3 h-full bg-green-500"></div>
                                                    </div>
                                                    <span className="font-medium text-slate-900 w-8">65%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Features Grid */}
            <section className="py-24 bg-white" id="how-it-works">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Designed for Performance</h2>
                        <p className="text-lg text-slate-600">Every feature is built to help you optimize ad spend and increase direct bookings.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <PieChart className="w-6 h-6 text-red-600" />,
                                title: "Attribution Modeling",
                                desc: "Understand exactly which channels are driving bookings with advanced attribution."
                            },
                            {
                                icon: <Globe className="w-6 h-6 text-blue-600" />,
                                title: "Geographic Insights",
                                desc: "Drill down into performance by city, region, or country to target high-value travelers."
                            },
                            {
                                icon: <Zap className="w-6 h-6 text-orange-600" />,
                                title: "Real-time Alerts",
                                desc: "Get notified instantly when ad spend spikes or conversion rates drop."
                            },
                            {
                                icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
                                title: "Brand Safety",
                                desc: "Monitor where your ads are appearing to ensure brand reputation protection."
                            },
                            {
                                icon: <LineChart className="w-6 h-6 text-purple-600" />,
                                title: "Forecasting",
                                desc: "AI-driven predictions help you plan budget allocation for upcoming seasons."
                            },
                            {
                                icon: <Layers className="w-6 h-6 text-slate-600" />,
                                title: "Competitor Benchmarking",
                                desc: "See how your metrics compare to industry standards and local competitors."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-red-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                                <div className="w-14 h-14 rounded-xl bg-slate-50 group-hover:bg-red-50 flex items-center justify-center mb-6 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-slate-50/50 border-t border-slate-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full text-left px-8 py-6 flex items-center justify-between focus:outline-none"
                                >
                                    <span className="text-lg font-bold text-slate-800">{faq.question}</span>
                                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${openFaq === index ? 'transform rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-8 pb-8 text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative py-24 bg-red-600 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply"></div>
                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl"></div>

                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to transform your hotel's marketing?</h2>
                    <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
                        Join multiple hotel managers who are saving time and driving more direct bookings with IM Console.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register">
                            <Button size="lg" className="h-14 px-8 text-red-600 bg-white hover:bg-slate-100 text-lg rounded-full shadow-2xl transition-all duration-300 border-2 border-white">
                                Get Started Now
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-8 text-sm text-red-200">No credit card required for 14-day trial</p>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
