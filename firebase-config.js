 // firebase-config.js - Clean Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCtvETKvK_F2Juc1eYX6Qvg-MoIMU8dIw",
  authDomain: "top-made-realty.firebaseapp.com",
  projectId: "top-made-realty",
  storageBucket: "top-made-realty.firebasestorage.app",
  messagingSenderId: "984525164905",
  appId: "1:984525164905:web:a8a642276a9db0dc57edf8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Cloudinary Config
const CLOUDINARY_CLOUD_NAME = "dytzpxabq";
const CLOUDINARY_UPLOAD_PRESET = "top-made-realty";

// Upload Image to Cloudinary
async function uploadImage(file) {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "top-made-properties");
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

// Upload Multiple Images
async function uploadMultipleImages(files) {
  if (!files || files.length === 0) return [];
  return await Promise.all(Array.from(files).map(file => uploadImage(file)));
}

// Export everything
export { 
  auth, db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, 
  query, where, orderBy, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail,
  uploadImage, uploadMultipleImages 
};