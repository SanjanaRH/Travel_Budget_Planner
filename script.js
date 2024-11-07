const API_KEY = '2152d35aae304a41ad9dd9f4cf641505'; // Replace with your OpenCage API key

// Function to fetch coordinates for a city
async function getCoordinates(city) {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${API_KEY}`);
    const data = await response.json();
    if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { lat, lng };
    } else {
        alert(`Could not find location for city: ${city}`);
        return null;
    }
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Function to calculate travel cost based on distance and mode of transportation
function calculateTravelCost(distance) {
    const travelMode = document.getElementById("travelMode").value;
    let costPerMile = 0;

    if (travelMode === 'car') costPerMile = 0.5;
    else if (travelMode === 'train') costPerMile = 0.2;
    else if (travelMode === 'flight') costPerMile = 0.1;

    return distance * costPerMile;
}

// Main function to calculate and display the total budget
async function calculateTotalBudget() {
    const originCity = document.getElementById("originCity").value;
    const destinationCity = document.getElementById("destinationCity").value;

    // Fetch coordinates for both cities
    const originCoords = await getCoordinates(originCity);
    const destinationCoords = await getCoordinates(destinationCity);

    if (!originCoords || !destinationCoords) return;

    // Calculate distance between the cities
    const distance = calculateDistance(originCoords.lat, originCoords.lng, destinationCoords.lat, destinationCoords.lng);
    document.getElementById("distance").textContent = distance.toFixed(2);

    // Calculate travel cost based on distance
    const travelCost = calculateTravelCost(distance);
    document.getElementById("travelCost").textContent = travelCost.toFixed(2);

    // Retrieve other expenses
    const accommodation = parseFloat(document.getElementById("accommodation").value) || 0;
    const food = parseFloat(document.getElementById("food").value) || 0;
    const activities = parseFloat(document.getElementById("activities").value) || 0;

    // Calculate total budget
    const totalBudget = travelCost + accommodation + food + activities;
    document.getElementById("totalBudget").textContent = `$${totalBudget.toFixed(2)}`;
}
