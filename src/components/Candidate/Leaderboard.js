import React,{useState} from 'react';

const Leaderboard = ({ data }) => {

  const itemsPerPage = 10; // Adjust this value to set the number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div id="leaderboard" className="position-relative">
      <table className="table table-hover table-bordered mt-3">
        {data.map((item, index) => (
          <tr key={index}>
            <td className="number">{index + 1} </td>
            <td>
  <div style={{ display: 'flex', alignItems: 'center', background:'transparent' }}>
    <div className='photo' style={{ width: '40px', height: '40px', overflow: 'hidden', borderRadius: '50%', display: 'flex', justifyContent: 'center' }}>
      <img src={item.imageSrc} alt="gold medal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <span className="name" style={{ marginLeft: '8px' }}>{item.name}</span>
  </div>
</td>



            {/* <td className="name">{item.name} </td> */}
            <td className="points">
            <button type="button" className="btn btn-success btn-sm mt-3 p-1" style={{height:'30px',width:'30px', border: 'none',backgroundColor: '#007bff',color:'#eeee' }}>
                  <i className="fas fa-download" style={{ alignItems: 'center' }}></i>
                </button>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent' }}>
               
                <span className="points-value">{item.points}</span>
                <div className="progress" style={{ height: '20px', width: '50px' }}>
                  <div className="progress-bar" role="progressbar" style={{ width: `${item.points}%` }} aria-valuenow={item.points} aria-valuemin={0} aria-valuemax={100}></div>
                </div>
              </div>
            </td>


  

  {/* <td>
    <button type="button" className="btn btn-primary btn-sm">Download</button>
  </td> */}

            
          </tr>
        ))} 
      </table>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-end">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>

          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>

    </div>
  );
};

export default Leaderboard;
