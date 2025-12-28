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

  const resetForm = () => {
    setFormData({ name: "", employeeId: "", email: "", phone: "", skill: "" });
    setEditingTrainer(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTrainer) {
      dispatchTrainers({
        type: TRAINER_ACTIONS.UPDATE_TRAINER,
        payload: { ...formData, id: editingTrainer.id },
      });
    } else {
      dispatchTrainers({
        type: TRAINER_ACTIONS.ADD_TRAINER,
        payload: formData,
      });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this trainer?")) {
      dispatchTrainers({ type: TRAINER_ACTIONS.DELETE_TRAINER, payload: id });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getTrainerSessions = (id) =>
    sessions.filter((s) => s.trainerId === id).length;
  const filteredTrainers = trainers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
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
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
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
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
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
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
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
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
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
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., React & JavaScript"
                    required
                  />
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
                    {editingTrainer ? "Update" : "Add"}
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
