// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


contract PrescriptionManagement {

    // Structure to represent a prescription
    struct Prescription {
        uint256 id;
        address doctor;
        address patient;
        string details;
        bool isFilled;
    }

    // Mapping to store prescriptions
    mapping(uint256 => Prescription) private prescriptions;

    // Counter for prescription IDs
    uint256 public prescriptionCounter;

    // Event triggered when a new prescription is issued
    event PrescriptionIssued(uint256 prescriptionId, address doctor, address patient, string details);

    // Event triggered when a prescription is filled
    event PrescriptionFilled(uint256 prescriptionId);

    // Modifier to ensure only doctors can perform certain actions
    modifier onlyDoctor() {
        require(doctorAddresses[msg.sender], "Only doctors can perform this action");
        _;
    }

    // Mapping to store doctor addresses
    mapping(address => bool) private doctorAddresses;

    // Function for doctors to register on the platform
    function registerAsDoctor() external {
        doctorAddresses[msg.sender] = true;
    }

    // Function for doctors to issue a prescription
    function issuePrescription(address _patient, string memory _details) external onlyDoctor {
        uint256 prescriptionId = prescriptionCounter++;
        prescriptions[prescriptionId] = Prescription(prescriptionId,msg.sender, _patient, _details, false);
        emit PrescriptionIssued(prescriptionId, msg.sender, _patient, _details);
    }

    // Function for patients to check their prescriptions
    function getPrescription(uint256 _prescriptionId) external view returns (address doctor, address patient, string memory details, bool isFilled) {
        Prescription storage prescription = prescriptions[_prescriptionId];
        return (prescription.doctor, prescription.patient, prescription.details, prescription.isFilled);
    }

    // Function for pharmacists to mark a prescription as filled
    function fillPrescription(uint256 _prescriptionId) external {
        require(patientAddresses[msg.sender], "Only patients can perform this action");
        prescriptions[_prescriptionId].isFilled = true;
        emit PrescriptionFilled(_prescriptionId);
    }

    // Mapping to store patient addresses
    mapping(address => bool) private patientAddresses;
    
    // Function for patients to register on the platform
    function registerAsPatient() external {
        patientAddresses[msg.sender] = true;
    }
}
