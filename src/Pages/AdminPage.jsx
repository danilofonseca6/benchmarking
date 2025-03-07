import Header from "../components/common/Header.jsx";
import { motion } from "framer-motion";
import StatCard from "../components/common/StatCard.jsx";
import React from "react";
import {Zap} from "lucide-react";
import QuizzesTable from "../components/admin/QuizzesTable.jsx";
import QuestionTable from "../components/admin/QuestionTable.jsx";


const AdminPage = () => {
    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Admin Page" />
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y:20 }}
                    animate={{opacity: 1, y: 0}}
                    transition={{ duration: 1}}
                >
                    <StatCard name='Total Quizzes' icon={Zap} value='15' color='6366F1'/>

                </motion.div>
                <div className='grid grid-col-1 lg:grid-cols gap-8'>
                    <QuizzesTable/>
                    <QuestionTable/>
                </div>

            </main>

        </div>
    )
}

export default AdminPage;