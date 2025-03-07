import { auth, db } from "./firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await setUserDocument(user);
    return user;
};

export const doSignInWithEmailAndPassword = async (email, password) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
};

export const doSignInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await setUserDocument(user);
    return user;
};

export const doSignOut = async () => {
    await signOut(auth);
};

export const doPasswordReset = async (email) => {
    await sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = async (password) => {
    if (auth.currentUser) {
        await updatePassword(auth.currentUser, password);
    }
};

export const doSendEmailVerification = async () => {
    if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, {
            url: `${window.location.origin}/home`,
        });
    }
};

// Helper: Check & Set User Document
const setUserDocument = async (user) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            role: "user",
            quizzesCompleted: 0,
            createdAt: new Date(),
        });
    }
};
