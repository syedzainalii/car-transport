'use client';
import { useEffect, useState } from 'react';
import DataTable from '@/app/Components/admin/DataTable';
import { carAPI } from '@/app/lib/api';
import { carData } from '@/assets/assets';

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
    is_active: true,
    image: null,       // FILE
    preview: '',       // PREVIEW URL / BASE64
  });

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await carAPI.getAll(false);
      setCars(data.cars || []);
      setOffline(false);
    } catch (err) {
      setError('Backend unavailable — using local data');
      setOffline(true);
      const local = localStorage.getItem('localCars');
      setCars(local ? JSON.parse(local) : carData || []);
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
      is_active: car.is_active ?? true,
      image: null,
      preview: car.image_url || '',
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
          image_url: formData.preview,
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
        payload.append('is_active', formData.is_active);

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
      alert('Failed to save car');
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
          src={car.image_url}
          className="w-20 h-20 object-cover rounded-lg"
          alt={car.name}
        />
      ),
    },
    { header: 'Name', render: (car) => car.name },
    { header: 'Brand', render: (car) => car.brand || '-' },
    {
      header: 'Status',
      render: (car) => (
        <span className={car.is_active ? 'text-green-600' : 'text-gray-400'}>
          {car.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const actions = (car) => (
    <div className="flex gap-2">
      <button onClick={() => handleEdit(car)} className="btn-blue">Edit</button>
      <button
        onClick={() => handleDelete(car.id)}
        disabled={deletingCarId === car.id}
        className="btn-red"
      >
        Delete
      </button>
    </div>
  );

  const renderModal = (isCreate) => {
    const open = isCreate ? showCreateModal : showEditModal;
    if (!open) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-xl">
          <h3 className="text-xl font-bold mb-4">
            {isCreate ? 'Add Car' : 'Edit Car'}
          </h3>

          <input
            className="input"
            placeholder="Car Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            className="input"
            placeholder="Brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          />

          <textarea
            className="input"
            placeholder="Details"
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files[0])}
          />

          {formData.preview && (
            <img
              src={formData.preview}
              className="w-32 h-32 object-cover rounded mt-2"
            />
          )}

          <label className="flex gap-2 mt-3">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
            Active
          </label>

          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => (isCreate ? setShowCreateModal(false) : setShowEditModal(false))}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-blue">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Cars Management</h2>
        <button onClick={handleCreate} className="btn-blue">+ Add Car</button>
      </div>

      <DataTable
        columns={columns}
        data={cars}
        loading={loading}
        actions={actions}
      />

      {renderModal(true)}
      {renderModal(false)}
    </>
  );
}
