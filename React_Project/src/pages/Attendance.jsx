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

  const handleCheckIn = () => {
    if (!selectedSession || !selectedTrainer) return;
    const existing = attendance.find(
      (a) => a.sessionId === selectedSession && a.trainerId === selectedTrainer
    );
    if (existing?.checkInTime) return;
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
    setSelectedSession("");
    setSelectedTrainer("");
  };

  const handleCheckOut = () => {
    if (!selectedSession || !selectedTrainer) return;
    const existing = attendance.find(
      (a) => a.sessionId === selectedSession && a.trainerId === selectedTrainer
    );
    if (!existing?.checkInTime || existing.checkOutTime) return;
    dispatchAttendance({
      type: ATTENDANCE_ACTIONS.CHECK_OUT,
      payload: {
        sessionId: selectedSession,
        trainerId: selectedTrainer,
        timestamp: new Date().toISOString(),
      },
    });
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

  const handleApprove = (id) =>
    dispatchAttendance({
      type: ATTENDANCE_ACTIONS.APPROVE_ATTENDANCE,
      payload: id,
    });
  const handleReject = (id) =>
    window.confirm("Reject this record?") &&
    dispatchAttendance({
      type: ATTENDANCE_ACTIONS.REJECT_ATTENDANCE,
      payload: id,
    });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Attendance</h1>

      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-3">Check-In / Check-Out</h2>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Session</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
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
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
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
