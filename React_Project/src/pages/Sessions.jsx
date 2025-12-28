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

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      startTime: "",
      endTime: "",
      trainerId: "",
    });
    setEditingSession(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.startTime >= formData.endTime) return;

    const hasConflict = checkSessionConflict(
      formData.trainerId,
      formData.date,
      formData.startTime,
      formData.endTime,
      editingSession?.id
    );
    if (hasConflict) return;

    if (editingSession) {
      dispatchSessions({
        type: SESSION_ACTIONS.UPDATE_SESSION,
        payload: {
          ...formData,
          id: editingSession.id,
          status: editingSession.status,
        },
      });
    } else {
      const sessionDateTime = new Date(
        `${formData.date}T${formData.startTime}`
      );
      const status = sessionDateTime > new Date() ? "upcoming" : "completed";
      dispatchSessions({
        type: SESSION_ACTIONS.ADD_SESSION,
        payload: { ...formData, status },
      });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this session?")) {
      dispatchSessions({ type: SESSION_ACTIONS.DELETE_SESSION, payload: id });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-4">
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
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Trainer
                  </label>
                  <select
                    value={formData.trainerId}
                    onChange={(e) =>
                      setFormData({ ...formData, trainerId: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Select trainer...</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
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
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
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
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
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
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingSession ? "Update" : "Schedule"}
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
