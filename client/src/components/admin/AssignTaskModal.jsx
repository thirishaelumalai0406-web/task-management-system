import { useState } from 'react';
import toast from 'react-hot-toast';

const PRIORITIES = ['High', 'Medium', 'Low'];

const AssignTaskModal = ({ open, employees, loading, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    else if (form.title.trim().length > 150) newErrors.title = 'Title must be at most 150 characters';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    else if (form.description.trim().length > 2000) newErrors.description = 'Description must be at most 2000 characters';
    if (!form.assignedTo) newErrors.assignedTo = 'Please select an employee';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm({ title: '', description: '', assignedTo: '', priority: 'Medium' });
      toast.success('Task assigned successfully');
      onClose();
    } catch (error) {
      const msg =
        error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Failed to assign task';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
      hasError ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Assign New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Design landing page"
              className={inputClass(errors.title)}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the task details..."
              className={inputClass(errors.description)}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">Assigned Employee</label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              disabled={loading}
              className={inputClass(errors.assignedTo)}
            >
              <option value="" disabled>Select an employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
            {loading && <p className="text-xs text-gray-400 mt-1">Loading employees...</p>}
            {errors.assignedTo && <p className="text-red-500 text-xs mt-1">{errors.assignedTo}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={inputClass(false)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg"
            >
              {submitting ? 'Assigning...' : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;
