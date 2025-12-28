import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { trainerReducer } from '../reducers/trainerReducer';
import { sessionReducer } from '../reducers/sessionReducer';
import { attendanceReducer } from '../reducers/attendanceReducer';
import { TRAINER_ACTIONS, SESSION_ACTIONS, ATTENDANCE_ACTIONS } from '../reducers/actionTypes';

const AppContext = createContext();

const initialTrainers = [
  {
    id: '1',
    name: 'Kichu',
    employeeId: 'EMP001',
    email: 'kishore1052007@gmail.com',
    phone: '+91-7550004658',
    skill: 'React, Java, JavaScript, Node.js',
  },
  {
    id: '2',
    name: 'Kishore R',
    employeeId: 'EMP002',
    email: 'kishore1052007@gmail.com',
    phone: '+91-7550004658',
    skill: 'React, Java, JavaScript, Node.js',
  },
];

const generateMockSessions = () => {
  const today = new Date();
  const sessions = [];
  
  sessions.push({
    id: '1',
    name: 'React Advanced Patterns',
    date: today.toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '12:00',
    trainerId: '1',
    status: 'ongoing',
  });
  
  sessions.push({
    id: '2',
    name: 'Python Data Analysis',
    date: today.toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '17:00',
    trainerId: '2',
    status: 'upcoming',
  });
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  sessions.push({
    id: '3',
    name: 'AWS Cloud Fundamentals',
    date: tomorrow.toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '13:00',
    trainerId: '3',
    status: 'upcoming',
  });
  
  return sessions;
};

const generateMockAttendance = () => {
  const today = new Date();
  const checkInTime1 = new Date(today);
  checkInTime1.setHours(9, 5, 0); // 9:05 AM - On time
  
  const checkInTime2 = new Date(today);
  checkInTime2.setHours(9, 20, 0); // 9:20 AM - Late
  
  return [
    {
      id: '1',
      sessionId: '1',
      trainerId: '1',
      checkInTime: checkInTime1.toISOString(),
      checkOutTime: null,
      workingHours: 0,
      status: 'Present',
      approved: false,
      sessionStartTime: `${today.toISOString().split('T')[0]}T09:00:00`,
      sessionEndTime: `${today.toISOString().split('T')[0]}T12:00:00`,
    },
  ];
};

export const AppProvider = ({ children }) => {
  const [trainers, dispatchTrainers] = useReducer(trainerReducer, initialTrainers);
  const [sessions, dispatchSessions] = useReducer(sessionReducer, generateMockSessions());
  const [attendance, dispatchAttendance] = useReducer(attendanceReducer, generateMockAttendance());
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const login = (email, password) => {
    if (email === 'kichu@gmail.com' && password === 'kichuu') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const getTrainerById = (id) => trainers.find(t => t.id === id);
  const getSessionById = (id) => sessions.find(s => s.id === id);
  
  const getTodaySessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter(s => s.date === today);
  };
  
  const getUpcomingSessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter(s => s.date >= today).sort((a, b) => 
      new Date(a.date + ' ' + a.startTime) - new Date(b.date + ' ' + b.startTime)
    );
  };
  
  const getAttendanceByTrainer = (trainerId) => {
    return attendance.filter(a => a.trainerId === trainerId);
  };
  
  const getAttendanceBySession = (sessionId) => {
    return attendance.filter(a => a.sessionId === sessionId);
  };

  const checkSessionConflict = (trainerId, date, startTime, endTime, excludeSessionId = null) => {
    const newStart = new Date(`${date}T${startTime}`);
    const newEnd = new Date(`${date}T${endTime}`);
    
    return sessions.some(session => {
      if (session.id === excludeSessionId) return false;
      if (session.trainerId !== trainerId) return false;
      if (session.date !== date) return false;
      
      const existingStart = new Date(`${session.date}T${session.startTime}`);
      const existingEnd = new Date(`${session.date}T${session.endTime}`);
      
      return (newStart < existingEnd && newEnd > existingStart);
    });
  };

  const value = {
    trainers,
    sessions,
    attendance,
    isAuthenticated,
    dispatchTrainers,
    dispatchSessions,
    dispatchAttendance,
    login,
    logout,
    getTrainerById,
    getSessionById,
    getTodaySessions,
    getUpcomingSessions,
    getAttendanceByTrainer,
    getAttendanceBySession,
    checkSessionConflict,
    TRAINER_ACTIONS,
    SESSION_ACTIONS,
    ATTENDANCE_ACTIONS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
