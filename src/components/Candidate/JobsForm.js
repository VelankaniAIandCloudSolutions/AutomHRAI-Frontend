import React, { useState, useEffect } from 'react';

const JobsForm = ({ selectedRows, rowData, mode }) => {
    const [selectedJobGroup, setSelectedJobGroup] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [formData, setFormData] = useState({
        job_name: '',
        description: '',
        job_group: '',
        department: ''
    });

    useEffect(() => {
        // Update formData when rowData changes
        if (rowData) {
            setFormData(rowData);
            setSelectedJobGroup(rowData.job_group);
            setSelectedDepartment(rowData.department);
        } else {
            // Reset formData if rowData is null or undefined
            setFormData({ job_name: '', job_group: '', department: '', description: '' });
            setSelectedJobGroup('');
            setSelectedDepartment('');
        }
    }, [rowData]);

    useEffect(() => {
        // Update selected job group when selectedRows change
        if (selectedRows && selectedRows.length > 0) {
            setSelectedJobGroup(selectedRows[0].job_group);
            setSelectedDepartment(selectedRows[0].department);
        } else {
            setSelectedJobGroup('');
            setSelectedDepartment('');
        }
    }, [selectedRows]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="job_name" className="form-label">Job Name:</label>
                        <input type="text" className="form-control" id="job_name" name="job_name" value={formData.job_name} onChange={handleChange} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Selected Job Group and Department:</label>
                        <ul style={{ listStyleType: 'circle' }}>
                            <li><strong>Job Group:</strong> {selectedJobGroup}</li>
                            <li><strong>Department:</strong> {selectedDepartment}</li>
                        </ul>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Job Group:</label><br></br>
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={mode === 'create' ? "#jobdepartmentmodal" : "#updatejobdepartmentmodal"}>
                            Select Job Group
                        </button>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Job Description:</label>
                    <textarea className="form-control" id="description" rows="10" name="description" value={formData.description} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="formFileMultiple" className="form-label">Select File:</label>
                    <input className="form-control" type="file" id="formFileMultiple" multiple />
                </div>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default JobsForm;
