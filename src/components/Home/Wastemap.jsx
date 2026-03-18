import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import React from "react";


export default function WasteMap({ bins }) {
  React.useEffect(() => {
    console.log("Bins in WasteMap:", bins);
  }, [bins]);

  const binData = [
    { id: 1, position: [28.3058, 77.0478], status: "empty" },
    { id: 2, position: [28.3065, 77.0486], status: "half" },
    { id: 3, position: [28.3049, 77.0465], status: "full" },
  ];

  // const truckRoute = [
  //   [28.3058, 77.0478],
  //   [28.3065, 77.0486],
  //   [28.3049, 77.0465],
  // ];

  const getColor = (status) => {
    if (status === "empty") return "green";
    if (status === "half" || status === "half-full") return "orange";
    if (status === "full") return "red";
  };

  const createIcon = (color) =>
    new L.DivIcon({
      className: "",
      html: `<div style="
        width:18px;
        height:18px;
        border-radius:50%;
        background:${color};
        border:2px solid white;
      "></div>`,
    });

  if (!bins || bins.length === 0) {
    return <p>Loading map...</p>;
  }
  const getLatLng = (bin) => {
    const [lng, lat] = bin.locationCoordinates.coordinates;
    return [lat, lng];
  };

  const fullBins = bins.filter((bin) => bin.status === "full");

  const getMapCenter = (bins) => {
    if (!bins || bins.length === 0) return [28.2712, 77.0679]; // fallback (KR Mangalam)

    let totalLat = 0;
    let totalLng = 0;

    bins.forEach((bin) => {
      const [lng, lat] = bin.locationCoordinates.coordinates;
      totalLat += lat;
      totalLng += lng;
    });

    return [totalLat / bins.length, totalLng / bins.length];
  };

  const getZoomLevel = (bins) => {
    if (!bins || bins.length === 0) return 15;

    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;

    bins.forEach((bin) => {
      const [lng, lat] = bin.locationCoordinates.coordinates;

      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });

    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    // Adjust zoom based on spread
    if (maxDiff < 0.002) return 19;
    if (maxDiff < 0.005) return 18;
    if (maxDiff < 0.01) return 17;
    if (maxDiff < 0.05) return 15;
    return 11;
  };

  const getOptimizedRoute = (binsList) => {
    if (binsList.length === 0) return [];

    const remaining = [...binsList];
    const route = [];

    // Start from first bin
    let current = remaining.shift();
    route.push(getLatLng(current));

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let minDist = Infinity;

      const [lat1, lng1] = getLatLng(current);

      remaining.forEach((bin, index) => {
        const [lat2, lng2] = getLatLng(bin);

        const dist = Math.sqrt(
          Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)
        );

        if (dist < minDist) {
          minDist = dist;
          nearestIndex = index;
        }
      });

      current = remaining.splice(nearestIndex, 1)[0];
      route.push(getLatLng(current));
    }

    return route;
  };

  const truckRoute = getOptimizedRoute(fullBins);
  return (
    <div>
      <MapContainer
        center={getMapCenter(bins)}
        zoom={getZoomLevel(bins)}
        style={{ height: "500px", width: "100%", borderRadius: "10px" }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* BIN MARKERS */}
        {bins.map((bin) => {
          const [lng, lat] = bin.locationCoordinates.coordinates;
          return (
            <Marker
              key={bin._id}
              position={[lat, lng]}
              icon={createIcon(getColor(bin.status))}
            >
              {console.log("Rendering marker for bin:", bin)}
              <Popup>
                Bin {bin.binCode} <br />
                Bin Location: {bin.location} <br />
                Fill Level: {bin.currentFillLevel} / {bin.capacity} <br />
                Status: {bin.status}
              </Popup>
            </Marker>
          );
        })}

        {/* TRUCK ROUTE */}
        <Polyline positions={truckRoute} color="blue" />

      </MapContainer>

    </div>
  );
}