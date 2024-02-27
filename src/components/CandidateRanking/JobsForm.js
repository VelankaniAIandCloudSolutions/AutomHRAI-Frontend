import React, { useState, useEffect } from 'react';

const JobsForm = ({ selectedRows, rowData, mode, onFormSubmit, onChangeData }) => {
    const [selectedJobGroup, setSelectedJobGroup] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        job_description: '',
        job_group: '',
        department: '',
        attachment: null, 
    });

    useEffect(() => {
        if (rowData) {
            setFormData({
                ...rowData,
                job_group: rowData.job_group,
                department: rowData.department,
                attachment: rowData.attachment, 
            });
            setSelectedJobGroup(rowData.job_group);
            setSelectedDepartment(rowData.department);
        } else {
            setFormData({
                name: '',
                job_group: '',
                department: '',
                job_description: '',
                attachment: null,
            });
            setSelectedJobGroup('');
            setSelectedDepartment('');
        }
    }, [rowData]);

    useEffect(() => {
        if (mode === 'create') {
            if (selectedRows && selectedRows.length > 0) {
                setSelectedJobGroup(selectedRows[0].name);
                setSelectedDepartment(selectedRows[0].department_name);
            } else {
                setFormData({
                    name: '',
                    job_group: '',
                    department: '',
                    job_description: '',
                    attachment: null,
                });
                setSelectedJobGroup('');
                setSelectedDepartment('');
            }
        } else {
            if (selectedRows && selectedRows.length > 0) {
                setSelectedJobGroup(selectedRows[0].job_group);
                setSelectedDepartment(selectedRows[0].department);
            } else {
                setFormData({
                    name: '',
                    job_group: '',
                    department: '',
                    job_description: '',
                    attachment: null,
                });
                setSelectedJobGroup('');
                setSelectedDepartment('');
            }
        }
    }, [mode, selectedRows]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('formData', formData);
        onFormSubmit(formData);
        window.location.reload();
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
           const file = e.target.files[0];
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: file,
                job_group: selectedJobGroup,
                department: selectedDepartment,
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
                job_group: selectedJobGroup,
                department: selectedDepartment,
            }));
        }

        if (mode !== 'create') {
            onChangeData(formData);
        }

        console.log(formData);
    };


    
    

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="job_name" className="form-label">Job Name:</label>
                        <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
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
                    <textarea className="form-control" id="job_description" rows="10" name="job_description" value={formData.job_description} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="formFileMultiple" className="form-label">Select File:</label>
                    <input className="form-control" type="file" id="formFileMultiple" name="attachment"  onChange={handleChange} multiple />
                </div>
            </div>
            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
        </form>
    );
};

export default JobsForm;
