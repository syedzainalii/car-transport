'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Backend not reachable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 mb-4">{error}</div>}

        {['name', 'email', 'password', 'confirmPassword'].map((field) => (
          <input
            key={field}
            type={field.includes('password') ? 'password' : 'text'}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            className="w-full p-3 border rounded mb-4"
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            required
          />
        ))}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold disabled:bg-gray-400"
        >
          {loading ? 'Creating…' : 'Register'}
        </button>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
