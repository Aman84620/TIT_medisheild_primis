const axios = require('axios');
require('dotenv').config();

/**
 * MediShield Contact Tracing Service
 * Powered by Radar.io API
 */
const contactService = {
    /**
     * Calculate real-world distance between two patients using Radar Matrix API
     */
    getDistance: async (origin, destination) => {
        if (!process.env.RADAR_API_KEY || process.env.RADAR_API_KEY.includes("your-")) {
            // Fallback: Haversine distance (mathematical) if API key missing
            return contactService.haversineDistance(origin, destination);
        }

        try {
            const response = await axios.get(`https://api.radar.io/v1/route/distance?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&modes=foot`, {
                headers: { 'Authorization': process.env.RADAR_API_KEY }
            });
            
            const distanceData = response.data.routes.foot;
            return {
                meters: distanceData.distance.value,
                duration_mins: distanceData.duration.value / 60,
                source: "Radar.io Geofencing"
            };
        } catch (error) {
            console.error("Radar Distance API Failed, falling back to Math model:", error.message);
            return contactService.haversineDistance(origin, destination);
        }
    },

    /**
     * Detect potential contacts in a batch of patients
     */
    detectContacts: async (patients) => {
        const contacts = [];
        const THRESHOLD_METERS = 50; // High risk proximity

        for (let i = 0; i < patients.length; i++) {
            for (let j = i + 1; j < patients.length; j++) {
                const p1 = patients[i];
                const p2 = patients[j];

                if (p1.location && p2.location) {
                    const dist = await contactService.getDistance(p1.location, p2.location);
                    
                    if (dist.meters < THRESHOLD_METERS) {
                        contacts.push({
                            sourceId: p1.id,
                            targetId: p2.id,
                            sourceName: p1.name,
                            targetName: p2.name,
                            distance: dist.meters.toFixed(1),
                            riskLevel: dist.meters < 10 ? "CRITICAL" : "HIGH",
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            }
        }
        return contacts;
    },

    /**
     * Local mathematical fallback (Haversine formula)
     */
    haversineDistance: (coords1, coords2) => {
        const toRad = x => (x * Math.PI) / 180;
        const R = 6371e3; // Earth radius in meters

        const dLat = toRad(coords2.lat - coords1.lat);
        const dLon = toRad(coords2.lng - coords1.lng);
        const lat1 = toRad(coords1.lat);
        const lat2 = toRad(coords2.lat);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return {
            meters: R * c,
            duration_mins: (R * c) / 1.4, // Assume walking speed 1.4m/s
            source: "Haversine-Local-Model"
        };
    }
};

module.exports = contactService;
