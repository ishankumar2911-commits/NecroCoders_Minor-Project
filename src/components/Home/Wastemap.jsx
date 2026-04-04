import React, { useEffect, useRef } from "react";

export default function WasteMap({ bins }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  const API_KEY = process.env.REACT_APP_MAPS_API_KEY;

  // 🔹 Load Map
  useEffect(() => {
    if (!API_KEY) {
      console.error("API KEY missing");
      return;
    }

    const loadMap = () => {
      if (mapRef.current || !document.getElementById("map")) return;

      const map = new window.mappls.Map("map", {
        center: { lat: 28.4595, lng: 76.9025 },
        zoom: 15,
      });

      // ✅ Wait until map fully loads
      map.on("load", () => {
        mapRef.current = map;
      });
    };

    if (window.mappls) {
      loadMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://apis.mappls.com/advancedmaps/api/${API_KEY}/map_sdk?layer=vector&v=3.0`;
      script.async = true;
      script.onload = loadMap;
      document.body.appendChild(script);
    }
  }, [API_KEY]);

  // 🔹 Helpers
  const getLatLng = (bin) => {
    const [lng, lat] = bin.locationCoordinates.coordinates;
    return { lat, lng };
  };

  const getMarkerUrl = (fillLevel) => {
    const level =
      typeof fillLevel === "string" ? parseInt(fillLevel) : fillLevel;

    if (level < 30)
      return "url(https://cdn-icons-png.flaticon.com/128/14090/14090313.png)";
    if (level < 70)
      return "url(https://cdn-icons-png.flaticon.com/128/14035/14035451.png)";
    return "url(https://cdn-icons-png.flaticon.com/128/14090/14090313.png)";
  };

  const getOptimizedRoute = (binsList) => {
    if (!binsList || binsList.length === 0) return [];

    const remaining = [...binsList];
    const route = [];

    let current = remaining.shift();
    route.push(getLatLng(current));

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let minDist = Infinity;

      const { lat: lat1, lng: lng1 } = getLatLng(current);

      remaining.forEach((bin, idx) => {
        const { lat: lat2, lng: lng2 } = getLatLng(bin);
        const dist = Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2);

        if (dist < minDist) {
          minDist = dist;
          nearestIndex = idx;
        }
      });

      current = remaining.splice(nearestIndex, 1)[0];
      route.push(getLatLng(current));
    }

    return route;
  };

  // 🔹 Update markers + route
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !bins || !Array.isArray(bins)) return;

    // ✅ Remove old markers safely
    markersRef.current.forEach((m) => {
      if (m) m.remove();
    });
    markersRef.current = [];

    // ✅ Remove old polyline
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    // ✅ Add markers
    bins.forEach((bin) => {
      if (!bin?.locationCoordinates) return;

      const { lat, lng } = getLatLng(bin);

      const el = document.createElement("div");
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.backgroundImage = getMarkerUrl(bin.fillLevel);
      el.style.backgroundSize = "cover";
      el.style.cursor = "pointer";

      const marker = new window.mappls.Marker({
        map,
        position: { lat, lng },
        element: el,
      });

      markersRef.current.push(marker);
    });

    // ✅ Draw polyline ONCE (not inside loop)
    const fullBins = bins.filter((b) => b.status === "full");
    const route = getOptimizedRoute(fullBins);

    if (route.length > 1) {
      polylineRef.current = new window.mappls.Polyline({
        map,
        path: route,
        strokeColor: "blue",
        strokeWeight: 4,
      });
    }

    // ✅ Center map safely
    if (bins.length > 0) {
      const { lat, lng } = getLatLng(bins[0]);
      map.setCenter({ lat, lng });
      map.setZoom(15);
    }
  }, [bins]);

  return (
    <div
      id="map"
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "10px",
      }}
    />
  );
}