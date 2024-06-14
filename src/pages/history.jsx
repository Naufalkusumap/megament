import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import { getHistory, setAuthToken } from '../api/api';

function History() {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token'); // Dapatkan token dari localStorage
                if (token) {
                    setAuthToken(token); // Set token ke header Axios
                }
                const response = await getHistory(1, 10, 1); // Menggunakan trackerId = 1, take = 10, page = 1
                console.log("API response:", response); // Tambahkan log respons API
                
                if (response && Array.isArray(response.data)) {
                    setHistoryData(response.data); // Pastikan data direspons adalah array
                } else {
                    throw new Error("Unexpected response format");
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching history:", err); // Log kesalahan
                setError(err.message);
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-row flex-grow">
                <Sidebar />
                <div className="flex flex-col flex-grow p-8 bg-gray-100">
                    <div className="flex flex-col gap-2 pb-4">
                        <h1 className="text-4xl font-bold">History</h1>
                        <p className="font-poppins">The following is a list of activities performed on the website</p>
                    </div>
                    <div className="bg-custom w-full flex-grow mt-4 rounded-xl p-4 flex flex-col shadow-md">
                        <div className="ml-4 mt-4 font-bold text-xl">
                            <h1>Activity Table</h1>
                        </div>
                        <div className="bg-gray-100 flex-grow m-4 rounded-xl p-4 shadow-md">
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
                                        {historyData.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="border border-gray-500 p-2">{index + 1}</td>
                                                <td className="border border-gray-500 p-2">{item.latitude}</td>
                                                <td className="border border-gray-500 p-2">{item.longitude}</td>
                                                <td className="border border-gray-500 p-2">{new Date(item.timestamp).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;
