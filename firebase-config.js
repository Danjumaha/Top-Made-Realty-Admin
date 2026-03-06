 // firebase-config.js
// 🔥 Professional setup - Google Sign-In: Website ONLY, Hidden in App

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

// 🔍 Detect if running in WebView (App) or Browser (Website)
function isWebView() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return /(wv|WebView|; wv\)|Version\/[\d.]+.*Chrome\/[\d.]+ Mobile)/i.test(ua) && 
         /Android|iPhone|iPad|iPod/i.test(ua);
}

// 🎯 Hide Google button if in App (WebView) - CLEAN SOLUTION!
function hideGoogleButtonInApp() {
  if (isWebView()) {
    // Hide all Google buttons by class, ID, or onclick attribute
    const selectors = [
      '[onclick*="signInWithGoogle"]',
      '.google-btn',
      '#googleLoginBtn',
      '#googleSignupBtn',
      'button:contains("Google")',
      '[data-auth="google"]'
    ];
    
    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = 'none';
          el.disabled = true;
        });
      } catch (e) {
        // Ignore selector errors
      }
    });
    
    console.log("✅ Google Sign-In hidden - running in App");
  }
}
// ✅ GOOGLE SIGN-IN - Website ONLY
async function signInWithGoogle() {
  // Double-check: if in app, don't even try
  if (isWebView()) {
    console.log("🚫 Google Sign-In blocked in App");
    return;
  }
  
  try {
    await setPersistence(auth, browserLocalPersistence);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log("✅ Google Sign-In Success:", user.email);
    
    // Save user info
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.displayName);
    localStorage.setItem("userPhoto", user.photoURL);
    localStorage.setItem("userUid", user.uid);
    
    // Redirect
    window.location.href = "/index.html";
    
  } catch (error) {
    console.error("❌ Google Sign-In Error:", error.message);
    // Simple, friendly message only on website
    alert("Google Sign-In failed. Please try Email & Password.");
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

// ✅ RUN: Hide Google button if in App (runs on page load)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hideGoogleButtonInApp);
} else {
  hideGoogleButtonInApp();}

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
  signInWithGoogle,
  signOutUser
};