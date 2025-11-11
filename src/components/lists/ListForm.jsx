import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * ListForm component
 * Reusable form for creating or editing lists
 */
const ListForm = ({ initialData = {}, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        name: '',
        description: '',
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

    // Name is required
    if (!formData.name.trim()) {
      newErrors.name = 'List name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'List name must be at least 2 characters';
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
    const dataToSubmit = {
      name: formData.name.trim(),
      ...(formData.description && { description: formData.description.trim() }),
    };

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="List Name"
          name="name"
          type="text"
          placeholder="e.g., Hot Leads Q1 2025"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Brief description of this list..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-linkedin-500 focus:border-transparent"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData._id ? 'Update List' : 'Create List'}
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

export default ListForm;
