import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCuY8qhF_JDUdHgPW3ZIEqzveVh0YpgYU",
  authDomain: "hackscore-298cf.firebaseapp.com",
  projectId: "hackscore-298cf",
  storageBucket: "hackscore-298cf.firebasestorage.app",
  messagingSenderId: "430528412291",
  appId: "1:430528412291:web:70fa8e9eab76651432f9b6",
  measurementId: "G-BH23PM9HHH",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
