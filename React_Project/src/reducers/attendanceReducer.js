import { ATTENDANCE_ACTIONS } from './actionTypes';

const calculateWorkingHours = (checkInTime, checkOutTime) => {
  if (!checkInTime || !checkOutTime) return 0;
  const diff = new Date(checkOutTime) - new Date(checkInTime);
  return (diff / (1000 * 60 * 60)).toFixed(2);
};

const calculateStatus = (checkInTime, sessionStartTime) => {
  if (!checkInTime) return 'Missed';
  
  const checkIn = new Date(checkInTime);
  const sessionStart = new Date(sessionStartTime);
  
  const diff = checkIn - sessionStart;
  const minutesLate = diff / (1000 * 60);
  
  if (minutesLate > 15) return 'Late';
  return 'Present';
};

export const attendanceReducer = (state, action) => {
  switch (action.type) {
    case ATTENDANCE_ACTIONS.CHECK_IN: {
      const { sessionId, trainerId, timestamp } = action.payload;
      const existing = state.find(
        a => a.sessionId === sessionId && a.trainerId === trainerId
      );
      
      if (existing) {
        return state.map(record =>
          record.sessionId === sessionId && record.trainerId === trainerId
            ? {
                ...record,
                checkInTime: timestamp,
                status: calculateStatus(timestamp, record.sessionStartTime),
              }
            : record
        );
      }
      
      return [
        ...state,
        {
          id: Date.now().toString(),
          sessionId,
          trainerId,
          checkInTime: timestamp,
          checkOutTime: null,
          workingHours: 0,
          status: calculateStatus(timestamp, action.payload.sessionStartTime),
          approved: false,
          sessionStartTime: action.payload.sessionStartTime,
          sessionEndTime: action.payload.sessionEndTime,
        },
      ];
    }
    
    case ATTENDANCE_ACTIONS.CHECK_OUT: {
      const { sessionId, trainerId, timestamp } = action.payload;
      return state.map(record =>
        record.sessionId === sessionId && record.trainerId === trainerId
          ? {
              ...record,
              checkOutTime: timestamp,
              workingHours: calculateWorkingHours(record.checkInTime, timestamp),
            }
          : record
      );
    }
    
    case ATTENDANCE_ACTIONS.APPROVE_ATTENDANCE:
      return state.map(record =>
        record.id === action.payload
          ? { ...record, approved: true }
          : record
      );
    
    case ATTENDANCE_ACTIONS.REJECT_ATTENDANCE:
      return state.map(record =>
        record.id === action.payload
          ? { ...record, approved: false, status: 'Rejected' }
          : record
      );
    
    case ATTENDANCE_ACTIONS.SET_ATTENDANCE:
      return action.payload;
    
    default:
      return state;
  }
};
