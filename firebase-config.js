 // firebase-config.js
// 🔥 FREE setup - Cloudinary for images + Firestore for data + Google Auth

// ✅ IMPORTS - All at the top
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, doc, 
  updateDoc, deleteDoc, query, where, orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  browserLocalPersistence, 
  setPersistence 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCCtvETKvK_F2Juc1eYX6Qvg-MoIMU8dIw",
  authDomain: "top-made-realty.firebaseapp.com",
  projectId: "top-made-realty",
  storageBucket: "top-made-realty.firebasestorage.app",
  messagingSenderId: "984525164905",
  appId: "1:984525164905:web:a8a642276a9db0dc57edf8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // ✅ THIS WAS MISSING!

// ☁️ CLOUDINARY CONFIG
const CLOUDINARY_CLOUD_NAME = "dytzpxabq";
const CLOUDINARY_UPLOAD_PRESET = "top-made-realty";

// Upload single image to Cloudinary
async function uploadImage(file) {
  if (!file) return null;
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "top-made-properties");
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    alert("Image upload failed. Please try again.");
    return null;
  }
}

// Upload multiple images
async function uploadMultipleImages(files) {
  if (!files || files.length === 0) return [];
  const uploadPromises = Array.from(files).map(file => uploadImage(file));
  return await Promise.all(uploadPromises);
}

// ✅ GOOGLE SIGN-IN - Works on Website AND App
async function signInWithGoogle() {
  try {
    // Set persistence for WebView compatibility
    await setPersistence(auth, browserLocalPersistence);
    
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log("✅ Google Sign-In Success:", user.email);
    
    // Save user info to localStorage
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.displayName);
    localStorage.setItem("userPhoto", user.photoURL);
    localStorage.setItem("userUid", user.uid);
    
    // Redirect to home/dashboard
    window.location.href = "/index.html";
    
  } catch (error) {
    console.error("❌ Google Sign-In Error:", error.code, error.message);
    alert("Sign in failed: " + error.message);
  }
}

// ✅ LOGOUT FUNCTION
function signOutUser() {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("userPhoto");
  localStorage.removeItem("userUid");
  window.location.href = "/index.html";}

// ✅ MAKE FUNCTIONS GLOBALLY AVAILABLE (for HTML onclick)
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;

// ✅ EXPORTS for other JS files
export { 
  db, 
  auth, // ✅ Now exported!
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  uploadImage,
  uploadMultipleImages,
  signInWithGoogle,
  signOutUser
};