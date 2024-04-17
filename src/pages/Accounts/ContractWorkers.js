import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AgGridUserList from "../../components/FaceRecognition/AgGridUserList";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";
import AgGridContractWorkerList from "../../components/FaceRecognition/AgGridContractWorkerList";

function ContractWorkers() {
  const [rowData, setRowData] = useState([]);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);
  const fetchAllContractWorkers = async () => {
    dispatch(showLoading());
    await axios
      .get("/accounts/contract-workers/")
      .then((response) => {
        const modifiedData = response.data.contract_workers.map((user) => ({
          ...user,
          employeeName: `${user.first_name || ""} ${user.last_name || ""}`,
        }));
        setRowData(modifiedData);
        console.log("api data", response.data);
        dispatch(hideLoading());
      })
      .catch((error) => console.error("Error fetching data:", error));
    dispatch(hideLoading());
  };

  useEffect(() => {
    fetchAllContractWorkers();
  }, []);

  const handleDeleteContractWorker = async (contractWorkerId) => {
    try {
      const response = await axios.delete(
        `/accounts/contract-workers/delete/${contractWorkerId}/`
      );
      console.log("ContractWorker deleted successfully:", response.data);
      // toast.success("Contract Worker deleted successfully", {
      //   icon: <i className="fas fa-check" style={{ color: "white" }}></i>,
      //   style: { backgroundColor: "green" },
      // });
      toast.success("Contract Worker deleted successfully");
      fetchAllContractWorkers();
    } catch (error) {
      console.error("Error deleting Contract Worker:", error);
      toast.error("Error deleting Contract Worker", {
        icon: <i className="fas fa-times" style={{ color: "white" }}></i>,
        style: { backgroundColor: "red" },
      });
    }
  };

  return (
    <div className="container">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="row align-items-center">
            <div className="col-md-9 mt-4">
              <div className="d-flex align-items-center">
                <h2 className="mb-0">Contract Workers</h2>
                <span className="ms-3 fs-4 text-muted">|</span>
                <nav aria-label="breadcrumb" className="d-inline-block ms-3">
                  <ol className="breadcrumb bg-transparent m-0 p-0">
                    <li className="breadcrumb-item">
                      <a href="/">
                        <i className="fas fa-home"></i> Home
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <i className="fas fa-users"> </i> Contract-Workers
                    </li>
                  </ol>
                </nav>
              </div>
            </div>

            <div className="col-md-3 d-flex justify-content-end mt-4">
              <a
                className="btn btn-primary"
                href="/contract-workers/create-contract-worker/"
                role="button"
              >
                <i className="fas fa-plus"> </i> Add New Worker
              </a>
            </div>

            <div className="container" style={{ marginTop: "25px" }}>
              <AgGridContractWorkerList
                rowData={rowData}
                onDeleteContractWorker={handleDeleteContractWorker}
              />
            </div>
          </div>

          <div
            className="modal fade"
            id="deletemodal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Delete User
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ContractWorkers;
