import React from 'react';
import './ResumeUploader.css';

const ResumeUploader = ({ onUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="resume-uploader">
      <input type="file" id="resume" onChange={handleFileChange} accept=".pdf" />
      <label htmlFor="resume">Upload Resume</label>
    </div>
  );
};

export default ResumeUploader;
