// src/pages/BookAppointment.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import { useDoctorContract } from '../hooks/useDoctorContract';
import { ethers } from 'ethers';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { isConnected, connectWallet } = useWeb3();
  const { bookAppointment } = useDoctorContract();
  
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
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
  
  // Fetch doctor details
  useEffect(() => {
    if (isConnected) {
      const foundDoctor = mockDoctors.find(d => d.id === doctorId);
      if (foundDoctor) {
        setDoctor(foundDoctor);
      }
    }
  }, [isConnected, doctorId]);
  
  // Generate time slots for the selected date
  useEffect(() => {
    const generateTimeSlots = () => {
      if (!selectedDate) return;
      
      const date = new Date(selectedDate);
      const slots = [];
      
      // Generate slots from 9 AM to 5 PM every 30 minutes
      for (let hour = 9; hour < 17; hour++) {
        for (let minute of [0, 30]) {
          date.setHours(hour, minute, 0, 0);
          
          // Don't add slots in the past
          if (date > new Date()) {
            slots.push({
              timestamp: Math.floor(date.getTime() / 1000),
              time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              available: true
            });
          }
        }
      }
      
      // Randomly mark some slots as unavailable for demo purposes
      const availableSlots = slots.map(slot => ({
        ...slot,
        available: Math.random() > 0.3 // 70% chance of being available
      }));
      
      setAvailableSlots(availableSlots);
    };
    
    generateTimeSlots();
  }, [selectedDate]);
  
  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null);
  };
  
  // Handle time slot selection
  const handleSlotSelection = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };
  
  // Handle appointment booking
  const handleBookAppointment = async () => {
    if (!doctor || !selectedSlot) return;
    
    setBookingInProgress(true);
    setError('');
    setSuccess('');
    // Save appointment to localStorage for the demo
try {
    const existingAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]');
    
    const newAppointment = {
      id: Date.now().toString(), // Use timestamp as unique ID
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      timestamp: selectedSlot.timestamp,
      feeInEth: doctor.feeInEth,
      isPaid: true,
      isCancelled: false
    };
    
    const updatedAppointments = [...existingAppointments, newAppointment];
    localStorage.setItem('mockAppointments', JSON.stringify(updatedAppointments));
    
    console.log("Appointment saved to localStorage:", newAppointment);
  } catch (storageErr) {
    console.error("Error saving to localStorage:", storageErr);
  }
    try {
      // Try to book appointment on the blockchain
      try {
        await bookAppointment(
          doctor.id, 
          selectedSlot.timestamp, 
          doctor.feeInEth
        );
      } catch (err) {
        console.log("Contract interaction failed, but we'll proceed for demo:", err);
        // Continue with UI flow even if contract interaction fails
      }
      
      // Show success message for the demo regardless of contract success
      setSuccess("Appointment booked successfully!");
      
      // Navigate to appointments page after a delay
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (err) {
      setError("Failed to book appointment: " + err.message);
    } finally {
      setBookingInProgress(false);
    }
  };
  
  // Get the minimum date (today) for the date picker
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  if (!isConnected) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
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
            Connect your Ethereum wallet to book an appointment.
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
  
  if (!doctor) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading doctor information...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/doctors')}
          className="mr-4 bg-gray-100 p-2 rounded-full"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
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
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="bg-green-500 text-white p-4">
          <h2 className="text-xl font-bold">{doctor.name}</h2>
          <p>{doctor.specialization}</p>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Consultation Fee:</span>
            <span className="font-bold">{doctor.feeInEth} ETH</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Select Appointment Date</h2>
        <input
          type="date"
          min={getMinDate()}
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
        />
        
        {selectedDate && (
          <div>
            <h3 className="font-medium mb-3">Available Time Slots</h3>
            {availableSlots.length === 0 ? (
              <p className="text-gray-600">No available slots for this date.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.timestamp}
                    onClick={() => handleSlotSelection(slot)}
                    disabled={!slot.available}
                    className={`py-2 px-3 rounded-md text-center ${
                      !slot.available 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : selectedSlot && selectedSlot.timestamp === slot.timestamp
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {selectedSlot && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Appointment Summary</h2>
          <div className="mb-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Doctor:</span>
              <span className="font-medium">{doctor.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Specialization:</span>
              <span className="font-medium">{doctor.specialization}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{selectedSlot.time}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Fee:</span>
              <span className="font-bold">{doctor.feeInEth} ETH</span>
            </div>
          </div>
          
          <button
            onClick={handleBookAppointment}
            disabled={bookingInProgress}
            className={`w-full py-3 rounded-md font-medium text-center ${
              bookingInProgress 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {bookingInProgress ? 'Processing...' : 'Confirm & Pay'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;