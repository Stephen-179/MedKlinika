import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addPatient } from '../services/patientService';
import { toast } from 'sonner';

const AddPatientModal = ({ open, onOpenChange, onPatientAdded }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const patient = {
      name: e.target.name.value,
      gender: e.target.gender.value,
      dateOfBirth: e.target.dateOfBirth.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
      allergies: e.target.allergies.value,
      medicalHistory: e.target.medicalHistory.value,
    };

    try {
      await addPatient(patient);
      toast.success('Patient added successfully');
      onPatientAdded(); // Refresh list
      onOpenChange(false); // Close modal
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>Fill in the details below to add a new patient to the clinic.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'gender', label: 'Gender', type: 'text', required: true, placeholder: 'male / female / other' },
            { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'address', label: 'Address', type: 'text' },
            { name: 'allergies', label: 'Allergies', type: 'text' },
            { name: 'medicalHistory', label: 'Medical History', type: 'text' },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
              </label>
              <Input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder || ''}
                required={field.required}
              />
            </div>
          ))}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Patient'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientModal;
