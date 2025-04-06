// src/pages/Doctors.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import { useDoctorContract } from '../hooks/useDoctorContract';

const Doctors = () => {
  const { isConnected, connectWallet } = useWeb3();
  const { addDoctor, error } = useDoctorContract();
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  
  // Load mock doctors immediately instead of trying to fetch from contract
  useEffect(() => {
    if (isConnected) {
      setIsLoading(true);
      
      // Mock doctors data
      const mockDoctors = [
        { 
          id: "1", 
          name: "Dr. Sarah Johnson", 
          specialization: "Cardiologist", 
          feeInEth: "0.02" 
        },
        { 
          id: "2", 
          name: "Dr. Michael Chen", 
          specialization: "Neurologist", 
          feeInEth: "0.025" 
        },
        { 
          id: "3", 
          name: "Dr. Emily Rodriguez", 
          specialization: "Pediatrician", 
          feeInEth: "0.015" 
        },
        { 
          id: "4", 
          name: "Dr. David Williams", 
          specialization: "Dermatologist", 
          feeInEth: "0.018" 
        },
        {
          id: "5",
          name: "Dr. Jessica Martinez",
          specialization: "General Practitioner",
          feeInEth: "0.012"
        },
        {
          id: "6",
          name: "Dr. Robert Kim",
          specialization: "Orthopedic Surgeon",
          feeInEth: "0.03"
        }
      ];
      
      setDoctors(mockDoctors);
      setIsLoading(false);
      
      // Optional: Try to add these doctors to the contract
      // This is not required for the UI to work
      const addMockDoctorsToContract = async () => {
        try {
          for (const doctor of mockDoctors) {
            try {
              await addDoctor(doctor.name, doctor.specialization, doctor.feeInEth);
              console.log(`Added ${doctor.name} to contract`);
            } catch (err) {
              console.log(`Could not add ${doctor.name} to contract: ${err.message}`);
            }
          }
        } catch (err) {
          console.error("Error adding mock doctors to contract:", err);
        }
      };
      
      // Uncomment if you want to try adding doctors to the contract
      // addMockDoctorsToContract();
    }
  }, [isConnected]);
  
  if (!isConnected) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Doctor Appointments</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg 
              className="w-16 h-16 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-8">
            Connect your Ethereum wallet to view available doctors and book appointments.
          </p>
          <button 
            onClick={connectWallet}
            className="bg-green-500 text-white px-6 py-3 rounded-md font-medium"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Doctors</h1>
        <Link 
          to="/appointments"
          className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          My Appointments
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-green-500 text-white p-4">
                <h2 className="text-xl font-bold">{doctor.name}</h2>
                <p>{doctor.specialization}</p>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-bold">{doctor.feeInEth} ETH</span>
                </div>
                <Link 
                  to={`/book/${doctor.id}`}
                  className="block text-center bg-green-500 text-white px-4 py-2 rounded-md w-full hover:bg-green-600 transition"
                >
                  View Availability
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;