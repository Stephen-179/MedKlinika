import API from './api';

// Get all appointments
// Get all appointments with page and search
export const getAppointments = async (page, search) => {
  const { data } = await API.get('/appointments', {
    params: { page, search }
  });
  return data; // returns { data, total, page, pages }
};


// Get a single appointment by ID
export const getAppointment = async (id) => {
  const { data } = await API.get(`/appointments/${id}`);
  return data;
};

// Add an appointment
export const addAppointment = async (appointment) => {
  const { data } = await API.post('/appointments', appointment);
  return data;
};

// Update an appointment
export const updateAppointment = async (id, updateData) => {
  const { data } = await API.put(`/appointments/${id}`, updateData);
  return data;
};

// Delete an appointment
export const deleteAppointment = async (id) => {
  const { data } = await API.delete(`/appointments/${id}`);
  return data;
};
