'use client';

import { useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { createClient } from '@supabase/supabase-js';
import zipData from '@/data/USCities.json';

// Supabase configuration - you'll need to add these to your .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Validation schemas
const step1Schema = Yup.object().shape({
  company: Yup.string().min(3, 'Company name is required').required('Company name is required'),
  phone: Yup.string().min(5, 'Phone is required').required('Phone is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  zip: Yup.string().min(3, 'ZIP code is required').required('ZIP code is required'),
  city: Yup.string(),
  state: Yup.string(),
  county: Yup.string(),
});

const step2Schema = Yup.object().shape({
  experienceLevel: Yup.string().required('Please select one'),
});

const step3Schema = Yup.object().shape({
  educationLevel: Yup.string().required('Please select one'),
});

const step4Schema = Yup.object().shape({
  qualificationLevel: Yup.string().required('Please select one'),
});

// Form data type
type FormData = {
  company: string;
  phone: string;
  email: string;
  zip: string;
  city: string;
  state: string;
  county: string;
  experienceLevel: string;
  educationLevel: string;
  qualificationLevel: string;
};

// Initial values
const initialValues: FormData = {
  company: '',
  phone: '',
  email: '',
  zip: '',
  city: '',
  state: '',
  county: '',
  experienceLevel: '',
  educationLevel: '',
  qualificationLevel: '',
};

// Convert to snake_case for database
const convertToSnakeCase = (data: FormData): Record<string, string> => {
  const mapping: Record<keyof FormData, string> = {
    city: 'city',
    company: 'company',
    county: 'county',
    email: 'email',
    phone: 'phone',
    experienceLevel: 'experience_level',
    educationLevel: 'education_level',
    qualificationLevel: 'qualification_level',
    state: 'state',
    zip: 'zip',
  };

  const result: Record<string, string> = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const snakeKey = mapping[key as keyof FormData] || key;
      result[snakeKey] = data[key as keyof FormData];
    }
  }
  return result;
};

export default function RegistraciaPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialValues);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);

  const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

  // Get validation schema based on current step
  const getValidationSchema = (): Yup.ObjectSchema<Partial<FormData>> => {
    switch (activeStep) {
      case 0:
        return step1Schema as Yup.ObjectSchema<Partial<FormData>>;
      case 1:
        return step2Schema as Yup.ObjectSchema<Partial<FormData>>;
      case 2:
        return step3Schema as Yup.ObjectSchema<Partial<FormData>>;
      case 3:
        return step4Schema as Yup.ObjectSchema<Partial<FormData>>;
      default:
        return Yup.object() as Yup.ObjectSchema<Partial<FormData>>;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(getValidationSchema()) as Resolver<FormData>,
    defaultValues: formData,
    mode: 'onChange',
  });

  const watchedValues = watch();

  const onSubmit = async (data: FormData) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // Submit to Supabase
      setIsLoading(true);
      try {
        if (supabase) {
          const snakeCaseData = convertToSnakeCase(updatedData);
          const { error } = await supabase.from('gmc').insert([snakeCaseData]);
          
          if (error) {
            console.error('Error saving to database:', error);
            alert('There was an error submitting your form. Please try again.');
          } else {
            setIsSubmitted(true);
            // Send email notification
            try {
              await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  templateId: Number(process.env.NEXT_PUBLIC_REGISTRATION_TEMPLATE_ID || 0),
                  email: updatedData.email,
                  params: {
                    company: updatedData.company,
                  },
                }),
              });
            } catch (emailError) {
              console.error('Error sending email:', emailError);
              // Don't fail the form submission if email fails
            }
          }
        } else {
          console.warn('Supabase not configured');
          setIsSubmitted(true);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your form. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value.replace(/\D/g, '').substring(0, 5);
    setValue('zip', zip);
    
    // Clear city, state, county when ZIP changes
    if (zip.length < 3) {
      setValue('city', '');
      setValue('state', '');
      setValue('county', '');
      return;
    }
    
    // Look up ZIP code when we have 3-5 digits
    if (zip.length >= 3 && zip.length <= 5) {
      setZipLoading(true);
      
      try {
        // Find matching ZIP code in the data
        const zipNumber = parseInt(zip, 10);
        const matchedZip = (zipData as Array<{
          zip_code: number;
          city: string;
          state: string;
          county: string;
        }>).find((item) => item.zip_code === zipNumber);
        
        if (matchedZip) {
          setValue('city', matchedZip.city);
          setValue('state', matchedZip.state);
          setValue('county', matchedZip.county);
        } else {
          // ZIP not found - clear fields
          setValue('city', '');
          setValue('state', '');
          setValue('county', '');
        }
      } catch (error) {
        console.error('Error looking up ZIP code:', error);
        setValue('city', '');
        setValue('state', '');
        setValue('county', '');
      } finally {
        setZipLoading(false);
      }
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get a tailored advice</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company name</label>
              <input
                {...register('company')}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP</label>
              <input
                {...register('zip')}
                onChange={handleZipChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="XXXXX"
                maxLength={5}
              />
              {zipLoading && (
                <div className="absolute right-4 top-9">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {errors.zip && (
                <p className="mt-1 text-sm text-red-600">{errors.zip.message as string}</p>
              )}
            </div>

            {(watchedValues.zip && watchedValues.zip.length >= 3) && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    {...register('city')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-50"
                    readOnly
                    value={watchedValues.city || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    {...register('state')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-50"
                    readOnly
                    value={watchedValues.state || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
                  <input
                    {...register('county')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-50"
                    readOnly
                    value={watchedValues.county || ''}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Structure</h2>
            <div className="space-y-3">
              {['LLC', 'S Corp', 'C Corp', 'NonProfit', 'Not Sure'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setValue('experienceLevel', option);
                    trigger('experienceLevel');
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    watchedValues.experienceLevel === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.experienceLevel && (
              <p className="text-sm text-red-600">{errors.experienceLevel.message as string}</p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Industry:</h2>
            <div className="space-y-3">
              {[
                'Food & Beverage',
                'Financial Services',
                'Federal Contractor',
                'Hospitality',
                'Retail',
                'Export/Import',
                'Construction',
                'Real Estate',
                'Other Industry',
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setValue('educationLevel', option);
                    trigger('educationLevel');
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    watchedValues.educationLevel === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.educationLevel && (
              <p className="text-sm text-red-600">{errors.educationLevel.message as string}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Which service do you need?</h2>
            <div className="space-y-3">
              {[
                'Hire Remote Workers',
                'Global payroll',
                'Outsource HR',
                'Employer of Record (EOR)',
                'Maintain Compliance',
                'Expand Globally',
                'Consulting Services',
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setValue('qualificationLevel', option);
                    trigger('qualificationLevel');
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    watchedValues.qualificationLevel === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.qualificationLevel && (
              <p className="text-sm text-red-600">{errors.qualificationLevel.message as string}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-padding">
          <div className="bg-white rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Thank you!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              The information is submitted, we&apos;ll get back to you shortly.
            </p>
            <button
              onClick={() => {
                setActiveStep(0);
                setFormData(initialValues);
                setIsSubmitted(false);
              }}
              className="w-full px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="relative">
                    {index < activeStep ? (
                      /* Completed Step - Checkmark in teal circle */
                      <div className="w-10 h-10 rounded-full border-2 border-teal-400 bg-teal-400 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      /* Active or Inactive Step - Ring + Dot */
                      <div
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                          index === activeStep
                            ? 'border-teal-400'
                            : 'border-gray-300'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === activeStep
                              ? 'bg-teal-400'
                              : 'bg-gray-500'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                  <span className="mt-2 text-sm text-gray-700">{step}</span>
                </div>
                
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="relative" style={{ width: '80px', height: '2px', marginTop: '-20px' }}>
                    <div
                      className={`absolute top-0 left-0 right-0 h-0.5 ${
                        index < activeStep ? 'bg-teal-400' : 'bg-gray-300'
                      }`}
                      style={{ top: '50%', transform: 'translateY(-50%)' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-padding">
            <div className="bg-white rounded-3xl p-8">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                {activeStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
