import React, { useState, useEffect } from 'react';

const JobsForm = ({ selectedRows }) => {
    // const [isActive, setIsActive] = useState(true);
    // const [selectedDepartment, setSelectedDepartment] = useState(null);

    // useEffect(() => {
    //     if (selectedRows?.length > 0) {
    //         // Update the selected department with the department name of the first selected row
    //         setSelectedDepartment(`${selectedRows[0].department_name} - ${selectedRows[0].company}`);
    //     } else {
    //         // Reset selected department if no row is selected
    //         setSelectedDepartment(null);
    //     }
    // }, [selectedRows]);

    return (
        <form>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="job_name" className="form-label">Job Name:</label>
                        <input type="text" className="form-control" id="job_name" name="job_name" />
                    </div>

                   

                    

                    
                </div>

               

                <div className="col-md-6">

                    <div className="mb-3">
                        <label htmlFor="job_group" className="form-label">Job Group:</label>
                        <select className="form-select" id="job_group" name="job_group">
                            <option value="">Select Job Group</option>
                            <option value="job_group1">Job Group 1</option>
                            <option value="job_group2">Job Group 2</option>
                            <option value="job_group3">Job Group 3</option>
                            
                        </select>
                    </div>
              
                </div>

                <div className="mb-3">
                    <label htmlFor="department" className="form-label">Department:</label>
                    <select className="form-select" id="department" name="department">
                        <option value="" >Select Department</option>
                        <option value="department1">Department 1</option>
                        <option value="department2">Department 2</option>
                        <option value="department3">Department 3</option>
                        {/* Add more options as needed */}
                    </select>
                </div>


                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Job Description:</label>
                    <textarea  className="form-control" id="description" rows="10" name="description" />
                </div>

                <div cclassNamelass="mb-3">
                        <label for="formFileMultiple" class="form-label">Select File </label>
                        <input className="form-control" type="file" id="formFileMultiple" multiple />
                    </div>
            </div>
        </form>
    );
};

export default JobsForm;
