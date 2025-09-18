import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import CountrySelector from './CountrySelector';
import useCountryStore from '../store/countryStore';
import useAuthStore from '../store/authStore';
import * as mockApi from '../api/mockApi';

const phoneSchema = z.object({
  countryCode: z.string().min(1, 'Select country code'),
  phone: z.string().min(6, 'Too short').max(15, 'Too long'),
});

const otpSchema = z.object({
  otp: z.string().min(4, 'Enter OTP'),
});

export default function AuthForm() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout); // <-- Add this line
  const { countries, setCountries } = useCountryStore();
  const [step, setStep] = useState('phone'); // phone | otp
  const [sentPhone, setSentPhone] = useState('');
  const [serverOtp, setServerOtp] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch country list once
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2');
        const data = await res.json();
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(data);
      } catch (e) {
        console.error('Failed to load countries', e);
        setCountries([
          {
            name: { common: 'India' },
            idd: { root: '+91', suffixes: [''] },
            cca2: 'IN',
          },
        ]);
      }
    };
    if (!countries || countries.length === 0) fetchCountries();
    // Cleanup all toasts on unmount
    return () => {
      toast.dismiss();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const phoneForm = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: { countryCode: '+91', phone: '' },
  });
  const otpForm = useForm({ resolver: zodResolver(otpSchema) });

  const onSendOtp = async (data) => {
    setLoading(true);
    const cleanPhone = data.phone.replace(/\D/g, '');
    const full = `${data.countryCode}${cleanPhone}`;
    try {
      toast.loading('Sending OTP...', { id: 'send' });
      const res = await mockApi.sendOtp(full);
      toast.dismiss('send');
      toast.success('OTP Sent');
      setServerOtp(res.otp); // Dev only! Remove in production.
      setSentPhone(full);
      setStep('otp');
    } catch (e) {
      toast.dismiss('send');
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (d) => {
    setLoading(true);
    try {
      toast.loading('Verifying...', { id: 'ver' });
      const result = await mockApi.verifyOtp(d.otp);
      toast.dismiss('ver');
      toast.success('Login Successful');
      setAuth(result.token, result.user);
    } catch (e) {
      toast.dismiss('ver');
      toast.error('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-800 p-6 rounded shadow">
      {/* Logout button at the top */}
      <button
        onClick={logout}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
        type="button"
      >
        Logout
      </button>
      <h2 className="text-xl font-semibold mb-4">Sign in with phone</h2>

      {step === 'phone' && (
        <form onSubmit={phoneForm.handleSubmit(onSendOtp)} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Country code</label>
            <CountrySelector
              countries={countries}
              value={phoneForm.watch('countryCode') || '+91'}
              onChange={(v) => phoneForm.setValue('countryCode', v)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              {...phoneForm.register('phone')}
              className="w-full border p-2 rounded
                bg-white text-black placeholder-gray-400
               dark:bg-gray-800 dark:text-white dark:placeholder-gray-300 dark:border-gray-600"
              placeholder="e.g. 9876543210"
              disabled={loading}
            />
            {phoneForm.formState.errors.phone && (
              <p className="text-red-500 text-sm">{phoneForm.formState.errors.phone.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={otpForm.handleSubmit(onVerify)} className="space-y-3">
          <p className="text-sm">
            Enter the OTP sent to <strong>{sentPhone}</strong>
          </p>
          <input
            {...otpForm.register('otp')}
            className="w-full border p-2 rounded
                     bg-white text-black placeholder-gray-400
                    dark:bg-gray-800 dark:text-white dark:placeholder-gray-300 dark:border-gray-600"
            placeholder="Enter OTP"
            disabled={loading}
          />
          {otpForm.formState.errors.otp && (
            <p className="text-red-500 text-sm">{otpForm.formState.errors.otp.message}</p>
          )}
          <div className="flex gap-2">
            <button
              className="flex-1 bg-indigo-600 text-white p-2 rounded"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="flex-1 border p-2 rounded"
              disabled={loading}
            >
              Change number
            </button>
          </div>
          {/* Remove this in production */}
          <p className="text-xs text-gray-500">
            Dev OTP (for testing): <code>{serverOtp}</code>
          </p>
        </form>
      )}
    </div>
  );
}