import {useEffect , useState} from 'react'

import {useParams,useNavigate} from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../components/Sidebar'

const EditUser =() =>{

    const {id} = useParams();
    const navigate = useNavigate();
    const [user,setUser] = useState({
        name: '',
        email: '',
    })

    useEffect(()=>{
        axios.get(`http://localhost:5001/api/admin/users/${id}`).then((res)=>{
            setUser(res.data);
        })
    },[id])

    const handleChange = (e) =>{
        setUser({...user,[e.target.name]:e.target.value})
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        await axios.put(`http://localhost:5001/api/admin/users/${id}`,user)
        navigate('/admin/users')
    }
    
    return (
      <div className="flex">
        <Sidebar />
        <div className="ml-64 p-5 w-full">
          <h1 className="text-2xl font-bold mb-4">Edit User</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Email"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Update User
            </button>
          </form>
        </div>
      </div>
    );
}
    
export default EditUser;