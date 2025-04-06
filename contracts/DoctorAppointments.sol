// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DoctorAppointments {
    // Structures
    struct Doctor {
        uint256 id;
        string name;
        string specialization;
        uint256 feeInWei;
        bool isActive;
    }
    
    struct TimeSlot {
        uint256 doctorId;
        uint256 timestamp; // Unix timestamp
        bool isBooked;
    }
    
    struct Appointment {
        uint256 id;
        uint256 doctorId;
        address patient;
        uint256 timestamp;
        uint256 feeInWei;
        bool isPaid;
        bool isCancelled;
    }
    
    // State variables
    address public owner;
    uint256 private doctorIdCounter;
    uint256 private appointmentIdCounter;
    mapping(uint256 => Doctor) public doctors;
    mapping(uint256 => Appointment) public appointments;
    mapping(address => uint256[]) public doctorAppointments;
    mapping(address => uint256[]) public patientAppointments;
    
    // Available time slots mapping (doctorId => timestamp => isAvailable)
    mapping(uint256 => mapping(uint256 => bool)) public availableTimeSlots;
    
    // Events
    event DoctorAdded(uint256 doctorId, string name, string specialization, uint256 feeInWei);
    event TimeSlotAdded(uint256 doctorId, uint256 timestamp);
    event AppointmentBooked(uint256 appointmentId, uint256 doctorId, address patient, uint256 timestamp, uint256 feeInWei);
    event AppointmentCancelled(uint256 appointmentId);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        doctorIdCounter = 1;
        appointmentIdCounter = 1;
    }
    
    // Functions
    function addDoctor(string memory _name, string memory _specialization, uint256 _feeInWei) public onlyOwner {
        doctors[doctorIdCounter] = Doctor(doctorIdCounter, _name, _specialization, _feeInWei, true);
        emit DoctorAdded(doctorIdCounter, _name, _specialization, _feeInWei);
        doctorIdCounter++;
    }
    
    function addTimeSlot(uint256 _doctorId, uint256 _timestamp) public onlyOwner {
        require(doctors[_doctorId].isActive, "Doctor does not exist or is inactive");
        require(_timestamp > block.timestamp, "Time slot must be in the future");
        require(!availableTimeSlots[_doctorId][_timestamp], "Time slot already exists");
        
        availableTimeSlots[_doctorId][_timestamp] = true;
        emit TimeSlotAdded(_doctorId, _timestamp);
    }
    
    function bookAppointment(uint256 _doctorId, uint256 _timestamp) public payable {
        require(doctors[_doctorId].isActive, "Doctor does not exist or is inactive");
        require(availableTimeSlots[_doctorId][_timestamp], "Time slot is not available");
        require(msg.value >= doctors[_doctorId].feeInWei, "Insufficient payment");
        
        // Mark time slot as unavailable
        availableTimeSlots[_doctorId][_timestamp] = false;
        
        // Create appointment
        uint256 appointmentId = appointmentIdCounter;
        appointments[appointmentId] = Appointment(
            appointmentId,
            _doctorId,
            msg.sender,
            _timestamp,
            doctors[_doctorId].feeInWei,
            true,
            false
        );
        
        // Add appointment to doctor's and patient's lists
        patientAppointments[msg.sender].push(appointmentId);
        
        // Emit event
        emit AppointmentBooked(appointmentId, _doctorId, msg.sender, _timestamp, doctors[_doctorId].feeInWei);
        
        appointmentIdCounter++;
    }
    
    function cancelAppointment(uint256 _appointmentId) public {
        Appointment storage appointment = appointments[_appointmentId];
        
        require(appointment.id != 0, "Appointment does not exist");
        require(msg.sender == appointment.patient || msg.sender == owner, "Not authorized to cancel");
        require(!appointment.isCancelled, "Appointment already cancelled");
        
        appointment.isCancelled = true;
        
        // Make time slot available again
        availableTimeSlots[appointment.doctorId][appointment.timestamp] = true;
        
        // Refund patient if called by owner
        if (msg.sender == owner && appointment.isPaid) {
            payable(appointment.patient).transfer(appointment.feeInWei);
        }
        
        emit AppointmentCancelled(_appointmentId);
    }
    
    function getDoctorAppointments(uint256 _doctorId) public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < appointmentIdCounter; i++) {
            if (appointments[i].doctorId == _doctorId && !appointments[i].isCancelled) {
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < appointmentIdCounter; i++) {
            if (appointments[i].doctorId == _doctorId && !appointments[i].isCancelled) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }
    
    function getPatientAppointments() public view returns (uint256[] memory) {
        return patientAppointments[msg.sender];
    }
    
    function getDoctorTimeSlots(uint256 _doctorId, uint256[] memory _timestamps) public view returns (bool[] memory) {
        bool[] memory available = new bool[](_timestamps.length);
        for (uint256 i = 0; i < _timestamps.length; i++) {
            available[i] = availableTimeSlots[_doctorId][_timestamps[i]];
        }
        return available;
    }
}