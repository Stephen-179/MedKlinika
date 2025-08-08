import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateAppointment, getAppointment } from '../services/appointmentService';
import { toast } from 'sonner';

const EditAppointmentModal = ({ open, onOpenChange, appointmentId, onAppointmentUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    status: 'scheduled',
  });

  useEffect(() => {
    if (appointmentId && open) {
      const fetchAppointment = async () => {
        try {
          const data = await getAppointment(appointmentId);
          setFormData({
            date: data.date ? data.date.slice(0, 10) : '',
            time: data.time || '',
            reason: data.reason || '',
            status: data.status || 'scheduled',
          });
        } catch (error) {
          console.error(error);
          toast.error('Failed to load appointment');
        }
      };
      fetchAppointment();
    }
  }, [appointmentId, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateAppointment(appointmentId, formData);
      toast.success('Appointment updated');
      onAppointmentUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Date</Label>
            <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div>
            <Label>Time</Label>
            <Input type="time" name="time" value={formData.time} onChange={handleChange} required />
          </div>
          <div>
            <Label>Reason</Label>
            <Input type="text" name="reason" value={formData.reason} onChange={handleChange} />
          </div>
          <div>
            <Label>Status</Label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Appointment'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentModal;
