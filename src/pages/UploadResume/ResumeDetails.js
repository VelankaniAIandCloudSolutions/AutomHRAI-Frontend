import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ResumeGrid from '../../components/UploadResume/ResumeGrid';
import ShowParseResumes from '../../components/UploadResume/ShowParseResumes';

const GridComponent = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showParseResumesData, setShowParseResumesData] = useState([]);
  const [editedData, setEditedData] = useState([]);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleUpload = async () => {
    if (Array.isArray(selectedFiles) && selectedFiles.length > 0) {

      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append('resumes', file);
      });

      try {
        const response = await axios.post('http://localhost:8000/api/v1/resume-parser/file_upload_view/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const parsedData = response.data.resumes.map((resume) => resume.parsed_data);
        setShowParseResumesData(parsedData);
      } catch (error) {
        console.error('Error during upload:', error);
      }
    } else {
      console.warn('No files selected for upload.');
    }
  };

  const handleUpdateData = async (updatedResumes) => {
    console.log(updatedResumes)
    setEditedData(updatedResumes);
  };

  const saveUpdatedResumes = async (updatedResumes) => {
    try {
      console.log('Type of updatedResumes:', typeof updatedResumes);
      console.log('Content of updatedResumes:', updatedResumes);
      if (Array.isArray(updatedResumes)) {
        const cleanData = updatedResumes.map(({ id, name, email, mobile_number, education, skills, college_name, company_name, experience, total_experience }) => ({
          id,
          name,
          email,
          mobile_number,
          education,
          skills,
          college_name,
          company_name,
          experience,
          total_experience,
        }));
        const payload = {
          updated_resumes: cleanData,
        };

        console.log('Edited Data:', payload);

        const response = await axios.put('http://localhost:8000/api/v1/resume-parser/update_multiple_resumes/', payload);

        console.log('Resumes updated successfully:', response.data);

        fetchResumes();

        setEditedData([]);
        window.location.reload();
      } else {
        console.error('Updated Resumes is not an array:', updatedResumes);
      }
    } catch (error) {
      console.error('Error updating resumes:', error);
    }
  };
  const handleSaveChanges = () => {
    saveUpdatedResumes(editedData);
  };

  const handleDelete = (resumeId) => {
    axios.delete(`http://localhost:8000/api/v1/resume-parser/delete_resume/${resumeId}/`)
      .then(() => {
        console.log(`Resume with ID ${resumeId} deleted successfully`);
        fetchResumes();
      })
      .catch((error) => {
        console.error('Error deleting resume:', error);
      });
  };

  const fetchResumes = () => {
    axios.get('http://localhost:8000/api/v1/resume-parser/get_resumes/')
      .then((response) => {
        setRowData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching resumes:', error);
      });
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const DeleteButtonRenderer = (props) => {
    return <button className='btn btn-outline-danger mb-1' onClick={() => handleDelete(props.data.id)}>Delete</button>;
  };

  const columns = [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Mobile No', field: 'mobile_number' },
    { headerName: 'Qualification', field: 'education' },
    { headerName: 'Skills', field: 'skills' },
    { headerName: 'College Name', field: 'college_name' },
    { headerName: 'Company Name', field: 'company_name' },
    { headerName: 'Experience', field: 'experience' },
    { headerName: 'Total Experience', field: 'total_experience' },
    {
      headerName: 'Actions',
      cellRenderer: DeleteButtonRenderer,
    },
  ];


  return (
    <div className='container'>
      <div className="col-md-6 mt-4">
  <div className="d-flex align-items-center">
    <h2 className="mb-0">Resume List</h2>
    <span className="ms-3 fs-4 text-muted">|</span>
    <nav aria-label="breadcrumb" className="d-inline-block ms-3">
      <ol className="breadcrumb bg-transparent m-0 p-0">
        <li className="breadcrumb-item">
          <a href="/">
            <i className="fas fa-home me-1"></i>Home
          </a>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          <i className="fas fa-list-alt me-1"></i>
          Resume List
        </li>
      </ol>
    </nav>
  </div>
</div>


      <div className="modal fade" id="parseResumeModal" tabindex="-1" aria-labelledby="parseResumeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="parseResumeModalLabel">Resume Data:</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div>
                  <ShowParseResumes rowData={showParseResumesData} onEdit={handleUpdateData}  />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSaveChanges} data-bs-dismiss="modal">Save changes</button>
            </div>
          </div>
        </div>
      </div>
        <div className='container-wrapper ml-2 mr-2'>
          <div className="d-flex justify-content-between align-items-center">
            <div></div>
            <button className="btn btn-outline-success mt-3" data-bs-toggle="modal" data-bs-target="#uploadResumeModal">
              Upload Resume
            </button>
          </div>

          <ResumeGrid rowData={rowData} columns={columns} />

          <div className="modal fade" id="uploadResumeModal" tabIndex="-1" role="dialog" aria-labelledby="uploadResumeModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="uploadResumeModalLabel">Upload Files</h5>
                  <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body d-flex justify-content-center align-items-center flex-column">
                  <button className="btn btn-outline-primary mt-2" onClick={handleButtonClick}>
                    Click here
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    multiple
                    onChange={handleFileChange}
                  />
                  <div>
                    {selectedFiles.length > 0 && (
                      <div>
                        <strong>Selected Files:</strong>
                        {selectedFiles.map((file, index) => (
                          <div key={index}>{file.name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline-secondary" data-bs-dismiss="modal" >
                    Close
                  </button>
                  <button className="btn btn-outline-success"  onClick={handleUpload}  data-bs-toggle="modal" data-bs-target="#parseResumeModal" >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default GridComponent;
