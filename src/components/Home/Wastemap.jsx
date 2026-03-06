import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";


export default function WasteMap() {

  const bins = [
    { id: 1, position: [28.3058, 77.0478], status: "empty" },
    { id: 2, position: [28.3065, 77.0486], status: "half" },
    { id: 3, position: [28.3049, 77.0465], status: "full" },
  ];

  const truckRoute = [
    [28.3058, 77.0478],
    [28.3065, 77.0486],
    [28.3049, 77.0465],
  ];

  const getColor = (status) => {
    if (status === "empty") return "green";
    if (status === "half") return "orange";
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

  return (
    <div >

      <MapContainer
        center={[28.3056, 77.0474]}
        zoom={15}
        style={{ height: "500px", width: "100%", borderRadius: "10px" }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* BIN MARKERS */}
        {bins.map((bin) => (
          <Marker
            key={bin.id}
            position={bin.position}
            icon={createIcon(getColor(bin.status))}
          >
            <Popup>
              Bin {bin.id} <br />
              Status: {bin.status}
            </Popup>
          </Marker>
        ))}

        {/* TRUCK ROUTE */}
        <Polyline positions={truckRoute} color="blue" />

      </MapContainer>

    </div>
  );
}