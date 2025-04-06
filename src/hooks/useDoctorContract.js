import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';
import { DOCTOR_APPOINTMENTS_ADDRESS } from '../utils/contractConfig';
import DoctorAppointmentsABI from '../contracts/DoctorAppointments.json';

export const useDoctorContract = () => {
  const { provider, signer, isConnected } = useWeb3();
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Initialize contract
  useEffect(() => {
    const initContract = async () => {
      if (!isConnected || !signer || !provider) {
        setContract(null);
        setIsLoading(false);
        return;
      }

      try {
        const contractInstance = new ethers.Contract(
          DOCTOR_APPOINTMENTS_ADDRESS,
          DoctorAppointmentsABI.abi,
          signer
        );
        
        setContract(contractInstance);
        setError(null);
      } catch (err) {
        console.error("Failed to initialize contract:", err);
        setError(err.message);
        setContract(null);
      } finally {
        setIsLoading(false);
      }
    };

    initContract();
  }, [signer, provider, isConnected]);

  // Get doctors
  const getDoctors = async () => {
    if (!contract) return [];
    
    try {
      setIsLoading(true);
      console.log("Getting doctors from contract:", DOCTOR_APPOINTMENTS_ADDRESS);
      
      const doctorsList = [];
      
      // Try to get doctors with IDs 1-10
      for (let i = 1; i <= 10; i++) {
        try {
          console.log(`Fetching doctor with ID: ${i}`);
          const doctor = await contract.doctors(i);
          console.log(`Doctor ${i} data:`, doctor);
          
          // Check if doctor exists and is active
          if (doctor && doctor.id && doctor.id.toString() !== "0" && doctor.isActive) {
            doctorsList.push({
              id: i.toString(), // Use i instead of doctor.id for consistency
              name: doctor.name,
              specialization: doctor.specialization,
              feeInWei: doctor.feeInWei.toString(),
              feeInEth: ethers.formatEther(doctor.feeInWei)
            });
            console.log(`Added doctor ${i} to list`);
          }
        } catch (e) {
          console.log(`No doctor with ID ${i} found:`, e.message);
          continue;
        }
      }
      
      console.log("Final doctors list:", doctorsList);
      setDoctors(doctorsList);
      setIsLoading(false);
      return doctorsList;
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to fetch doctors: " + err.message);
      setIsLoading(false);
      return [];
    }
  };

  // Add a doctor (admin only)
  const addDoctor = async (name, specialization, feeInEth) => {
    if (!contract) throw new Error("Contract not initialized");
    
    const feeInWei = ethers.parseEther(feeInEth.toString());
    
    try {
      const tx = await contract.addDoctor(name, specialization, feeInWei);
      await tx.wait();
      
      // Refresh the doctors list
      await getDoctors();
      
      return true;
    } catch (err) {
      console.error("Error adding doctor:", err);
      setError(err.message);
      return false;
    }
  };

  // Add time slot for a doctor (admin only)
  const addTimeSlot = async (doctorId, timestamp) => {
    if (!contract) throw new Error("Contract not initialized");
    
    try {
      const tx = await contract.addTimeSlot(doctorId, timestamp);
      await tx.wait();
      return true;
    } catch (err) {
      console.error("Error adding time slot:", err);
      setError(err.message);
      return false;
    }
  };

  // Get available time slots for a doctor
  const getAvailableTimeSlots = async (doctorId, timeSlots) => {
    if (!contract) return [];
    
    try {
      const available = await contract.getDoctorTimeSlots(doctorId, timeSlots);
      
      return timeSlots.filter((_, index) => available[index]);
    } catch (err) {
      console.error("Error getting time slots:", err);
      setError(err.message);
      return [];
    }
  };

  // Book an appointment
  const bookAppointment = async (doctorId, timestamp, feeInEth) => {
    if (!contract) throw new Error("Contract not initialized");
    
    try {
      const feeInWei = ethers.parseEther(feeInEth.toString());
      
      const tx = await contract.bookAppointment(doctorId, timestamp, {
        value: feeInWei
      });
      
      await tx.wait();
      
      // Refresh appointments
      await getPatientAppointments();
      
      return true;
    } catch (err) {
      console.error("Error booking appointment:", err);
      setError(err.message);
      return false;
    }
  };

  // Get patient appointments
  const getPatientAppointments = async () => {
    if (!contract) return [];
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Instead of calling getPatientAppointments, let's check appointments directly
      // by scanning through all possible appointment IDs
      const appointmentsList = [];
      
      // Assuming appointmentIdCounter doesn't exceed 100 to limit the loop
      for (let i = 1; i <= 100; i++) {
        try {
          const appointment = await contract.appointments(i);
          
          // Check if this appointment belongs to the current user and is valid
          if (appointment.patient && 
              appointment.patient.toLowerCase() === account.toLowerCase() && 
              !appointment.isCancelled) {
            
            // Get doctor info
            let doctorName = "Unknown";
            let doctorSpecialization = "Unknown";
            
            try {
              const doctor = await contract.doctors(appointment.doctorId);
              doctorName = doctor.name;
              doctorSpecialization = doctor.specialization;
            } catch (err) {
              console.log("Doctor info not available");
            }
            
            appointmentsList.push({
              id: i.toString(),
              doctorId: appointment.doctorId.toString(),
              doctorName: doctorName,
              doctorSpecialization: doctorSpecialization,
              timestamp: appointment.timestamp.toString(),
              date: new Date(Number(appointment.timestamp) * 1000).toLocaleString(),
              feeInWei: appointment.feeInWei.toString(),
              feeInEth: ethers.formatEther(appointment.feeInWei),
              isPaid: appointment.isPaid,
              isCancelled: appointment.isCancelled
            });
          }
        } catch (err) {
          // This appointment ID doesn't exist or can't be accessed, continue
          continue;
        }
      }
      
      console.log("Retrieved appointments:", appointmentsList);
      
      setAppointments(appointmentsList);
      setIsLoading(false);
      return appointmentsList;
    } catch (err) {
      console.error("Error in getPatientAppointments:", err);
      setError("Failed to fetch appointments: " + err.message);
      setIsLoading(false);
      return [];
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    if (!contract) throw new Error("Contract not initialized");
    
    try {
      const tx = await contract.cancelAppointment(appointmentId);
      await tx.wait();
      
      // Refresh appointments
      await getPatientAppointments();
      
      return true;
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      setError(err.message);
      return false;
    }
  };

  return {
    contract,
    isLoading,
    error,
    doctors,
    appointments,
    getDoctors,
    addDoctor,
    addTimeSlot,
    getAvailableTimeSlots,
    bookAppointment,
    getPatientAppointments,
    cancelAppointment
  };
};