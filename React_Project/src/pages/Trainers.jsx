import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const Trainers = () => {
  const { trainers, dispatchTrainers, TRAINER_ACTIONS, sessions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    skill: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const resetForm = () => {
    setFormData({ name: "", employeeId: "", email: "", phone: "", skill: "" });
    setEditingTrainer(null);
    setErrors({});
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };
  const openEditModal = (trainer) => {
    setFormData(trainer);
    setEditingTrainer(trainer);
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required";
    } else {
      const isDuplicate = trainers.some(
        (t) =>
          t.employeeId === formData.employeeId && t.id !== editingTrainer?.id
      );
      if (isDuplicate) {
        newErrors.employeeId = "Employee ID already exists";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.skill.trim()) {
      newErrors.skill = "Skill is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingTrainer) {
        dispatchTrainers({
          type: TRAINER_ACTIONS.UPDATE_TRAINER,
          payload: { ...formData, id: editingTrainer.id },
        });
        showNotification("Trainer updated successfully!");
      } else {
        dispatchTrainers({
          type: TRAINER_ACTIONS.ADD_TRAINER,
          payload: formData,
        });
        showNotification("Trainer added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      showNotification("An error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this trainer?")) {
      dispatchTrainers({ type: TRAINER_ACTIONS.DELETE_TRAINER, payload: id });
      showNotification("Trainer deleted successfully!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const getTrainerSessions = (id) =>
    sessions.filter((s) => s.trainerId === id).length;
  const filteredTrainers = trainers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trainers</h1>
        <button onClick={openAddModal} className="btn btn-primary">
          Add Trainer
        </button>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search trainers..."
        className="w-full px-4 py-2 border rounded-lg"
      />

      {filteredTrainers.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No trainers found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrainers.map((trainer) => (
            <div key={trainer.id} className="card p-4">
              <h3 className="font-bold text-lg mb-2">{trainer.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                ID: {trainer.employeeId}
              </p>
              <p className="text-sm text-gray-600 mb-1">{trainer.email}</p>
              <p className="text-sm text-gray-600 mb-3">{trainer.phone}</p>
              <p className="text-sm font-medium mb-3">
                Skills: {trainer.skill}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                {getTrainerSessions(trainer.id)} sessions assigned
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(trainer)}
                  className="btn btn-outline btn-sm flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(trainer.id)}
                  className="btn btn-danger btn-sm flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => {
            setIsModalOpen(false);
            resetForm();
          }}
        >
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="font-semibold">
                {editingTrainer ? "Edit Trainer" : "Add Trainer"}
              </span>
              <button
                className="text-slate-600"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.employeeId ? "border-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.employeeId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.employeeId}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Skill
                  </label>
                  <input
                    type="text"
                    name="skill"
                    value={formData.skill}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.skill ? "border-red-500" : ""
                    }`}
                    placeholder="e.g., React & JavaScript"
                    disabled={isSubmitting}
                  />
                  {errors.skill && (
                    <p className="text-red-500 text-xs mt-1">{errors.skill}</p>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    className="btn btn-outline flex-1"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingTrainer
                      ? "Update"
                      : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trainers;
