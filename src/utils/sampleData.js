// src/utils/sampleData.js
import { ethers } from 'ethers';
import { DOCTOR_APPOINTMENTS_ADDRESS } from './contractConfig';
import DoctorAppointmentsABI from '../contracts/DoctorAppointments.json';

export const addSampleDoctors = async (signer) => {
  const contract = new ethers.Contract(
    DOCTOR_APPOINTMENTS_ADDRESS,
    DoctorAppointmentsABI.abi,
    signer
  );
  
  const doctors = [
    { name: "Dr. Sarah Johnson", specialization: "Cardiologist", fee: "0.02" },
    { name: "Dr. Michael Chen", specialization: "Neurologist", fee: "0.025" },
    { name: "Dr. Emily Rodriguez", specialization: "Pediatrician", fee: "0.015" },
    { name: "Dr. David Williams", specialization: "Dermatologist", fee: "0.018" }
  ];
  
  for (const doctor of doctors) {
    try {
      const tx = await contract.addDoctor(
        doctor.name, 
        doctor.specialization, 
        ethers.parseEther(doctor.fee)
      );
      await tx.wait();
      console.log(`Added doctor: ${doctor.name}`);
    } catch (err) {
      console.error(`Failed to add doctor ${doctor.name}:`, err);
    }
  }
};