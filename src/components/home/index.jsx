import React from 'react';
import { useAuth } from '../../contexts/authContext';
import Sidebar from '../../components/common/Sidebar.jsx';
import OverviewPage from "../../Pages/OverviewPage.jsx";

const Home = () => {
    const { currentUser } = useAuth();
    return (

        <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">

            <div className="fixed inset-0 z-0">
                   <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80'/>
                   <div className='absolute inset-0 backgrop-blur-sm'/>
            </div>
            <Sidebar/>
            <OverviewPage/>
            {/*Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.*/}
        </div>
    )
}

export default Home