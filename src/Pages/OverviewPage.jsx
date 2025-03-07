import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect } from "react";

import Header from '../components/common/Header.jsx'
import StatCard from '../components/common/StatCard.jsx';
import SalesOverviewChart from '../components/overview/SalesOverviewChart.jsx';
import CategoryDistributionChart from '../components/overview/CategoryDistributionChart.jsx';
import SalesChannelChart from '../components/overview/SalesChannelChart.jsx';
import getSurveyResultsData from "../services/survey_aggregation.jsx";

const OverviewPage = () => {
    useEffect(() => {
        getSurveyResultsData("*General*\n \n\n Please rank the following factors that motivate you most in your current leadership role, both personally and professionally.").then((data) => console.log(data));
    }, []);
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
                    <StatCard name='Total Responses' icon={Zap} value='15' color='6366F1'/>
                    <StatCard name='Most Common Role' icon={Users} value='CEO 5' color='#8B5CF6' />
                    <StatCard name='Another stat here ' icon={ShoppingBag} value='567' color='#EC4899' />
                    <StatCard name='Another stat here ' icon={BarChart2} value='12.3%' color='#10B981' />
                </motion.div>
            {/* CHARTS   */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <SalesOverviewChart/>
                    <CategoryDistributionChart />
                    <SalesChannelChart />


                </div>
            </main>
        </div>
    )
};

export default OverviewPage;