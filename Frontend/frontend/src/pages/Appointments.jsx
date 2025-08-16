import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Navbar from '../components/Navbar';
import { toast } from 'sonner';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import ErrorBoundary from '../components/ErrorBoundary';
import {
  getAppointments,
  addAppointment,
  deleteAppointment,
} from '../services/appointmentService';
import { getPatients } from '../services/patientService';
import EditAppointmentModal from '../components/EditAppointmentModal';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    patient: '',
    date: '',
    time: '',
    reason: 'Routine checkup',
    status: 'scheduled',
  });

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments(page, search);

      setAppointments(data.data);
      setPage(data.page);
      setPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load appointments.');
      setAppointments([]);
      setPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load patients.');
      setPatients([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, search]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!formData.patient || !formData.date || !formData.time) {
      return toast.error('Please fill all required fields.');
    }
    try {
      setIsAdding(true);
      await addAppointment(formData);
      toast.success('Appointment added successfully.');
      fetchAppointments();
      setFormData({
        patient: '',
        date: '',
        time: '',
        reason: 'Routine checkup',
        status: 'scheduled',
      });
      setAddModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to add appointment.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await deleteAppointment(id);
      toast.success('Appointment deleted.');
      fetchAppointments();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete appointment.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <ErrorBoundary>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
            <DialogTrigger asChild>
              <Button>Add Appointment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Appointment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddAppointment} className="space-y-4">
                <div>
                  <Label>Patient</Label>
                  <Select
                    value={formData.patient}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, patient: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name} ({p.gender})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Reason</Label>
                  <Input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isAdding}>
                    {isAdding ? 'Adding...' : 'Add Appointment'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Input placeholder="Search by reason or status..." value={search} onChange={handleSearch} />

        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <Card key={appt._id}>
                <CardContent className="p-4 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{appt.reason || 'Routine Checkup'}</h2>
                      <Badge className={statusColors[appt.status]}>{appt.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(appt.date)} at {appt.time || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Patient: {appt.patient?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => {
                      setSelectedAppointment(appt);
                      setEditModalOpen(true);
                    }}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(appt._id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
              Previous
            </Button>
            <span>Page {page} of {pages}</span>
            <Button variant="outline" disabled={page >= pages} onClick={() => setPage((prev) => Math.min(prev + 1, pages))}>
              Next
            </Button>
          </div>
        )}
      </div>

      {selectedAppointment && (
        <EditAppointmentModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          appointment={selectedAppointment}
          onAppointmentUpdated={fetchAppointments}
        />
      )}
    </ErrorBoundary>
  );
};

export default Appointments;
