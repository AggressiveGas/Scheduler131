// MeetingPopup.js
import React from 'react';
import PropTypes from 'prop-types';
import './MeetingPopup.css';

const convertTimeSlotToTime = (timeSlot) => {
  const totalMinutes = timeSlot * 10;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // AM PM STUFFS
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes} ${period}`;
};

const MeetingPopup = ({ meeting, onClose }) => {
  return (
    <div className="meeting-popup">
      <div className="popup-content">
        <p className="text-sm pb-2">📅 {meeting.day}</p>
        <p className="justify-start text-sm pb-2">⏰: {convertTimeSlotToTime(meeting.start)}</p>
        <p className="text-sm">⏰: {convertTimeSlotToTime(meeting.end)}</p>
        <button className="close-button text-sm" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

MeetingPopup.propTypes = {
  meeting: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MeetingPopup;
