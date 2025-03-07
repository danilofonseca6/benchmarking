import {
    BarChart2,
    DollarSign,
    Menu,
    Settings,
    ShoppingBag,
    ShoppingCart,
    TrendingUp,
    Users,
    Home,
    UserPen,
    LogOut
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { doSignOut } from "../../config/auth.js";
import { useAuth } from "../../contexts/authContext/index.jsx";



const SIDEBAR_ITEMS = [
    { name: "Home", icon: Home, color: "#FFFFFF", href: "/home" },
    { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/overview",},
    { name: "Respondents", icon: Users, color: "#EC4899", href: "/users" },
    { name: "Admin", icon: UserPen, color: "#FFFFFF", href: "/adminpage" },
    { name: "Products", icon: ShoppingCart, color: "#EC4899", href: "/products" },

];

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    return (
        <motion.div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
                isSidebarOpen ? "w-64" : "w-20"
            }`}
            animate={{ width: isSidebarOpen ? 256 : 80 }}
        >
            <div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
                >
                    <Menu size={24} />
                </motion.button>
                {/* Sidebar Navigation */}
                <nav className='mt-8 flex-grow'>
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link key={item.href} to={item.href}>
                            <motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
                                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className='ml-4 whitespace-nowrap'
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
                </nav>

                {/* Logout Button (Bottom of Sidebar) */}
                <div className="mt-auto">
                    <button
                        onClick={() => {
                            doSignOut().then(() => navigate("/login"));
                        }}
                        className="w-full flex items-center justify-center text-sm text-white hover:text-red-600 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <LogOut size={20} className="mr-2" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>

            </div>
        </motion.div>
    );
};
export default Sidebar;