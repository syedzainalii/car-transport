'use client';
import { useEffect, useState } from 'react';
import DataTable from '@/app/Components/admin/DataTable';
import { carAPI } from '@/app/lib/api';

// CONFIGURATION: Replace this with your actual backend URL
// If you are using Flask locally, it is usually http://localhost:4000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function CarsSection() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');
  const [editingCar, setEditingCar] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingCarId, setDeletingCarId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    details: '',
    seats: '',
    features: '', // comma-separated or JSON string // JSON string
    is_active: true,
    image: null,      // FILE OBJECT
    preview: '',      // PREVIEW URL / BASE64
  });

  useEffect(() => {
    loadCars();
  }, []);

  // --- HELPER: Resolve Image URL ---
  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/150?text=No+Image'; // Fallback
    
    // 1. If it's a Base64 string or Blob (Offline mode / Preview)
    if (path.startsWith('data:') || path.startsWith('blob:')) {
      return path;
    }
    
    // 2. If it's an absolute URL (External source like S3/Cloudinary)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // 3. If it's a relative path from Backend (e.g., /uploads/car.jpg)
    // We append the Backend URL
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await carAPI.getAll(false);
      setCars(data.cars || []);
      setOffline(false);
    } catch (err) {
      setError('Backend unavailable');
      setOffline(true);
      const local = localStorage.getItem('localCars');
      setCars(local ? JSON.parse(local) : []);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCar(null);
    setFormData({
      name: '',
      brand: '',
      details: '',
      seats: '',
      features: '',
      is_active: true,
      image: null,
      preview: '',
    });
    setShowCreateModal(true);
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name || '',
      brand: car.brand || '',
      details: car.details || '',
      seats: car.seats || '',
      features: Array.isArray(car.features) ? car.features.join(', ') : (car.features || ''),
      is_active: car.is_active ?? true,
      image: null,
      preview: getImageUrl(car.image_url),
    });
    setShowEditModal(true);
  };

  const handleImageChange = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert('Car name is required');
      return;
    }

    try {
      setSaving(true);

      if (offline) {
        let updated = [...cars];
        const carDataLocal = {
          ...formData,
          image_url: formData.preview, // Save Base64 for offline viewing
        };

        delete carDataLocal.image;
        delete carDataLocal.preview;

        if (editingCar) {
          updated = updated.map((c) =>
            c.id === editingCar.id ? { ...c, ...carDataLocal } : c
          );
        } else {
          const newId = Date.now();
          updated.unshift({ id: newId, ...carDataLocal });
        }

        setCars(updated);
        localStorage.setItem('localCars', JSON.stringify(updated));
      } else {
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('brand', formData.brand);
        payload.append('details', formData.details);
        payload.append('seats', formData.seats);
        // Features: send as JSON stringified array
        try {
          const featuresArr = formData.features.split(',').map(f => f.trim()).filter(Boolean);
          payload.append('features', JSON.stringify(featuresArr));
        } catch {
          payload.append('features', '[]');
        }
        // Specs: send as JSON string
        try {
          payload.append('specs', formData.specs ? JSON.stringify(JSON.parse(formData.specs)) : '{}');
        } catch {
          payload.append('specs', '{}');
        }
        // Ensure boolean is sent correctly (some backends prefer 1/0)
        payload.append('is_active', formData.is_active ? '1' : '0');

        if (formData.image) {
          payload.append('image', formData.image);
        }

        if (editingCar) {
          await carAPI.update(editingCar.id, payload);
        } else {
          await carAPI.create(payload);
        }

        await loadCars();
      }

      setShowCreateModal(false);
      setShowEditModal(false);
      setEditingCar(null);
    } catch (err) {
      console.error('Error saving car:', err);
      alert(`Failed to save car: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this car?')) return;

    try {
      setDeletingCarId(id);
      if (offline) {
        const updated = cars.filter((c) => c.id !== id);
        setCars(updated);
        localStorage.setItem('localCars', JSON.stringify(updated));
      } else {
        await carAPI.delete(id);
        await loadCars();
      }
    } finally {
      setDeletingCarId(null);
    }
  };

  const columns = [
    {
      header: 'Image',
      render: (car) => (
        <img
          src={getImageUrl(car.image_url)}
          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
          alt={car.name}
          // Fallback if image fails to load
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
          }}
        />
      ),
    },
    { header: 'Name', render: (car) => car.name },
    { header: 'Brand', render: (car) => car.brand || '-' },
    {
      header: 'Status',
      render: (car) => (
        <span className={`px-2 py-1 rounded text-sm ${car.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {car.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const actions = (car) => (
    <div className="flex gap-2">
      <button onClick={() => handleEdit(car)} className="btn-blue text-sm px-3 py-1">Edit</button>
      <button
        onClick={() => handleDelete(car.id)}
        disabled={deletingCarId === car.id}
        className="btn-red text-sm px-3 py-1"
      >
        {deletingCarId === car.id ? '...' : 'Delete'}
      </button>
    </div>
  );

  const renderModal = (isCreate) => {
    const open = isCreate ? showCreateModal : showEditModal;
    if (!open) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {isCreate ? 'Add New Car' : 'Edit Car'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                className="input w-full border rounded p-2"
                placeholder="Car Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                className="input w-full border rounded p-2"
                placeholder="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Seats</label>
              <input
                className="input w-full border rounded p-2"
                placeholder="Seats"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
              <input
                className="input w-full border rounded p-2"
                placeholder="e.g. AC, GPS, Bluetooth"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Details</label>
              <textarea
                className="input w-full border rounded p-2"
                placeholder="Details"
                rows={3}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.preview && (
                <div className="mt-2">
                   <p className="text-xs text-gray-500 mb-1">Preview:</p>
                   <img
                    src={formData.preview}
                    className="w-full h-40 object-contain bg-gray-50 rounded border"
                    alt="Preview"
                  />
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
              />
              <span className="text-sm font-medium">Active Status</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <button 
              onClick={() => (isCreate ? setShowCreateModal(false) : setShowEditModal(false))}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={saving} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Cars Management</h2>
          {offline && <span className="text-xs text-red-500 font-semibold">⚠ Offline Mode</span>}
        </div>
        <button 
          onClick={handleCreate} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Car
        </button>
      </div>

      <DataTable
        columns={columns}
        data={cars}
        loading={loading}
        actions={actions}
      />
      {renderModal(true)}
      {renderModal(false)}
    </div>
  );
}