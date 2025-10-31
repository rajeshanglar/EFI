import { useState } from 'react';

const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
};

export const useConferenceForm = () => {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNo: '',
    institute: '',
    specialization: '',
    address: '',
    city: '',
    pinCode: '',
    state: '',
    country: '',
    category: '',
    morningWorkshop: '',
    afternoonWorkshop: '',
    paymentMode: '',
    captcha: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setFormData(prev => ({ ...prev, captcha: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const required = [
      'fullName',
      'email',
      'mobileNo',
      'institute',
      'specialization',
      'address',
      'city',
      'pinCode',
      'state',
      'country',
      'category',
      'paymentMode',
    ];
    required.forEach(field => {
      if (!formData[field as keyof typeof formData]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo))
      newErrors.mobileNo = 'Invalid mobile number';
    if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode))
      newErrors.pinCode = 'Invalid pin code';
    if (!formData.captcha.trim()) newErrors.captcha = 'CAPTCHA is required';
    else if (formData.captcha.toUpperCase() !== captcha)
      newErrors.captcha = 'Invalid CAPTCHA';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    captcha,
    handleInputChange,
    refreshCaptcha,
    validateForm,
  };
};

// Export dropdown options centrally for reusability
useConferenceForm.options = {
  countries: [
    { label: 'India', value: 'india' },
    { label: 'USA', value: 'usa' },
    { label: 'UK', value: 'uk' },
    { label: 'Canada', value: 'canada' },
  ],
  states: [
    { label: 'Maharashtra', value: 'maharashtra' },
    { label: 'Delhi', value: 'delhi' },
    { label: 'Karnataka', value: 'karnataka' },
    { label: 'Tamil Nadu', value: 'tamil_nadu' },
    { label: 'Gujarat', value: 'gujarat' },
  ],
  categories: [
    { label: 'EFI Member - Standard (National)', value: 'efi_member_national' },
    {
      label: 'EFI Member - PGs/Fellows (National)',
      value: 'efi_member_pg_national',
    },
    {
      label: 'Non-EFI Member - Standard (National)',
      value: 'non_efi_national',
    },
    {
      label: 'Non-EFI Member - PGs/Fellows (National)',
      value: 'non_efi_pg_national',
    },
    { label: 'International - Standard', value: 'international_standard' },
    { label: 'International - PGs/Fellows', value: 'international_pg' },
  ],
  workshops: [
    { label: 'Workshop 1: Advanced Techniques', value: 'workshop_1' },
    { label: 'Workshop 2: Case Studies', value: 'workshop_2' },
    { label: 'Workshop 3: Hands-on Training', value: 'workshop_3' },
    { label: 'None', value: 'none' },
  ],
  paymentModes: [
    { label: 'Online Payment', value: 'online' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'UPI', value: 'upi' },
    { label: 'Cheque', value: 'cheque' },
  ],
};
