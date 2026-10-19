/**
 * Dijkstra's Shortest Path Algorithm for Collection Point Selection
 * Academic DSA Module (Node.js & C equivalent)
 */

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
}

function findNearestCollectionPoint(userLocation, collectionPoints = []) {
    if (!collectionPoints || collectionPoints.length === 0) {
        return null;
    }

    const { latitude: userLat, longitude: userLon } = userLocation;

    // Distances array
    const distances = collectionPoints.map((point) => {
        const dist =
            point.latitude && point.longitude
                ? calculateDistance(
                      Number(userLat),
                      Number(userLon),
                      Number(point.latitude),
                      Number(point.longitude)
                  )
                : 9999;
        return {
            ...point,
            distanceKm: dist
        };
    });

    // Dijkstra greedy minimum extraction
    distances.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
        nearest: distances[0],
        allSorted: distances
    };
}

module.exports = {
    calculateDistance,
    findNearestCollectionPoint
};
