// Import React hooks for state and side effects
import { useState, useEffect } from 'react';

// Import reusable Button component
import { Button } from '@/components/ui/button';

// Import patient service functions to fetch and delete patients
import { getPatients, deletePatient } from '../services/patientService';

// Import modal to add new patients
import AddPatientModal from '../components/AddPatientModal';

// Import modal to edit patients
import EditPatientModal from '../components/EditPatientModal';

// Import Card and CardContent for patient display
import { Card, CardContent } from '@/components/ui/card';

// Import Skeleton loaders for loading states
import { Skeleton } from '@/components/ui/skeleton';

// Import React Router navigation hook
import { useNavigate } from 'react-router-dom';

// Import toast notifications for user feedback
import { toast } from 'sonner';

// Import Navbar for consistent top navigation across the app
import Navbar from '../components/Navbar';

// Dashboard component to display and manage the list of patients
const Dashboard = () => {
  const [patients, setPatients] = useState([]); // Store fetched patients
  const [loading, setLoading] = useState(true); // Loading state
  const [modalOpen, setModalOpen] = useState(false); // Add Patient modal control
  const [editModalOpen, setEditModalOpen] = useState(false); // Edit Patient modal control
  const [selectedPatientId, setSelectedPatientId] = useState(null); // ID of the patient to edit

  const navigate = useNavigate(); // Hook for navigation

  // Function to fetch patients from the backend
  const fetchPatients = async () => {
    try {
      setLoading(true); // Show loader during fetch
      const data = await getPatients(); // Fetch patients
      setPatients(data); // Update state with fetched data
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch patients'); // Show error notification
    } finally {
      setLoading(false); // Stop loader
    }
  };

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle deleting a patient
  const handleDelete = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to delete this patient?')) return; // Confirm deletion
      await deletePatient(id); // Delete patient by ID
      toast.success('Patient deleted'); // Show success toast
      fetchPatients(); // Refresh patient list after deletion
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete patient'); // Show error toast
    }
  };

  return (
    <>
      {/* Navbar at the top of the dashboard for consistent navigation */}
      <Navbar />

      {/* Main dashboard container */}
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header with title and action buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" aria-label="Patient Dashboard">
            Patient Dashboard
          </h1>

          <div className="flex gap-2">
            {/* Refresh patient list */}
            <Button variant="outline" onClick={fetchPatients}>
              Refresh
            </Button>

            {/* Open Add Patient modal */}
            <Button onClick={() => setModalOpen(true)}>Add Patient</Button>
          </div>
        </div>

        {/* Add Patient modal component */}
        <AddPatientModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onPatientAdded={fetchPatients} // Refetch patients after adding a new one
        />

        {/* Loading state with skeleton loaders */}
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : patients.length === 0 ? (
          // If no patients found
          <p className="text-center text-gray-500">No patients found.</p>
        ) : (
          // Display the list of patients
          <div className="space-y-4">
            {patients.map((patient) => (
              <Card key={patient._id}>
                <CardContent
                  className="p-4 flex justify-between items-center hover:bg-accent cursor-pointer transition rounded-lg"
                  onClick={() => {
                    setSelectedPatientId(patient._id);
                    setEditModalOpen(true);
                  }}
                >
                  {/* Patient details */}
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-sm text-gray-500">
                      {patient.gender} | {patient.phone}
                    </p>
                  </div>

                  {/* Delete button for the patient */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening modal when clicking delete
                      handleDelete(patient._id);
                    }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Patient modal component (rendered globally, not inside map) */}
        <EditPatientModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          patientId={selectedPatientId}
          onPatientUpdated={fetchPatients}
        />

        {/* =======================
            PLACE TO ADD LATER:
            - Search/filter bar for patients
            - Pagination controls for large patient lists
            - Export patient data to CSV/PDF
            - Dashboard summary cards
            - Upcoming appointments section
            ======================= */}
      </div>
    </>
  );
};

export default Dashboard;
