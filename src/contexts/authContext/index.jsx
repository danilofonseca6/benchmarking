import React, { useEffect, useContext, useState } from "react";
import { auth } from "../../config/firebase.js";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();


export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user || null);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = { currentUser, userLoggedIn: !!currentUser, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
// export function AuthProvider({ children }) {
//     const [currentUser, setCurrentUser] = React.useState(null);
//     const [userLoggedIn, setUserLoggedIn] = React.useState(false);
//     const [loading, setLoading] = React.useState(true);
//
//     useEffect(()=>{
//         const unsubscribe = onAuthStateChanged(auth, initalizeUser);
//         return unsubscribe;
//     }, [])
//
//     async function initalizeUser(user) {
//         if (user) {
//             setCurrentUser({ ...user});
//             setUserLoggedIn(true);
//         } else {
//             setUserLoggedIn(false);
//         }
//         setLoading(false);
//     }
//
//     const value = {
//         currentUser,
//         userLoggedIn,
//         loading
//     }
//
//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//         </AuthContext.Provider>
//     )
// }