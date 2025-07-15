// Import necessary React hooks and router utilities
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import the service function to fetch a single patient by ID
import { getPatient } from '../services/patientService';

// Import reusable UI components
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Import the Navbar to display at the top of the page
import Navbar from '../components/Navbar';

// PatientDetails component for displaying a single patient's detailed information
const PatientDetails = () => {
  // Retrieve the patient ID from the URL parameters
  const { id } = useParams();

  // Hook for navigation
  const navigate = useNavigate();

  // State for patient data
  const [patient, setPatient] = useState(null);

  // State for loading indicator
  const [loading, setLoading] = useState(true);

  // Fetch patient data on component mount and when ID changes
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // Get patient details by ID
        const data = await getPatient(id);
        setPatient(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Stop loading indicator after fetching
      }
    };

    fetchPatient();
  }, [id]);

  // Show skeleton loaders while data is loading
  if (loading) {
    return (
      <>
        <Navbar /> {/* Display Navbar at the top on loading state */}
        <div className="p-6 max-w-2xl mx-auto space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </>
    );
  }

  // Show fallback if patient is not found
  if (!patient) {
    return (
      <>
        <Navbar /> {/* Display Navbar at the top on "not found" state */}
        <div className="p-6 max-w-2xl mx-auto text-center">
          <p className="text-gray-500">Patient not found.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </>
    );
  }

  // Main render of patient details with Navbar included
  return (
    <>
      <Navbar /> {/* Always display the Navbar at the top for consistent navigation */}

      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <Card>
          <CardContent className="p-6 space-y-2">
            <h1 className="text-2xl font-bold">{patient.name}</h1>
            <p><span className="font-semibold">Gender:</span> {patient.gender}</p>
            <p>
              <span className="font-semibold">Date of Birth:</span>{' '}
              {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}
            </p>
            <p><span className="font-semibold">Phone:</span> {patient.phone || 'N/A'}</p>
            <p><span className="font-semibold">Address:</span> {patient.address || 'N/A'}</p>
            <p><span className="font-semibold">Allergies:</span> {patient.allergies || 'None'}</p>
            <p><span className="font-semibold">Medical History:</span> {patient.medicalHistory || 'None'}</p>

            <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>

            {/* =======================
                PLACE TO ADD EXTENSIONS:
                - Edit Patient Button
                - Delete Patient Button
                - Add Appointments/Visits Listing
                - Add Print/Export Button
                - Add Billing Details
                ======================= */}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PatientDetails;
