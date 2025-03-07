import Header from "../components/common/Header.jsx";
import {motion} from "framer-motion";
import StatCard from "../components/common/StatCard.jsx";
import {BarChart2, ShoppingBag, Users, Zap} from "lucide-react";
import SalesOverviewChart from "../components/overview/SalesOverviewChart.jsx";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart.jsx";
import SalesChannelChart from "../components/overview/SalesChannelChart.jsx";
import React from "react";


const HomePage = () => {
    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Overview" />
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8 '>
                {/* STATS   */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y:20 }}
                    animate={{opacity: 1, y: 0}}
                    transition={{ duration: 1}}
                >
                    <StatCard name='HOME PAGE' icon={Zap} value='15' color='6366F1'/>

                </motion.div>

            </main>
        </div>
    )
}

export default HomePage;