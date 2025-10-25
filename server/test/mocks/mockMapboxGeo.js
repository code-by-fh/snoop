export const addGeoCoordinatesWithMapbox = async (listing) => {
    listing.location = {
        "lat": 53.5485522829911,
        "lng": 9.977514167115348,
        "street": "Streetname 10",
        "city": "Hamburg",
        "fullAddress": "Streetname 10, 12345 Hamburg, Deutschland",
        "state": "Hamburg",
        "zipcode": "12345",
        "land": "Deutschland",
        "district": "Altona"
    };
    return listing;
};