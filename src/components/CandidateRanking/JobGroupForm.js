import React, { useState, useEffect } from 'react';

const JobGroupsForm = ({ selectedRows, mode, onJobGroupChange }) => {
    console.log(selectedRows);
    const [isActive, setIsActive] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        department: '',
        department_id: '',
    });

    const handleJobGroupInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        if (mode !== 'create') {
            onJobGroupChange(formData);
        }
        console.log(formData)
    };

    useEffect(() => {
        if (selectedRows?.length > 0) {
            const departmentLabel = selectedRows[0].department_name || `${selectedRows[0].name} - ${selectedRows[0].company}`;
            setSelectedDepartment(departmentLabel);

            // Update formData with selected row values
            setFormData({
                id: selectedRows[0].id,
                name: selectedRows[0].name,
                department: departmentLabel,
                department_id: selectedRows[0].department_id,
            });
        } else {
            setSelectedDepartment(null);
            setFormData({
                id: '',
                name: '',
                department: '',
                department_id: '',
            });
        }
    }, [mode, selectedRows]);

    return (
        <form>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="job_group" className="form-label">Job Group:</label>
                        <input type="text" className="form-control" id="job_group" name="name" value={formData.name} onChange={handleJobGroupInputChange} />
                    </div>

                    <div className="mb-3 d-flex align-items-center">
                        <label htmlFor="education" className="form-label me-2">Is Active: </label>
                        <div className="form-check form-switch" style={{ marginLeft: '10%' }}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                checked={isActive}
                                onChange={() => setIsActive(!isActive)}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Selected Department:</label>
                        <ul style={{ listStyleType: 'circle' }}>
                            {selectedDepartment ? <li>{selectedDepartment}</li> : <li>None</li>}
                        </ul>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Department:</label>
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={mode === 'create' ? "#departmentmodal" : "#updatejogroupmodal"}>
                            Select Department
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default JobGroupsForm;
