// src/pages/Appointments.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';

const Appointments = () => {
  const { isConnected, connectWallet, account } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [appointments, setAppointments] = useState([]);
  
  // Load mock appointments data
  useEffect(() => {
    if (isConnected) {
      setIsLoading(true);
      
      // For demo purposes, add a slight delay to simulate loading
      setTimeout(() => {
        // We'll use local storage to persist appointments across page refreshes
        try {
          const savedAppointments = localStorage.getItem('mockAppointments');
          if (savedAppointments) {
            setAppointments(JSON.parse(savedAppointments));
          }
        } catch (err) {
          console.error("Error loading appointments from storage:", err);
        }
        
        setIsLoading(false);
      }, 1000);
    }
  }, [isConnected]);
  
  // Handle appointment cancellation
  const handleCancelAppointment = (appointmentId) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Filter out the cancelled appointment
      const updatedAppointments = appointments.filter(
        app => app.id !== appointmentId
      );
      
      // Update state and local storage
      setAppointments(updatedAppointments);
      localStorage.setItem('mockAppointments', JSON.stringify(updatedAppointments));
      
      setSuccess("Appointment cancelled successfully!");
    } catch (err) {
      setError("Failed to cancel appointment: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Format time for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Check if appointment is in the past
  const isAppointmentPast = (timestamp) => {
    return (new Date(timestamp * 1000)) < new Date();
  };
  
  if (!isConnected) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">My Appointments</h1>
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
            Connect your Ethereum wallet to view your appointments.
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
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <Link 
          to="/doctors"
          className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Book New Appointment
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
          {success}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      ) : (
        <>
          {appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="flex justify-center mb-4">
                <svg 
                  className="w-16 h-16 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">No Appointments Found</h2>
              <p className="text-gray-600 mb-8">
                You don't have any appointments scheduled. Book an appointment with one of our doctors.
              </p>
              <Link 
                to="/doctors"
                className="bg-green-500 text-white px-6 py-3 rounded-md font-medium inline-block"
              >
                Book Now
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Paid</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{appointment.doctorName}</div>
                              <div className="text-sm text-gray-500">{appointment.doctorSpecialization}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(appointment.timestamp)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatTime(appointment.timestamp)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{appointment.feeInEth} ETH</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isAppointmentPast(appointment.timestamp) ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Upcoming
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {!isAppointmentPast(appointment.timestamp) && (
                              <button
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Appointments;