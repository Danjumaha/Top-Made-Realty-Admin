// script.js
// 🔥 Firebase + Property Loading + Search Logic

import { 
  db, 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from "./firebase-config.js";

// DOM Elements
const propertiesGrid = document.getElementById('propertiesGrid');
const searchBtn = document.getElementById('searchBtn');
const locationFilter = document.getElementById('location');
const typeFilter = document.getElementById('type');
const bedroomsFilter = document.getElementById('bedrooms');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');

// Format Price in NGN
function formatPrice(price) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

// Get Status Badge Class
function getStatusClass(status) {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('sold')) return 'status-sold';
  if (statusLower.includes('rent')) return 'status-rented';
  if (statusLower.includes('lease')) return 'status-leased';
  return 'status-available';
}

// Render Property Cards
function renderProperties(properties) {
  if (!propertiesGrid) return;
  
  propertiesGrid.innerHTML = '';
  
  if (properties.length === 0) {    propertiesGrid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
        <h3>No Properties Found</h3>
        <p>Try adjusting your search filters</p>
      </div>
    `;
    return;
  }
  
  properties.forEach(property => {
    const card = document.createElement('div');
    card.className = 'property-card';
    
    const statusClass = getStatusClass(property.status);
    const firstImage = property.images && property.images.length > 0 
      ? property.images[0] 
      : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';
    
    card.innerHTML = `
      <img src="${firstImage}" alt="${property.title}" class="property-img" loading="lazy">
      <div class="property-info">
        <span class="property-status ${statusClass}">${property.status || 'Available'}</span>
        <h3>${property.title || 'Property'}</h3>
        <p><i class="fas fa-map-marker-alt"></i> ${property.location || 'Location not specified'}</p>
        <p><i class="fas fa-home"></i> ${property.type || 'Type not specified'}</p>
        <p><i class="fas fa-bed"></i> ${property.bedrooms || '0'} Bedroom${(property.bedrooms || 0) > 1 ? 's' : ''}</p>
        <p><i class="fas fa-bath"></i> ${property.bathrooms || '0'} Bathroom${(property.bathrooms || 0) > 1 ? 's' : ''}</p>
        <div class="property-price">${formatPrice(property.price || 0)}</div>
        <a href="details.html?id=${property.id}" class="view-btn">View Details</a>
      </div>
    `;
    
    propertiesGrid.appendChild(card);
  });
}

// Load Properties from Firebase
async function loadProperties(filters = {}) {
  if (!propertiesGrid) return;
  
  propertiesGrid.innerHTML = `
    <div class="no-results">
      <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 15px; color: var(--primary);"></i>
      <p>Loading properties...</p>
    </div>
  `;
  
  try {
    const propertiesRef = collection(db, 'properties');    let q = query(propertiesRef, orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    let properties = [];
    
    snapshot.forEach(doc => {
      properties.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      properties = properties.filter(property => {
        // Location filter
        if (filters.location && property.location !== filters.location) {
          return false;
        }
        
        // Type filter
        if (filters.type && property.type !== filters.type) {
          return false;
        }
        
        // Bedrooms filter
        if (filters.bedrooms) {
          if (filters.bedrooms === '5') {
            if (!property.bedrooms || property.bedrooms < 5) return false;
          } else {
            if (property.bedrooms != filters.bedrooms) return false;
          }
        }
        
        // Price filters
        if (filters.minPrice && property.price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice && property.price > filters.maxPrice) {
          return false;
        }
        
        return true;
      });
    }
    
    renderProperties(properties);
    
  } catch (error) {
    console.error('Error loading properties:', error);    propertiesGrid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px; color: #C62828;"></i>
        <h3>Error Loading Properties</h3>
        <p>${error.message}</p>
        <button onclick="location.reload()" class="search-btn" style="margin-top: 15px;">Retry</button>
      </div>
    `;
  }
}

// Perform Search
function performSearch() {
  const filters = {
    location: locationFilter?.value || '',
    type: typeFilter?.value || '',
    bedrooms: bedroomsFilter?.value || '',
    minPrice: minPriceInput?.value ? Number(minPriceInput.value) : 0,
    maxPrice: maxPriceInput?.value ? Number(maxPriceInput.value) : 0
  };
  
  loadProperties(filters);
}

// Event Listeners
if (searchBtn) {
  searchBtn.addEventListener('click', performSearch);
}

// Load properties on page load
if (propertiesGrid) {
  loadProperties();
}

// Export functions for use in other files
export { loadProperties, renderProperties, formatPrice, performSearch };