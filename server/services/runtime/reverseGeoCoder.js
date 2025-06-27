export const getCoordinatesFromAddress = async (address) => {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${address}+Germany&limit=1&key=${process.env.OPEN_CAGE_DATA_API_KEY}`;

  const settings = { method: "GET" };

  const res = await fetch(url, settings);
  const _json = await res.json();
  return {
    lat: _json.results[0]?.geometry?.lat,
    lng: _json.results[0]?.geometry?.lng,
  };
};
