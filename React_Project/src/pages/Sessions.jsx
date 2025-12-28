import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const Sessions = () => {
  const {
    sessions,
    trainers,
    dispatchSessions,
    SESSION_ACTIONS,
    getTrainerById,
    checkSessionConflict,
  } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    trainerId: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      startTime: "",
      endTime: "",
      trainerId: "",
    });
    setEditingSession(null);
    setErrors({});
  };
  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };
  const openEditModal = (session) => {
    setFormData(session);
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Session name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Session name must be at least 3 characters";
    }

    if (!formData.trainerId) {
      newErrors.trainerId = "Trainer is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    if (
      formData.trainerId &&
      formData.date &&
      formData.startTime &&
      formData.endTime
    ) {
      const hasConflict = checkSessionConflict(
        formData.trainerId,
        formData.date,
        formData.startTime,
        formData.endTime,
        editingSession?.id
      );
      if (hasConflict) {
        newErrors.trainerId = "Trainer has a conflicting session at this time";
      }
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
      if (editingSession) {
        dispatchSessions({
          type: SESSION_ACTIONS.UPDATE_SESSION,
          payload: {
            ...formData,
            id: editingSession.id,
            status: editingSession.status,
          },
        });
        showNotification("Session updated successfully!");
      } else {
        const sessionDateTime = new Date(
          `${formData.date}T${formData.startTime}`
        );
        const status = sessionDateTime > new Date() ? "upcoming" : "completed";
        dispatchSessions({
          type: SESSION_ACTIONS.ADD_SESSION,
          payload: { ...formData, status },
        });
        showNotification("Session scheduled successfully!");
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
    if (window.confirm("Delete this session?")) {
      dispatchSessions({ type: SESSION_ACTIONS.DELETE_SESSION, payload: id });
      showNotification("Session deleted successfully!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
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
        <h1 className="text-3xl font-bold">Sessions</h1>
        <button onClick={openAddModal} className="btn btn-primary">
          Schedule Session
        </button>
      </div>

      {sortedSessions.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No sessions scheduled</p>
      ) : (
        <div className="space-y-2">
          {sortedSessions.map((session) => {
            const trainer = getTrainerById(session.trainerId);
            const duration = (
              (new Date(`2000-01-01T${session.endTime}`) -
                new Date(`2000-01-01T${session.startTime}`)) /
              (1000 * 60 * 60)
            ).toFixed(1);
            return (
              <div key={session.id} className="card p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{session.name}</h3>
                    <p className="text-sm text-gray-600">
                      {trainer?.name || "Unknown Trainer"}
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      session.status === "upcoming"
                        ? "badge-success"
                        : "badge-default"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {session.date} • {session.startTime} - {session.endTime} (
                  {duration}h)
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Skill: {trainer?.skill || "N/A"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(session)}
                    className="btn btn-outline btn-sm w-20"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="btn btn-danger btn-sm w-20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
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
                {editingSession ? "Edit Session" : "Schedule Session"}
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
                  <label className="block text-sm font-medium mb-1">
                    Session Name
                  </label>
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
                    Trainer
                  </label>
                  <select
                    value={formData.trainerId}
                    onChange={(e) => {
                      setFormData({ ...formData, trainerId: e.target.value });
                      if (errors.trainerId) {
                        setErrors({ ...errors, trainerId: "" });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.trainerId ? "border-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select trainer...</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  {errors.trainerId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.trainerId}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.date ? "border-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.startTime ? "border-red-500" : ""
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.startTime && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.startTime}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.endTime ? "border-red-500" : ""
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.endTime && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.endTime}
                      </p>
                    )}
                  </div>
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
                      : editingSession
                      ? "Update"
                      : "Schedule"}
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

export default Sessions;
