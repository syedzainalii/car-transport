'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email');

  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) router.push('/register');
  }, [email, router]);

  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');

    const res = await fetch(`${API_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (res.ok) {
      setMsg('Email verified! Redirecting...');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setError(data.message);
    }

    setLoading(false);
  };

  const resend = async () => {
    await fetch(`${API_URL}/api/auth/resend-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setMsg('New code sent');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={verify} className="bg-white p-8 rounded-lg w-96 shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Verify Email</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}
        {msg && <p className="text-green-600 mb-3">{msg}</p>}

        <input
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          className="w-full text-center text-2xl border p-3 mb-4"
        />

        <button
          disabled={loading || code.length !== 6}
          className="w-full bg-blue-600 text-white p-3 rounded disabled:bg-gray-400"
        >
          {loading ? 'Verifying…' : 'Verify'}
        </button>

        <button
          type="button"
          onClick={resend}
          className="mt-4 text-blue-600 w-full text-center"
        >
          Resend Code
        </button>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="p-10">Loading…</p>}>
      <VerifyForm />
    </Suspense>
  );
}
