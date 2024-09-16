import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadImagePage.css';

const UploadImagePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);  // To store all uploaded files

  useEffect(() => {
    // Fetch and display all uploaded files when the page loads
    const fetchUploadedFiles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/upload/list-objects`);
        setUploadedFiles(response.data);
      } catch (err) {
        console.error('Error fetching uploaded files:', err);
      }
    };

    fetchUploadedFiles();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadedFileUrl('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Get the pre-signed URL from the backend
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/upload/presigned-url`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        },
      });

      const { presignedUrl, publicUrl } = response.data;

      // Upload the file to S3 using the presigned URL
      await axios.put(presignedUrl, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type,
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          setUploadProgress(Math.round((progressEvent.loaded / total) * 100));
        },
      });

      setUploadedFileUrl(publicUrl);
      setMessage('File uploaded successfully!');
      
      // Fetch the presigned download URL
      const downloadResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/upload/download-url/${selectedFile.name}`);
      setDownloadUrl(downloadResponse.data.presignedUrl);

      // Re-fetch all uploaded files after a new upload
      const updatedFiles = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/upload/list-objects`);
      setUploadedFiles(updatedFiles.data);

    } catch (err) {
      console.error('Error uploading file:', err);
      setMessage('Failed to upload file.');
    }
  };

  return (
    <div className="upload-page">
      <h1>Upload an Image or Video</h1>
      <input 
        type="file" 
        accept="image/jpeg,image/png,image/webp,video/mp4" // Allow images and videos
        onChange={handleFileChange} 
      />
      <button onClick={handleUpload} className="upload-button">Upload</button>
      {uploadProgress > 0 && <p className="upload-progress">Upload Progress: {uploadProgress}%</p>}
      {message && <p className="message">{message}</p>}

      {uploadedFileUrl && (
        <div className="uploaded-file-section">
          <h2>Uploaded File</h2>
          {selectedFile.type.startsWith('image/') ? (
            <img src={uploadedFileUrl} alt="Uploaded" className="uploaded-file" />
          ) : (
            <video controls className="uploaded-file">
              <source src={uploadedFileUrl} type={selectedFile.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      {downloadUrl && (
        <div className="download-section">
          <h2>Download File</h2>
          <a href={downloadUrl} download className="download-link">Click here to download</a>
        </div>
      )}

      {/* Display all uploaded files */}
      <div className="uploaded-files-gallery">
        <h2>All Uploaded Files</h2>
        <div className="files-list">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="file-item">
              {file.key.endsWith('.mp4') || file.key.endsWith('.webm') ? (
                <video controls className="file-media">
                  <source src={file.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={file.url} alt={file.key} className="file-media" />
              )}
              <p>{file.key}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadImagePage;