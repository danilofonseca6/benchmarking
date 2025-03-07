import { Home } from "lucide-react";
import { Link, useNavigate} from "react-router-dom";
import {doSignOut} from "../../config/auth.js";
import {useAuth} from "../../contexts/authContext/index.jsx";

const Header = ({ title }) => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();
    return (
        <header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700'>
            <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
                <h1 className='text-2xl font-semibold text-gray-100'>{title}</h1>

            </div>
            {/*{*/}
            {/*    userLoggedIn*/}
            {/*        ?*/}
            {/*        <>*/}
            {/*            <button onClick={() => {doSignOut().then(() => {navigate('/login') }) }} className='text-sm text-blue-600 underline'>Logout</button>*/}

            {/*        </>*/}
            {/*        :*/}
            {/*        <>*/}
            {/*            <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>*/}
            {/*            <Link className='text-sm text-blue-600 underline' to={'/register'} >Register New Account</Link>*/}
            {/*        </>*/}
            {/*}*/}
            {/*<div className="">*/}

            {/*</div>*/}

        </header>
    );
};
export default Header;