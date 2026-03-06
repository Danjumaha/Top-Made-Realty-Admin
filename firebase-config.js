 // firebase-config.js
// 🔥 FREE setup - Cloudinary for images + Firestore for data

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, doc, 
  updateDoc, deleteDoc, query, where, orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config (Firestore - FREE tier)
const firebaseConfig = {
  apiKey: "AIzaSyCCtvETKvK_F2Juc1eYX6Qvg-MoIMU8dIw",
  authDomain: "top-made-realty.firebaseapp.com",
  projectId: "top-made-realty",
  storageBucket: "top-made-realty.firebasestorage.app",
  messagingSenderId: "984525164905",
  appId: "1:984525164905:web:a8a642276a9db0dc57edf8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ☁️ CLOUDINARY CONFIG (FREE 25GB image storage)
const CLOUDINARY_CLOUD_NAME = "dytzpxabq"; // Your Cloud Name
const CLOUDINARY_UPLOAD_PRESET = "top-made-realty"; // Your preset

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
      {
        method: "POST",
        body: formData
      }
    );
    
    const data = await response.json();
    return data.secure_url; // Returns the image URL
  } catch (error) {
    console.error("Upload error:", error);
    alert("Image upload failed. Please try again.");
    return null;
  }
}

// Upload multiple images (for property gallery)
async function uploadMultipleImages(files) {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = Array.from(files).map(file => uploadImage(file));
  return await Promise.all(uploadPromises);
}

export { 
  db, 
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
  uploadMultipleImages
};