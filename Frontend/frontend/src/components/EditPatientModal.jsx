import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updatePatient, getPatient } from '../services/patientService';
import { toast } from 'sonner';

const EditPatientModal = ({ open, onOpenChange, patientId, onPatientUpdated }) => {
  const [form, setForm] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    allergies: '',
    medicalHistory: '',
  });

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;
      try {
        const data = await getPatient(patientId);
        setForm(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load patient details');
      }
    };
    fetchPatient();
  }, [patientId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePatient(patientId, form);
      toast.success('Patient updated successfully');
      onPatientUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update patient');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <Input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} />
          <Input type="date" name="dateOfBirth" placeholder="Date of Birth" value={form.dateOfBirth?.slice(0,10)} onChange={handleChange} />
          <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <Input name="allergies" placeholder="Allergies" value={form.allergies} onChange={handleChange} />
          <Input name="medicalHistory" placeholder="Medical History" value={form.medicalHistory} onChange={handleChange} />
          <Button type="submit" className="w-full">Update Patient</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientModal;
// This component provides a modal for editing patient details.