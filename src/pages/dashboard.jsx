import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import "../assets/css/styles.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { getAssets, setAuthToken } from '../api/api'; // Pastikan jalur impor benar

function Dashboard() {
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
        const data = await getAssets();
        setAssets(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAssets();
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
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="font-poppins">The following is a list of assets in the database</p>
          </div>
          <div className="pt-6">
            <button className="px-4 py-2 bg-red-500 text-white text-xs rounded font-poppins">
              <Link to="/form">
                + ADD NEW ASSET
              </Link>
            </button>
          </div>
          <div className="bg-custom w-full flex-grow mt-4 rounded-xl p-4 flex flex-col shadow-md">
            <div className="ml-4 mt-4 font-bold text-xl">
              <h1>Table Asset</h1>
            </div>
            <div className="bg-gray-100 flex-grow m-4 rounded-xl p-4 shadow-md">
              <div className="flex justify-end mb-4">
                <input
                  type="text"
                  placeholder="Search Here"
                  className="p-2 border rounded"
                />
              </div>
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
                      <th className="border border-gray-500 p-2">QR Code</th>
                      <th className="border border-gray-500 p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.data.map((asset, index) => (
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
                          <img src={asset.qrCode || 'https://via.placeholder.com/150'} alt="Asset" className="w-16 h-16"/>
                        </td>
                        <td className="border border-gray-500 p-2">
                          <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded mr-2">
                            <FaEdit className="inline-block text-md" /> Edit
                          </button>
                          <button className="border border-red-500 bg-gray-100 hover:bg-gray-200 text-red-500 text-sm py-1 px-2 rounded">
                            <FaTrashAlt className="inline-block" /> Delete
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

export default Dashboard;
