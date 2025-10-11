document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    initMap();
    
    // Add event listeners
    setupEventListeners();
});

function initMap() {
    const map = document.getElementById('map');
    
    // Add map controls
    const mapControls = document.createElement('div');
    mapControls.className = 'map-controls';
    mapControls.innerHTML = `
        <div class="control-button" id="zoom-in">
            <i class="fas fa-plus"></i>
        </div>
        <div class="control-button" id="zoom-out">
            <i class="fas fa-minus"></i>
        </div>
        <div class="control-button" id="directions">
            <i class="fas fa-directions"></i>
        </div>
        <div class="control-button" id="layers">
            <i class="fas fa-layer-group"></i>
        </div>
    `;
    map.appendChild(mapControls);
    
    // Create fake map tiles
    createMapTiles();
    
    // Add current location marker
    const currentLocation = document.createElement('div');
    currentLocation.className = 'current-location';
    currentLocation.style.left = '50%';
    currentLocation.style.top = '60%';
    map.appendChild(currentLocation);
    
    // Add location markers
    addLocationMarkers();
    
    // Add business details panel
    addBusinessDetailsPanel();
    
    // Add directions panel
    addDirectionsPanel();
}

function createMapTiles() {
    const map = document.getElementById('map');
    const mapWidth = map.offsetWidth;
    const mapHeight = map.offsetHeight;
    
    // Clear existing tiles
    const existingTiles = map.querySelectorAll('.map-tile');
    existingTiles.forEach(tile => tile.remove());
    
    // Create a more realistic map background
    map.style.background = 'linear-gradient(45deg, #f5f5f0 25%, #f0f0eb 25%, #f0f0eb 50%, #f5f5f0 50%, #f5f5f0 75%, #f0f0eb 75%, #f0f0eb)';
    map.style.backgroundSize = '20px 20px';
    
    // Create major streets (horizontal)
    const majorStreetsH = [
        { y: 0.2, width: mapWidth, name: 'Walnut St' },
        { y: 0.4, width: mapWidth, name: 'Chestnut St' },
        { y: 0.6, width: mapWidth, name: 'Market St' },
        { y: 0.8, width: mapWidth, name: 'Arch St' }
    ];
    
    // Create major streets (vertical)
    const majorStreetsV = [
        { x: 0.2, height: mapHeight, name: '34th St' },
        { x: 0.4, height: mapHeight, name: '33rd St' },
        { x: 0.6, height: mapHeight, name: '32nd St' },
        { x: 0.8, height: mapHeight, name: 'Broad St' }
    ];
    
    // Draw horizontal streets
    majorStreetsH.forEach(street => {
        const streetEl = document.createElement('div');
        streetEl.style.position = 'absolute';
        streetEl.style.left = '0px';
        streetEl.style.top = (street.y * mapHeight) + 'px';
        streetEl.style.width = mapWidth + 'px';
        streetEl.style.height = '4px';
        streetEl.style.backgroundColor = '#ffffff';
        streetEl.style.borderTop = '1px solid #e0e0e0';
        streetEl.style.borderBottom = '1px solid #e0e0e0';
        streetEl.style.zIndex = '1';
        map.appendChild(streetEl);
        
        // Add street name
        const nameEl = document.createElement('div');
        nameEl.style.position = 'absolute';
        nameEl.style.left = '10px';
        nameEl.style.top = (street.y * mapHeight - 15) + 'px';
        nameEl.style.fontSize = '10px';
        nameEl.style.color = '#666';
        nameEl.style.backgroundColor = 'rgba(255,255,255,0.8)';
        nameEl.style.padding = '2px 4px';
        nameEl.style.borderRadius = '2px';
        nameEl.textContent = street.name;
        nameEl.style.zIndex = '1';
        map.appendChild(nameEl);
    });
    
    // Draw vertical streets
    majorStreetsV.forEach(street => {
        const streetEl = document.createElement('div');
        streetEl.style.position = 'absolute';
        streetEl.style.left = (street.x * mapWidth) + 'px';
        streetEl.style.top = '0px';
        streetEl.style.width = '4px';
        streetEl.style.height = mapHeight + 'px';
        streetEl.style.backgroundColor = '#ffffff';
        streetEl.style.borderLeft = '1px solid #e0e0e0';
        streetEl.style.borderRight = '1px solid #e0e0e0';
        streetEl.style.zIndex = '1';
        map.appendChild(streetEl);
    });
    
    // Add some buildings/blocks
    const buildings = [
        { x: 0.1, y: 0.1, width: 0.15, height: 0.08, color: '#e8e8e8' },
        { x: 0.3, y: 0.15, width: 0.12, height: 0.06, color: '#f0f0f0' },
        { x: 0.5, y: 0.1, width: 0.18, height: 0.1, color: '#ebebeb' },
        { x: 0.7, y: 0.12, width: 0.15, height: 0.07, color: '#e5e5e5' },
        { x: 0.15, y: 0.45, width: 0.2, height: 0.12, color: '#e8e8e8' },
        { x: 0.45, y: 0.48, width: 0.16, height: 0.09, color: '#f0f0f0' },
        { x: 0.7, y: 0.5, width: 0.18, height: 0.08, color: '#ebebeb' },
        { x: 0.1, y: 0.7, width: 0.14, height: 0.06, color: '#e5e5e5' },
        { x: 0.35, y: 0.72, width: 0.2, height: 0.1, color: '#e8e8e8' },
        { x: 0.65, y: 0.75, width: 0.15, height: 0.08, color: '#f0f0f0' }
    ];
    
    buildings.forEach(building => {
        const buildingEl = document.createElement('div');
        buildingEl.style.position = 'absolute';
        buildingEl.style.left = (building.x * mapWidth) + 'px';
        buildingEl.style.top = (building.y * mapHeight) + 'px';
        buildingEl.style.width = (building.width * mapWidth) + 'px';
        buildingEl.style.height = (building.height * mapHeight) + 'px';
        buildingEl.style.backgroundColor = building.color;
        buildingEl.style.border = '1px solid #d0d0d0';
        buildingEl.style.borderRadius = '2px';
        buildingEl.style.zIndex = '1';
        map.appendChild(buildingEl);
    });
    
    // Add some green spaces (parks)
    const parks = [
        { x: 0.05, y: 0.25, width: 0.1, height: 0.15 },
        { x: 0.75, y: 0.3, width: 0.2, height: 0.12 },
        { x: 0.25, y: 0.85, width: 0.3, height: 0.1 }
    ];
    
    parks.forEach(park => {
        const parkEl = document.createElement('div');
        parkEl.style.position = 'absolute';
        parkEl.style.left = (park.x * mapWidth) + 'px';
        parkEl.style.top = (park.y * mapHeight) + 'px';
        parkEl.style.width = (park.width * mapWidth) + 'px';
        parkEl.style.height = (park.height * mapHeight) + 'px';
        parkEl.style.backgroundColor = '#c8e6c9';
        parkEl.style.border = '1px solid #a5d6a7';
        parkEl.style.borderRadius = '3px';
        parkEl.style.zIndex = '1';
        map.appendChild(parkEl);
    });
}

function addLocationMarkers() {
    const map = document.getElementById('map');
    const mapWidth = map.offsetWidth;
    const mapHeight = map.offsetHeight;
    
    // Define some mock locations
    const locations = [
        { type: 'restaurant', name: 'Corio', position: { x: 0.3, y: 0.5 }, rating: 4.2 },
        { type: 'restaurant', name: 'Arterial Coffee', position: { x: 0.8, y: 0.1 }, rating: 4.7 },
        { type: 'restaurant', name: '成都名吃', position: { x: 0.5, y: 0.3 }, rating: 4.5 },
        { type: 'hotel', name: 'Penn Hotel', position: { x: 0.2, y: 0.4 }, rating: 4.0 },
        { type: 'gas', name: 'QuickFuel', position: { x: 0.7, y: 0.6 }, rating: 3.8 },
        { type: 'grocery', name: 'Fresh Market', position: { x: 0.6, y: 0.2 }, rating: 4.3 },
        { type: 'restaurant', name: 'Molly Tea (UPenn)', position: { x: 0.4, y: 0.45 }, rating: 4.6 }
    ];
    
    // Add markers to the map
    locations.forEach(location => {
        const marker = document.createElement('div');
        marker.className = `location-marker ${location.type}`;
        marker.style.position = 'absolute';
        marker.style.width = '32px';
        marker.style.height = '32px';
        marker.style.cursor = 'pointer';
        marker.style.zIndex = '10';
        marker.style.display = 'flex';
        marker.style.alignItems = 'center';
        marker.style.justifyContent = 'center';
        marker.style.borderRadius = '50%';
        marker.style.backgroundColor = 'white';
        marker.style.border = '2px solid';
        marker.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        marker.style.transition = 'transform 0.2s ease';
        
        // Set color based on type
        let iconColor = '#666';
        let borderColor = '#666';
        switch(location.type) {
            case 'restaurant':
                iconColor = '#ff6b6b';
                borderColor = '#ff6b6b';
                break;
            case 'hotel':
                iconColor = '#4d7cff';
                borderColor = '#4d7cff';
                break;
            case 'gas':
                iconColor = '#4caf50';
                borderColor = '#4caf50';
                break;
            case 'grocery':
                iconColor = '#ff9800';
                borderColor = '#ff9800';
                break;
        }
        
        marker.style.borderColor = borderColor;
        marker.innerHTML = `<i class="fas fa-map-marker-alt" style="color: ${iconColor}; font-size: 16px;"></i>`;
        marker.style.left = (location.position.x * mapWidth) + 'px';
        marker.style.top = (location.position.y * mapHeight) + 'px';
        marker.dataset.name = location.name;
        marker.dataset.type = location.type;
        marker.dataset.rating = location.rating;
        
        // Add hover effect
        marker.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        marker.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Add click event
        marker.addEventListener('click', function(e) {
            e.stopPropagation();
            showBusinessDetails(location);
        });
        
        map.appendChild(marker);
    });
}

function addBusinessDetailsPanel() {
    const appContainer = document.querySelector('.app-container');
    
    const detailsPanel = document.createElement('div');
    detailsPanel.className = 'business-details';
    detailsPanel.id = 'business-details';
    detailsPanel.innerHTML = `
        <div class="details-header">
            <h2 id="business-name">Business Name</h2>
            <div class="details-rating">
                <span id="business-rating">4.5</span>
                <i class="fas fa-star"></i>
            </div>
        </div>
        <div class="details-info">
            <p id="business-address">123 Main St, Philadelphia, PA</p>
            <p id="business-hours">Open now: 9:00 AM - 10:00 PM</p>
        </div>
        <div class="details-actions">
            <div class="action-button">
                <i class="fas fa-directions"></i>
                <span>Directions</span>
            </div>
            <div class="action-button">
                <i class="fas fa-save"></i>
                <span>Save</span>
            </div>
            <div class="action-button">
                <i class="fas fa-share-alt"></i>
                <span>Share</span>
            </div>
            <div class="action-button">
                <i class="fas fa-phone"></i>
                <span>Call</span>
            </div>
        </div>
        <div class="details-photos">
            <div class="photo-item" style="background-image: url('images/local_gems.svg')"></div>
            <div class="photo-item" style="background-image: url('images/go_list.svg')"></div>
            <div class="photo-item" style="background-image: url('images/local_gems.svg')"></div>
        </div>
    `;
    
    appContainer.appendChild(detailsPanel);
}

function addDirectionsPanel() {
    const appContainer = document.querySelector('.app-container');
    
    const directionsPanel = document.createElement('div');
    directionsPanel.className = 'directions-panel';
    directionsPanel.id = 'directions-panel';
    directionsPanel.innerHTML = `
        <div class="directions-header">
            <div class="directions-inputs">
                <div class="direction-input">
                    <i class="fas fa-circle"></i>
                    <input type="text" placeholder="Your location" value="Current location">
                </div>
                <div class="direction-input">
                    <i class="fas fa-map-marker-alt"></i>
                    <input type="text" placeholder="Destination" id="directions-destination">
                </div>
            </div>
        </div>
        <div class="directions-options">
            <div class="transport-option active">
                <i class="fas fa-car"></i>
                <span>Drive</span>
            </div>
            <div class="transport-option">
                <i class="fas fa-bus"></i>
                <span>Transit</span>
            </div>
            <div class="transport-option">
                <i class="fas fa-walking"></i>
                <span>Walk</span>
            </div>
            <div class="transport-option">
                <i class="fas fa-bicycle"></i>
                <span>Bike</span>
            </div>
        </div>
        <div class="directions-list">
            <div class="direction-step">
                <div class="step-icon">
                    <i class="fas fa-arrow-right"></i>
                </div>
                <div class="step-details">
                    <h3>Head east on Walnut St</h3>
                    <p>0.2 miles</p>
                </div>
            </div>
            <div class="direction-step">
                <div class="step-icon">
                    <i class="fas fa-arrow-up"></i>
                </div>
                <div class="step-details">
                    <h3>Turn left onto 34th St</h3>
                    <p>0.4 miles</p>
                </div>
            </div>
            <div class="direction-step">
                <div class="step-icon">
                    <i class="fas fa-arrow-right"></i>
                </div>
                <div class="step-details">
                    <h3>Turn right onto Market St</h3>
                    <p>0.3 miles</p>
                </div>
            </div>
            <div class="direction-step">
                <div class="step-icon">
                    <i class="fas fa-location-arrow"></i>
                </div>
                <div class="step-details">
                    <h3>Arrive at destination</h3>
                    <p>On the right</p>
                </div>
            </div>
        </div>
    `;
    
    appContainer.appendChild(directionsPanel);
}

function showBusinessDetails(location) {
    const detailsPanel = document.getElementById('business-details');
    
    // Update business details
    document.getElementById('business-name').textContent = location.name;
    document.getElementById('business-rating').textContent = location.rating;
    
    // Generate random address based on business type
    let address = '';
    switch(location.type) {
        case 'restaurant':
            address = '123 Food St, Philadelphia, PA';
            break;
        case 'hotel':
            address = '456 Stay Ave, Philadelphia, PA';
            break;
        case 'gas':
            address = '789 Fuel Blvd, Philadelphia, PA';
            break;
        case 'grocery':
            address = '101 Market Rd, Philadelphia, PA';
            break;
        default:
            address = '123 Main St, Philadelphia, PA';
    }
    document.getElementById('business-address').textContent = address;
    
    // Show the panel
    detailsPanel.classList.add('active');
    
    // Hide bottom panel
    document.querySelector('.bottom-panel').style.display = 'none';
}

function hideBusinessDetails() {
    const detailsPanel = document.getElementById('business-details');
    detailsPanel.classList.remove('active');
    
    // Show bottom panel
    document.querySelector('.bottom-panel').style.display = 'block';
}

function showDirections(destination) {
    const directionsPanel = document.getElementById('directions-panel');
    
    // Set destination
    document.getElementById('directions-destination').value = destination;
    
    // Show the panel
    directionsPanel.classList.add('active');
    
    // Hide other panels
    hideBusinessDetails();
    document.querySelector('.bottom-panel').style.display = 'none';
}

function hideDirections() {
    const directionsPanel = document.getElementById('directions-panel');
    directionsPanel.classList.remove('active');
    
    // Show bottom panel
    document.querySelector('.bottom-panel').style.display = 'block';
}

function setupEventListeners() {
    // Category tab functionality
    const categoryTabs = document.querySelectorAll('.tab');
    let activeCategory = null;
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const categoryText = this.querySelector('span').textContent.toLowerCase();
            let categoryType = '';
            
            // Map category names to types
            switch(categoryText) {
                case 'restaurants':
                    categoryType = 'restaurant';
                    break;
                case 'hotels':
                    categoryType = 'hotel';
                    break;
                case 'gas':
                    categoryType = 'gas';
                    break;
                case 'groceries':
                    categoryType = 'grocery';
                    break;
            }
            
            // Toggle active state
            if (activeCategory === categoryType) {
                // Deselect if clicking the same category
                activeCategory = null;
                categoryTabs.forEach(t => t.classList.remove('active'));
                showAllMarkers();
            } else {
                // Select new category
                activeCategory = categoryType;
                categoryTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                filterMarkersByCategory(categoryType);
            }
        });
    });

    // Map dragging functionality
    let isDragging = false;
    let startX, startY;
    let offsetX = 0, offsetY = 0;
    
    const map = document.getElementById('map');
    
    map.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('location-marker') || e.target.closest('.location-marker')) {
            return; // Don't start dragging if clicking on a marker
        }
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        map.style.cursor = 'grabbing';
    });
    
    map.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        
        // Move all map elements
        const mapElements = map.querySelectorAll('div:not(.map-controls):not(.location-marker):not(.current-location)');
        mapElements.forEach(element => {
            if (element.style.left && element.style.top) {
                const left = parseFloat(element.style.left);
                const top = parseFloat(element.style.top);
                element.style.left = (left + offsetX / 10) + 'px';
                element.style.top = (top + offsetY / 10) + 'px';
            }
        });
        
        // Move markers
        const markers = document.querySelectorAll('.location-marker');
        markers.forEach(marker => {
            const left = parseFloat(marker.style.left);
            const top = parseFloat(marker.style.top);
            marker.style.left = (left + offsetX / 10) + 'px';
            marker.style.top = (top + offsetY / 10) + 'px';
        });
        
        // Move current location
        const currentLocation = document.querySelector('.current-location');
        if (currentLocation) {
            const left = parseFloat(currentLocation.style.left);
            const top = parseFloat(currentLocation.style.top);
            currentLocation.style.left = (left + offsetX / 10) + 'px';
            currentLocation.style.top = (top + offsetY / 10) + 'px';
        }
        
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
    });
    
    map.addEventListener('mouseup', function() {
        isDragging = false;
        map.style.cursor = 'grab';
    });
    
    map.addEventListener('mouseleave', function() {
        isDragging = false;
        map.style.cursor = 'grab';
    });
    
    // Touch events for mobile
    map.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('location-marker') || e.target.closest('.location-marker')) {
            return;
        }
        isDragging = true;
        startX = e.touches[0].clientX - offsetX;
        startY = e.touches[0].clientY - offsetY;
    });
    
    map.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        offsetX = e.touches[0].clientX - startX;
        offsetY = e.touches[0].clientY - startY;
        
        // Move all map elements
        const mapElements = map.querySelectorAll('div:not(.map-controls):not(.location-marker):not(.current-location)');
        mapElements.forEach(element => {
            if (element.style.left && element.style.top) {
                const left = parseFloat(element.style.left);
                const top = parseFloat(element.style.top);
                element.style.left = (left + offsetX / 10) + 'px';
                element.style.top = (top + offsetY / 10) + 'px';
            }
        });
        
        // Move markers
        const markers = document.querySelectorAll('.location-marker');
        markers.forEach(marker => {
            const left = parseFloat(marker.style.left);
            const top = parseFloat(marker.style.top);
            marker.style.left = (left + offsetX / 10) + 'px';
            marker.style.top = (top + offsetY / 10) + 'px';
        });
        
        // Move current location
        const currentLocation = document.querySelector('.current-location');
        if (currentLocation) {
            const left = parseFloat(currentLocation.style.left);
            const top = parseFloat(currentLocation.style.top);
            currentLocation.style.left = (left + offsetX / 10) + 'px';
            currentLocation.style.top = (top + offsetY / 10) + 'px';
        }
        
        startX = e.touches[0].clientX - offsetX;
        startY = e.touches[0].clientY - offsetY;
    });
    
    map.addEventListener('touchend', function() {
        isDragging = false;
    });
    
    // Zoom controls
    document.getElementById('zoom-in').addEventListener('click', function() {
        const mapElements = map.querySelectorAll('div:not(.map-controls):not(.location-marker):not(.current-location)');
        mapElements.forEach(element => {
            if (element.style.width && element.style.height && element.style.left && element.style.top) {
                const width = parseFloat(element.style.width);
                const height = parseFloat(element.style.height);
                const left = parseFloat(element.style.left);
                const top = parseFloat(element.style.top);
                
                element.style.width = (width * 1.2) + 'px';
                element.style.height = (height * 1.2) + 'px';
                element.style.left = (left * 1.2) + 'px';
                element.style.top = (top * 1.2) + 'px';
            }
        });
        
        const markers = document.querySelectorAll('.location-marker');
        markers.forEach(marker => {
            const left = parseFloat(marker.style.left);
            const top = parseFloat(marker.style.top);
            marker.style.left = (left * 1.2) + 'px';
            marker.style.top = (top * 1.2) + 'px';
        });
        
        const currentLocation = document.querySelector('.current-location');
        if (currentLocation) {
            const left = parseFloat(currentLocation.style.left);
            const top = parseFloat(currentLocation.style.top);
            currentLocation.style.left = (left * 1.2) + 'px';
            currentLocation.style.top = (top * 1.2) + 'px';
        }
    });
    
    document.getElementById('zoom-out').addEventListener('click', function() {
        const mapElements = map.querySelectorAll('div:not(.map-controls):not(.location-marker):not(.current-location)');
        mapElements.forEach(element => {
            if (element.style.width && element.style.height && element.style.left && element.style.top) {
                const width = parseFloat(element.style.width);
                const height = parseFloat(element.style.height);
                const left = parseFloat(element.style.left);
                const top = parseFloat(element.style.top);
                
                element.style.width = (width / 1.2) + 'px';
                element.style.height = (height / 1.2) + 'px';
                element.style.left = (left / 1.2) + 'px';
                element.style.top = (top / 1.2) + 'px';
            }
        });
        
        const markers = document.querySelectorAll('.location-marker');
        markers.forEach(marker => {
            const left = parseFloat(marker.style.left);
            const top = parseFloat(marker.style.top);
            marker.style.left = (left / 1.2) + 'px';
            marker.style.top = (top / 1.2) + 'px';
        });
        
        const currentLocation = document.querySelector('.current-location');
        if (currentLocation) {
            const left = parseFloat(currentLocation.style.left);
            const top = parseFloat(currentLocation.style.top);
            currentLocation.style.left = (left / 1.2) + 'px';
            currentLocation.style.top = (top / 1.2) + 'px';
        }
    });
    
    // Directions button
    document.getElementById('directions').addEventListener('click', function() {
        showDirections('Destination');
    });
    
    // Business details panel close
    document.addEventListener('click', function(e) {
        const detailsPanel = document.getElementById('business-details');
        const directionsPanel = document.getElementById('directions-panel');
        
        // Close business details when clicking outside
        if (detailsPanel.classList.contains('active') && 
            !detailsPanel.contains(e.target) && 
            !e.target.classList.contains('location-marker')) {
            hideBusinessDetails();
        }
        
        // Close directions panel when clicking outside
        if (directionsPanel.classList.contains('active') && 
            !directionsPanel.contains(e.target) && 
            e.target.id !== 'directions') {
            hideDirections();
        }
    });
    
    // Direction action button
    document.querySelector('.details-actions').addEventListener('click', function(e) {
        const actionButton = e.target.closest('.action-button');
        if (actionButton && actionButton.querySelector('i').classList.contains('fa-directions')) {
            const businessName = document.getElementById('business-name').textContent;
            showDirections(businessName);
        }
    });
    
    // Transport options
    const transportOptions = document.querySelectorAll('.transport-option');
    transportOptions.forEach(option => {
        option.addEventListener('click', function() {
            transportOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterMarkersByCategory(categoryType) {
    const markers = document.querySelectorAll('.location-marker');
    
    markers.forEach(marker => {
        if (marker.classList.contains(categoryType)) {
            marker.style.display = 'block';
            marker.style.opacity = '1';
            marker.style.transform = 'scale(1.2)'; // Highlight matching markers
        } else {
            marker.style.opacity = '0.3';
            marker.style.transform = 'scale(0.8)'; // Dim non-matching markers
        }
    });
}

function showAllMarkers() {
    const markers = document.querySelectorAll('.location-marker');
    
    markers.forEach(marker => {
        marker.style.display = 'block';
        marker.style.opacity = '1';
        marker.style.transform = 'scale(1)';
    });
}