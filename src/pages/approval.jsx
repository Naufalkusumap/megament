import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import "../assets/css/styles.css";
import { getUnapprovedAssets, approveAsset, declineAsset, setAuthToken } from '../api/api'; // Pastikan jalur impor benar

function Approval() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem('token'); // Dapatkan token dari localStorage
        if (token) {
          setAuthToken(token); // Set token ke header Axios
        }
        const response = await getUnapprovedAssets();
        console.log("Fetched assets:", response); // Log respons API
        const data = response.data;
        if (Array.isArray(data)) {
          setAssets(data);
        } else {
          throw new Error("Unexpected response format");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching assets:", err); // Log kesalahan
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const handleAccept = async (id) => {
    console.log(`Accepting asset with id: ${id}`);
    try {
      await approveAsset(id);
      setAssets(assets.filter(asset => asset.id !== id));
      console.log(`Asset with id: ${id} has been approved.`);
    } catch (error) {
      console.error('Failed to approve asset:', error.response ? error.response.data : error.message);
    }
  };

  const handleDecline = async (id) => {
    console.log(`Declining asset with id: ${id}`);
    try {
      await declineAsset(id);
      setAssets(assets.filter(asset => asset.id !== id));
      console.log(`Asset with id: ${id} has been declined and removed.`);
    } catch (error) {
      console.error('Failed to decline asset:', error.response ? error.response.data : error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-row flex-grow">
        <Sidebar />
        <div className="flex flex-col flex-grow p-8 bg-gray-100">
          <div className="flex flex-col gap-2 pb-4">
            <h1 className="text-4xl font-bold">Approval Asset</h1>
            <p className="font-poppins">The following is a list of assets awaiting approval</p>
          </div>
          <div className="bg-custom w-full flex-grow mt-4 rounded-xl p-4 flex flex-col shadow-md">
            <div className="ml-4 mt-4 font-bold text-xl">
              <h1>Approval Table</h1>
            </div>
            <div className="bg-gray-100 flex-grow m-4 rounded-xl p-4 shadow-md">
              <div className="overflow-auto">
                <table className="w-full border-collapse mt-5">
                  <thead>
                    <tr>
                      <th className="border border-gray-500 p-2">No.</th>
                      <th className="border border-gray-500 p-2">Asset Name</th>
                      <th className="border border-gray-500 p-2">Description</th>
                      <th className="border border-gray-500 p-2">Depreciation</th>
                      <th className="border border-gray-500 p-2">Product Photo</th>
                      <th className="border border-gray-500 p-2">Price</th>
                      <th className="border border-gray-500 p-2">Purchase Date</th>
                      <th className="border border-gray-500 p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset, index) => (
                      <tr key={asset.id}>
                        <td className="border border-gray-500 p-2">{index + 1}</td>
                        <td className="border border-gray-500 p-2">{asset.name}</td>
                        <td className="border border-gray-500 p-2">{asset.description}</td>
                        <td className="border border-gray-500 p-2">{asset.depreciation}</td>
                        <td className="border border-gray-500 p-2">
                          <img src={asset.imageURL || 'https://via.placeholder.com/150'} alt="Asset" className="w-16 h-16"/>
                        </td>
                        <td className="border border-gray-500 p-2">{asset.price}</td>
                        <td className="border border-gray-500 p-2">{asset.purchaseDate}</td>
                        <td className="border border-gray-500 p-2">
                          <button
                            onClick={() => handleAccept(asset.id)}
                            className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-2 rounded mr-2"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(asset.id)}
                            className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-2 rounded"
                          >
                            Decline
                          </button>
                        </td>
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

export default Approval;
