// Import React hooks
import { useState, useEffect } from 'react';

// UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Patient service functions
import { getPatients, deletePatient } from '../services/patientService';

// Modals
import AddPatientModal from '../components/AddPatientModal';
import EditPatientModal from '../components/EditPatientModal';

// Routing and navigation
import { useNavigate } from 'react-router-dom';

// Toast notifications
import { toast } from 'sonner';

// Navbar
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const navigate = useNavigate();

  // Fetch patients from backend
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle delete patient
  const handleDelete = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to delete this patient?')) return;
      await deletePatient(id);
      toast.success('Patient deleted');
      fetchPatients();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete patient');
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header and Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchPatients}>
              Refresh
            </Button>
            <Button variant="outline" onClick={() => navigate('/appointments')}>
              View Appointments
            </Button>
            <Button onClick={() => setModalOpen(true)}>Add Patient</Button>
          </div>
        </div>

        {/* Add Patient Modal */}
        <AddPatientModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onPatientAdded={fetchPatients}
        />

        {/* Loading State */}
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : patients.length === 0 ? (
          <p className="text-center text-gray-500">No patients found.</p>
        ) : (
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
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-sm text-gray-500">
                      {patient.gender} | {patient.phone}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
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

        {/* Edit Patient Modal */}
        <EditPatientModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          patientId={selectedPatientId}
          onPatientUpdated={fetchPatients}
        />

        {/* Future Enhancements */}
        {/* - Search/filter bar */}
        {/* - Pagination */}
        {/* - Dashboard summary cards */}
        {/* - Upcoming appointments preview */}
      </div>
    </>
  );
};

export default Dashboard;
