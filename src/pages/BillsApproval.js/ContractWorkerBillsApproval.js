import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { toBeRequired } from "@testing-library/jest-dom/matchers";

const ContractWorkerBillsApproval = ({ isApproval, selectedBillId }) => {
  const [attendanceBillings, setAttendanceBillings] = useState([]);
  const [filteredBillings, setFilteredBillings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [selectedRows, setSelectedRows] = useState([]);
  const [individualBilling, setIndividualBilling] = useState([]);

  const handleSelectionChanged = (event) => {
    setSelectedRows(event.api.getSelectedRows());
  };

  const handleUpdateStatus = async (action) => {
    try {
      const response = await axios.put(
        "/facial-recognition/update_attendance_billing_status/",
        {
          selected_rows: selectedRows,
          action,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        fetchAttendanceBillings(); // Refresh the data after update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the status.");
    }
  };

  useEffect(() => {
    fetchAttendanceBillings();
  }, []);

  console.log("individualBilling:", individualBilling);
  useEffect(() => {
    if (selectedBillId) {
      fetchIndividualAttendanceBillings(selectedStatus);
    }
  }, [selectedBillId, selectedStatus]);

  const fetchIndividualAttendanceBillings = async (status) => {
    try {
      const response = await axios.get(
        `/facial-recognition/get_individual_attendance_billing/${selectedBillId}/`
      );
      const filteredData = response.data.filter(
        (billing) => billing.status === status
      );
      setIndividualBilling(filteredData);
    } catch (error) {
      toast.error("An error occurred while fetching the data.");
    }
  };

  const fetchAttendanceBillings = async () => {
    try {
      const response = await axios.get(
        "/facial-recognition/get_all_attendance_billing/"
      );
      setAttendanceBillings(response.data);
      console.log("Bills Data:", response.data);
      filterBillings(response.data, selectedStatus);
    } catch (error) {
      toast.error("An error occurred while fetching the data.");
    }
  };

  const filterBillings = (billings, status) => {
    const filtered = billings.filter((billing) => billing.status === status);
    setFilteredBillings(filtered);
  };

  const handleTabClick = (status) => {
    setSelectedStatus(status);
    filterBillings(attendanceBillings, status);
  };

  const handleApprove = () => {
    handleUpdateStatus("Approved");
  };

  const handleReject = () => {
    handleUpdateStatus("Rejected");
  };

  const columnDefs = [
    {
      headerCheckboxSelection: !isApproval,
      checkboxSelection: !isApproval,
      headerName: "Name",
      field: "user.full_name",
      filter: true,
    },
    { headerName: "Employee Id", field: "user.emp_id" },
    { headerName: "Date", field: "date", filter: true },
    {
      headerName: "Working Hours",
      field: "working_hours",
      filter: true,
      sortable: true,
    },
    {
      headerName: "Extra Hours",
      field: "extra_hours",
      filter: true,
      sortable: true,
    },
    {
      headerName: "Total Hours",
      field: "total_hours",
      cellRenderer: (params) => `${params.value}`,
      sortable: true,
    },
    {
      headerName: "Working Bill",
      field: "working_bill_amount",
      filter: true,
      sortable: true,
      cellRenderer: (params) => {
        const value = parseFloat(params.value).toFixed(2);
        return <>₹ {value}</>;
      },
    },
    {
      headerName: "Extra Bill",
      field: "extra_bill_amount",
      filter: true,
      sortable: true,
      cellRenderer: (params) => {
        const value = parseFloat(params.value).toFixed(2);
        return <>₹ {value}</>;
      },
    },
    {
      headerName: "Total Bill",
      field: "total_bill_amount",
      filter: true,
      sortable: true,
      cellRenderer: (params) => {
        const value = parseFloat(params.value).toFixed(2);
        return <>₹ {value}</>;
      },
    },
  ];
  return (
    <div className="container">
      {!isApproval && (
        <div className="row align-items-center">
          <div className="col-md-12 mt-4">
            <div className="d-flex align-items-center">
              <h2 className="mb-0">Contract Worker Bills Approval</h2>
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
                    Contract Worker Bills Approval
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      )}
      <div className="container">
        <nav className="nav nav-pills flex-column flex-sm-row mt-3">
          <button
            className={`flex-sm-fill text-center nav-link ${
              selectedStatus === "Pending" ? "active" : ""
            }`}
            onClick={() => handleTabClick("Pending")}
          >
            <h6>Pending</h6>
          </button>
          <button
            className={`flex-sm-fill text-center nav-link ${
              selectedStatus === "Approved" ? "active" : ""
            }`}
            onClick={() => handleTabClick("Approved")}
          >
            <h6>Approved</h6>
          </button>
          <button
            className={`flex-sm-fill text-center nav-link ${
              selectedStatus === "Rejected" ? "active" : ""
            }`}
            onClick={() => handleTabClick("Rejected")}
          >
            <h6>Rejected</h6>
          </button>
        </nav>
        {!isApproval && selectedStatus === "Pending" && (
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-primary me-2" onClick={handleApprove}>
              <FontAwesomeIcon icon={faCheck} /> Approve
            </button>
            <button className="btn btn-danger" onClick={handleReject}>
              <FontAwesomeIcon icon={faTimes} /> Reject
            </button>
          </div>
        )}
        <div
          className="ag-theme-quartz mt-3"
          style={{ height: "500px", width: "100%" }}
        >
          <AgGridReact
            rowData={isApproval ? individualBilling : filteredBillings}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            rowSelection="multiple"
            onSelectionChanged={handleSelectionChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractWorkerBillsApproval;
