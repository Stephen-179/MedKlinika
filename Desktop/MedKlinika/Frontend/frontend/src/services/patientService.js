import API from './api';

// Get all patients
export const getPatients = async () => {
    const { data } = await API.get('/patients');
    return data;
};

// Add a patient
export const addPatient = async (patient) => {
    const { data } = await API.post('/patients', patient);
    return data;
};

// Get a specific patient by ID
export const getPatient = async (id) => {
    const { data } = await API.get(`/patients/${id}`);
    return data;
};

// Update a patient by ID
export const updatePatient = async (id, updateData) => {
    const { data } = await API.put(`/patients/${id}`, updateData);
    return data;
};

// ✅ Add this:
export const deletePatient = async (id) => {
    const { data } = await API.delete(`/patients/${id}`);
    return data;
};
