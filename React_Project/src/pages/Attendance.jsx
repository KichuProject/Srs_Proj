import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const Attendance = () => {
  const {
    sessions,
    trainers,
    attendance,
    dispatchAttendance,
    ATTENDANCE_ACTIONS,
    getTrainerById,
    getSessionById,
  } = useApp();
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCheckIn = () => {
    setErrors({});

    if (!selectedSession) {
      setErrors({ session: "Please select a session" });
      showNotification("Please select a session", "error");
      return;
    }

    if (!selectedTrainer) {
      setErrors({ trainer: "Please select a trainer" });
      showNotification("Please select a trainer", "error");
      return;
    }

    const existing = attendance.find(
      (a) => a.sessionId === selectedSession && a.trainerId === selectedTrainer
    );

    if (existing?.checkInTime) {
      showNotification("Already checked in for this session", "error");
      return;
    }

    const session = getSessionById(selectedSession);
    dispatchAttendance({
      type: ATTENDANCE_ACTIONS.CHECK_IN,
      payload: {
        sessionId: selectedSession,
        trainerId: selectedTrainer,
        timestamp: new Date().toISOString(),
        sessionStartTime: `${session.date}T${session.startTime}:00`,
        sessionEndTime: `${session.date}T${session.endTime}:00`,
      },
    });
    showNotification("Checked in successfully!");
    setSelectedSession("");
    setSelectedTrainer("");
  };

  const handleCheckOut = () => {
    setErrors({});

    if (!selectedSession) {
      setErrors({ session: "Please select a session" });
      showNotification("Please select a session", "error");
      return;
    }

    if (!selectedTrainer) {
      setErrors({ trainer: "Please select a trainer" });
      showNotification("Please select a trainer", "error");
      return;
    }

    const existing = attendance.find(
      (a) => a.sessionId === selectedSession && a.trainerId === selectedTrainer
    );

    if (!existing?.checkInTime) {
      showNotification("Must check in before checking out", "error");
      return;
    }

    if (existing.checkOutTime) {
      showNotification("Already checked out for this session", "error");
      return;
    }

    dispatchAttendance({
      type: ATTENDANCE_ACTIONS.CHECK_OUT,
      payload: {
        sessionId: selectedSession,
        trainerId: selectedTrainer,
        timestamp: new Date().toISOString(),
      },
    });
    showNotification("Checked out successfully!");
    setSelectedSession("");
    setSelectedTrainer("");
  };

  const getStatusBadge = (status) => {
    const variants = {
      Present: "badge-success",
      Late: "badge-warning",
      Missed: "badge-danger",
      Rejected: "badge-danger",
    };
    return (
      <span className={`badge ${variants[status] || "badge-default"}`}>
        {status}
      </span>
    );
  };

  const handleApprove = (id) => {
    dispatchAttendance({
      type: ATTENDANCE_ACTIONS.APPROVE_ATTENDANCE,
      payload: id,
    });
    showNotification("Attendance approved!");
  };

  const handleReject = (id) => {
    if (window.confirm("Reject this record?")) {
      dispatchAttendance({
        type: ATTENDANCE_ACTIONS.REJECT_ATTENDANCE,
        payload: id,
      });
      showNotification("Attendance rejected!");
    }
  };

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

      <h1 className="text-3xl font-bold">Attendance</h1>

      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-3">Check-In / Check-Out</h2>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Session</label>
            <select
              value={selectedSession}
              onChange={(e) => {
                setSelectedSession(e.target.value);
                if (errors.session) setErrors({ ...errors, session: "" });
              }}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.session ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Session</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - {s.date}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trainer</label>
            <select
              value={selectedTrainer}
              onChange={(e) => {
                setSelectedTrainer(e.target.value);
                if (errors.trainer) setErrors({ ...errors, trainer: "" });
              }}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.trainer ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Trainer</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCheckIn} className="btn btn-success flex-1">
            Check In
          </button>
          <button onClick={handleCheckOut} className="btn btn-danger flex-1">
            Check Out
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="text-lg font-bold mb-3">Attendance History</h2>
        {attendance.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No records</p>
        ) : (
          <div className="space-y-2">
            {attendance.map((record) => {
              const trainer = getTrainerById(record.trainerId);
              const session = getSessionById(record.sessionId);
              return (
                <div key={record.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">
                        {trainer?.name} - {session?.name}
                      </p>
                      <p className="text-sm text-gray-600">{session?.date}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(record.status)}
                      <div className="flex gap-1">
                        {!record.approved && record.status !== "Rejected" && (
                          <>
                            <button
                              onClick={() => handleApprove(record.id)}
                              className="btn btn-success btn-sm text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(record.id)}
                              className="btn btn-danger btn-sm text-xs"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {record.approved && (
                          <span className="badge badge-success text-xs">
                            Approved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    In:{" "}
                    {record.checkInTime
                      ? new Date(record.checkInTime).toLocaleTimeString()
                      : "-"}{" "}
                    | Out:{" "}
                    {record.checkOutTime
                      ? new Date(record.checkOutTime).toLocaleTimeString()
                      : "-"}{" "}
                    | {record.workingHours || 0}h
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
