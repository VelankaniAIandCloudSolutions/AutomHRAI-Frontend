import axios from "axios";
import React, { useState, useEffect } from "react";
import AgEmployeeAttendance from "../../components/FaceRecognition/AgEmployeeAttendance";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";

function EmployeeAttendance() {
  const loggedUser = JSON.parse(localStorage.getItem("userAccount"));
  const id = loggedUser.user_account.id;

  console.log(id);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);
  const [originalRowData, setOriginalRowData] = useState([]);
  const [rowData, setRowData] = useState(originalRowData);

  useEffect(() => {
    setRowData(originalRowData);
  }, [originalRowData]);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    return (
      <option key={month} value={month}>
        {new Date(2000, month - 1).toLocaleString("en", { month: "long" })}
      </option>
    );
  });

  // const currentYear = new Date().getFullYear();
  // const startYear = currentYear - 5;
  // const yearOptions = Array.from({ length: 6 }, (_, index) => {
  //   const year = startYear + index;
  //   return <option key={year} value={year}>{year}</option>;
  // });

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };
  const handleSearch = () => {
    // Filter the data based on selectedMonth and selectedYear
    const filteredData = originalRowData.filter((item) => {
      const itemDate = new Date(item.date);
      const itemMonth = itemDate.getMonth() + 1; // Months are 0-indexed
      const itemYear = itemDate.getFullYear();

      return (
        (selectedMonth === "" || itemMonth.toString() === selectedMonth) &&
        (selectedYear === "" || itemYear.toString() === selectedYear)
      );
    });

    setRowData(filteredData);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const formatTimeWithAMPM = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const fetchTimeSheet = async () => {
    try {
      const response = await axios.get(
        `facial-recognition/get_timesheet_data/${id}`
      );
      console.log("The timesheet data:", response.data);

      // Convert timestamps to local time and format check-in/check-out times
      const formattedData = response.data.map((entry) => ({
        ...entry,
        check_in: entry.check_ins ? formatTime12Hours(entry.check_ins) : null,
        check_out: entry.check_outs
          ? formatTime12Hours(entry.check_outs)
          : null,
        break_in: entry.break_ins ? formatTime12Hours(entry.break_ins) : null,
        break_out: entry.break_outs
          ? formatTime12Hours(entry.break_outs)
          : null,
        net_working_time: formatTime(entry.net_working_time),
        total_working_time: formatTime(entry.total_working_time),
        total_break_time: formatTime(entry.total_break_time),
        created_at: new Date(entry.created_at),
      }));

      setOriginalRowData(formattedData);
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
    }
  };

  // Function to format time in 12-hour format with AM or PM
  const formatTime12Hours = (timesArray) => {
    return timesArray
      .map((time) => {
        const timeParts = time.split(" ")[1].split(":");
        let hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
      })
      .join(", ");
  };

  const currentYear = new Date().getFullYear();

  const minYear = Math.min(
    ...originalRowData.map((entry) => {
      const createdAtDate = new Date(entry.created_at);
      return createdAtDate.getFullYear();
    })
  );
  console.log("Minimum Year:", minYear);

  const yearOptions = Array.from(
    { length: currentYear - minYear + 1 },
    (_, index) => {
      const year = minYear + index;
      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
  );

  useEffect(() => {
    fetchTimeSheet();
  }, []);

  return (
    <div className="container">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="row align-items-center">
            <div className="col-md-9 mt-4">
              <div className="d-flex align-items-center">
                <h2 className="mb-0">Employee Attendance</h2>
                <span className="ms-3 fs-4 text-muted">|</span>
                <nav aria-label="breadcrumb" className="d-inline-block ms-3">
                  <ol className="breadcrumb bg-transparent m-0 p-0">
                    <li className="breadcrumb-item">
                      <a href="/">
                        <i className="fas fa-home me-1"></i>Home
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <i className="fas fa-list"> </i> Employee Attendance
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          {/* <div className="col-md-5 d-flex justify-content-end mt-4"> */}
          <div className="row mt-4">
            <div className="col-md-4">
              <select
                className="form-select"
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                <option value="">Select Month</option>
                {monthOptions}
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select ms-2"
                value={selectedYear}
                onChange={handleYearChange}
              >
                <option value="">Select Year</option>
                {yearOptions}
              </select>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-primary ms-2"
                style={{ width: "70%" }}
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          {/* </div> */}

          <div className="container" style={{ marginTop: "25px" }}>
            {/* The AG Grid component */}
            {/* <AgGridReact rowData={rowData} columnDefs={colDefs} /> */}
            <AgEmployeeAttendance rowData={rowData} />
          </div>
        </>
      )}
    </div>
  );
}

export default EmployeeAttendance;
