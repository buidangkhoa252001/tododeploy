import './App.css';
import { useEffect } from 'react';

import { useState } from 'react';
import axios from "./axios/axios";


function App() {
  const [data,setData] = useState([])
  const [user,setUser] = useState({
    email:'',firstName:'',password:''
  })
  const gg =async ()=>{
    const res = await axios.get(`/api/get-all-user`)
    const {data} = res.data
    setData(data)
    console.log(data)
  }
  useEffect(()=>{
    gg()
  },[])
  const Submit = async (e) => {
    try {
       e.preventDefault();
      console.log(user);
      await axios.post(`/api/create-user`, user );
      /*    window.location.href = "/"; */
         gg()
    } catch (err) {
      console.log(err);
    }
  };
  const removeProduct = async (id) => {
    try {
      console.log(typeof(id))
     
     /*  window.location.href = "/"; */
      await axios.delete(`/api/delete-user/${id}`);
      gg();
    } catch (err) {
      console.log(err);
    }
  };
    const onChangeInput = (e) => {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });
      console.log(user);
    };
  return (
    <div className="App">
      <div  style={{
         margin:'10px'
        }}>
        Non2
      </div>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
         onSubmit={Submit}
      >
        <input
          name="email"
          required
          style={{ width: "70%" }}
          value={user.email}
          onChange={onChangeInput}
        />
        <input
          name="password"
          required
          style={{ width: "70%" }}
          value={user.password}
          onChange={onChangeInput}
        />
        <input
          name="firstName"
          required
          style={{ width: "70%" }}
          value={user.firstName}
          onChange={onChangeInput}
        />
        <button type='submit' style={{ width: "10%" }}>
          Create
        </button>
      </form>
      <div style={{ width: "100%", marginTop: "5px" }}>
        {data?.map((item) => (
          <div
            key={item?.id}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>{item?.firstName}</div>
            <div  onClick={() => removeProduct(item.id)}>
              X
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
