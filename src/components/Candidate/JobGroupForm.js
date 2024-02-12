import React, { useState, useEffect } from 'react';

const JobGroupsForm = ({ selectedRows }) => {
    const [isActive, setIsActive] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    useEffect(() => {
        if (selectedRows?.length > 0) {
            // Update the selected department with the department name of the first selected row
            setSelectedDepartment(`${selectedRows[0].department_name} - ${selectedRows[0].company}`);
        } else {
            // Reset selected department if no row is selected
            setSelectedDepartment(null);
        }
    }, [selectedRows]);

    return (
        <form>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="job_group" className="form-label">Job Group:</label>
                        <input type="text" className="form-control" id="job_group" name="job_group" />
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
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#departmentmodal">
                        Select Department
                    </button>
                </div>
            </div>
            </div>
        </form>
    );
};

export default JobGroupsForm;
