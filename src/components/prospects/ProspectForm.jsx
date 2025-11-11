import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * ProspectForm component
 * Reusable form for creating or editing prospects
 */
const ProspectForm = ({ initialData = {}, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    linkedinUrl: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    bio: '',
    companyName: '',
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        linkedinUrl: '',
        firstName: '',
        lastName: '',
        jobTitle: '',
        bio: '',
        companyName: '',
        ...initialData,
      });
    }
  }, [initialData]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    // LinkedIn URL is required
    if (!formData.linkedinUrl.trim()) {
      newErrors.linkedinUrl = 'LinkedIn URL is required';
    } else if (!formData.linkedinUrl.includes('linkedin.com')) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL';
    }

    // First name validation (optional but has min length if provided)
    if (formData.firstName && formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation (optional but has min length if provided)
    if (formData.lastName && formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Only send non-empty fields
    const dataToSubmit = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] && formData[key].trim()) {
        acc[key] = formData[key].trim();
      }
      return acc;
    }, {});

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="LinkedIn URL"
          name="linkedinUrl"
          type="url"
          placeholder="https://www.linkedin.com/in/username"
          value={formData.linkedinUrl}
          onChange={handleChange}
          error={errors.linkedinUrl}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />

          <Input
            label="Last Name"
            name="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <Input
          label="Job Title"
          name="jobTitle"
          type="text"
          placeholder="Senior Software Engineer"
          value={formData.jobTitle}
          onChange={handleChange}
          error={errors.jobTitle}
        />

        <Input
          label="Company Name"
          name="companyName"
          type="text"
          placeholder="Acme Corporation"
          value={formData.companyName}
          onChange={handleChange}
          error={errors.companyName}
        />

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bio / About
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            placeholder="Brief bio or about section..."
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-linkedin-500 focus:border-transparent"
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-error">{errors.bio}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData._id ? 'Update Prospect' : 'Add Prospect'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProspectForm;
