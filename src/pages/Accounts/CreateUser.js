import React,{useState} from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useDispatch,useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";

function CreateUser() {
  const dispatch=useDispatch();
  const loading=useSelector(state=>state.loading.loading)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    emp_id: '',
    phone_number: '',
    user_image:'',
    is_active:'',
    is_superuser:'',
    is_staff:'',
  });
  const history = useHistory();

  const handleChange = (e) => {
    const { id, value, type } = e.target;
  
    // If the input is a file input, get the file object
    const file = type === 'file' ? e.target.files[0] : null;
    console.log(file)
    setFormData((prevData) => ({
      ...prevData,
      [id]: file || value,
    }));
  };  
  
  const handleCreateUser = () => {
    const formDataToSend=new FormData();
    Object.entries(formData).forEach(([key,value])=>{
      formDataToSend.append(key,value);
    });
    dispatch(showLoading());
    axios.post('/accounts/users/create/', formDataToSend,{
      headers:{
        'Content-Type':'multipart/form-data',
      },
    })
      .then((response) => {
        // Handle successful response
        console.log('User created successfully:', response.data);
        toast.success('User created successfully');
        history.push('/users');
        dispatch(hideLoading());
        // You can redirect to another page or perform other actions here
      })
      .catch((error) => {
        // Handle error
        console.error('Error creating user:', error);
        dispatch(hideLoading());
      });
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
           
              <h2 className="mb-0">Users</h2>
          
            
              <span className="ms-3 fs-4 text-muted">|</span>
           
            
              <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb bg-transparent">
                  <li className="breadcrumb-item"><a href="/"> <i className="fas fa-home"></i> Home</a></li>
                  <li className="breadcrumb-item"><a href="/users"> <i className="fas fa-users"></i> Users</a></li>
                  <li className="breadcrumb-item active" aria-current="page"><i className="fas fa-user-plus"> </i> Create User</li>
                </ol>
              </nav>
          </div>
          </div>
            <div className="col-md-3 d-flex justify-content-end mt-4">
              <button className="btn btn-primary" onClick={handleCreateUser}><i className="fas fa-user-plus"> </i> Create User</button>
            </div>

          <div className="card-container mt-4">
            <div className="card">
            <h5 className="card-header">User Information</h5>
              <div className="card-body">
                
                <div className="form-container">
                <div className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="first_name" onChange={handleChange}/>
                </div>
                <div className="col-md-6">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="last_name" onChange={handleChange}/>
                </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input type="text" className="form-control" id="email"onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input type="password" className="form-control" id="password" onChange={handleChange} />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="emp_id" className="form-label">Employee ID</label>
                      <input type="text" className="form-control" id="emp_id" onChange={handleChange}/>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="phone_number" className="form-label">Mobile Number</label>
                      <input type="tel" className="form-control" id="phone_number" onChange={handleChange}/>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label htmlFor="user_image" className="form-label">Image Upload</label>
                        <input type="file" className="form-control" id="user_image" accept="image/*" onChange={handleChange}/>
                        </div>
                        <div className="col-md-3">
                        {formData.user_image && (
                    <img
                      src={URL.createObjectURL(formData.user_image)}
                      alt="User Preview"
                      style={{ marginTop: '10px', maxWidth: '100%', height:'50%' }}
                    />  
                  )}
                    </div>  
                    <div className="col-md-2 ml-3">
                    <div className="form-check form-switch mt-4">
  <input className="form-check-input" type="checkbox" role="switch" id="is_active" checked={formData.is_active}
        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
        />
    <label className="form-check-label" htmlFor="is_active">Is Active</label>  
  </div>
  <div className="form-check form-switch ">
  <input className="form-check-input" type="checkbox" role="switch" id="is_superuser" checked={formData.is_superuser}
        onChange={(e) => {
          const is_superuser = e.target.checked;
          setFormData({
            ...formData,
            is_superuser,
            is_staff: is_superuser ? true : formData.is_staff, // Set is_staff to true if is_superuser is checked
          });
        }}
    
        />
    <label className="form-check-label" htmlFor="is_superuser">Is Admin</label>
    
  </div>
                    </div>
                    <div className='col-md-3'>
<div className="form-check form-switch mt-4">
  <input className="form-check-input" type="checkbox" role="switch" id="is_staff" checked={formData.is_staff}
        onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
        />
    <label className="form-check-label" htmlFor="is_staff">Is Staff</label>
    
  </div>
</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
      </div>
    
  );
}

export default CreateUser;