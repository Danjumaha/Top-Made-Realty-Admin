 // firebase-config.js
// 🔥 Professional setup - Works on Website + App

// ✅ IMPORTS
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
const auth = getAuth(app);

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
    );
    const data = await response.json();    return data.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

// Upload multiple images
async function uploadMultipleImages(files) {
  if (!files || files.length === 0) return [];
  const uploadPromises = Array.from(files).map(file => uploadImage(file));
  return await Promise.all(uploadPromises);
}

// 🔍 Detect if running in WebView (APK) or normal browser
function isWebView() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  // Check for WebView indicators
  return /(wv|WebView|; wv\)|Version\/[\d.]+.*Chrome\/[\d.]+ Mobile)/i.test(ua) && 
         /Android|iPhone|iPad|iPod/i.test(ua);
}

// ✅ GOOGLE SIGN-IN - Smart: Works on Website, Friendly Message in App
async function signInWithGoogle() {
  try {
    // If in WebView (APK), show friendly message instead of error
    if (isWebView()) {
      // Hide the alert - just redirect to use email/password
      console.log("ℹ️ Google Sign-In not available in app - using fallback");
      
      // Optional: Show a gentle, professional message (not an error!)
      const confirmUseEmail = confirm("For the best experience in the app, please use Email & Password. Google Sign-In is fully available on our website.");
      
      if (confirmUseEmail) {
        // Redirect to login page with email/password focus
        window.location.href = "/login.html?method=email";
      }
      return; // Stop here - no Firebase error!
    }
    
    // ✅ FOR WEBSITE ONLY: Full Google Sign-In
    await setPersistence(auth, browserLocalPersistence);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log("✅ Google Sign-In Success:", user.email);
    
    // Save user info
    localStorage.setItem("userEmail", user.email);    localStorage.setItem("userName", user.displayName);
    localStorage.setItem("userPhoto", user.photoURL);
    localStorage.setItem("userUid", user.uid);
    
    // Redirect
    window.location.href = "/index.html";
    
  } catch (error) {
    // ✅ PROFESSIONAL ERROR HANDLING - No ugly Firebase errors!
    console.log("Sign-in attempt completed");
    
    // Only show message for website (not app)
    if (!isWebView()) {
      // Friendly message, not technical error
      const msg = "Unable to sign in with Google. Please try Email & Password, or visit our website for full Google support.";
      alert(msg);
    }
    // In app: silently fail - no alert, no error shown to user!
  }
}

// ✅ LOGOUT FUNCTION
function signOutUser() {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("userPhoto");
  localStorage.removeItem("userUid");
  window.location.href = "/index.html";
}

// ✅ MAKE FUNCTIONS GLOBALLY AVAILABLE
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;

// ✅ EXPORTS
export { 
  db, 
  auth,
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
  signInWithGoogle,  signOutUser
};