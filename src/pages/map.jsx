import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import { getTrackerHistory, setAuthToken } from '../api/api';

function Map() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fungsi untuk mendapatkan posisi pengguna saat aplikasi dimuat
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error(error);
          // Penanganan kesalahan jika gagal mendapatkan posisi
        }
      );
    };

    // Panggil fungsi getLocation saat aplikasi dimuat
    getLocation();
  }, []);

  useEffect(() => {
    // Fungsi untuk mengambil data marker dari API
    const fetchMarkers = async () => {
      try {
        const token = localStorage.getItem('token'); // Dapatkan token dari localStorage
        if (token) {
          setAuthToken(token); // Set token ke header Axios
        }
        const data = await getTrackerHistory(1, 10, 1);
        const markerData = data.data.map(item => ({
          id: item.id,
          position: [item.latitude, item.longitude],
          timestamp: item.timestamp,
        }));
        setMarkers(markerData);
      } catch (error) {
        console.error('Error fetching markers:', error);
        setError('Failed to fetch marker data');
      }
    };

    fetchMarkers();
  }, []);

  // Membuat polyline yang menghubungkan marker
  const polylinePositions = markers.map(marker => marker.position);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-row flex-grow">
        <Sidebar />
        <div className="flex flex-col flex-grow p-8 bg-gray-100">
          <div className="flex pb-4">
            <h1 className="text-4xl font-bold">Live Location</h1>
          </div>
          {/* MapContainer dengan TileLayer */}
          {currentPosition && (
            <MapContainer center={currentPosition} zoom={13} style={{ height: "400px" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Marker yang diperbarui secara real-time */}
              <Marker position={currentPosition}>
                <Popup>Posisi Anda</Popup>
              </Marker>
              {/* Marker dari API */}
              {markers.map((marker, index) => (
                <Marker key={index} position={marker.position}>
                  <Popup>Time: {marker.timestamp}</Popup>
                </Marker>
              ))}
              {/* Polyline yang menghubungkan marker */}
              <Polyline positions={polylinePositions} color="blue" />
            </MapContainer>
          )}
          {error && <p>{error}</p>}
          {/* Tabel untuk menampilkan data marker */}
          <div className="mt-8 bg-white p-4 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Marker History</h2>
            <div className="overflow-auto">
              <table className="w-full border-collapse mt-5">
                <thead>
                  <tr>
                    <th className="border border-gray-500 p-2">No.</th>
                    <th className="border border-gray-500 p-2">Latitude</th>
                    <th className="border border-gray-500 p-2">Longitude</th>
                    <th className="border border-gray-500 p-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {markers.map((marker, index) => (
                    <tr key={marker.id}>
                      <td className="border border-gray-500 p-2">{index + 1}</td>
                      <td className="border border-gray-500 p-2">{marker.position[0]}</td>
                      <td className="border border-gray-500 p-2">{marker.position[1]}</td>
                      <td className="border border-gray-500 p-2">{new Date(marker.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;
