
import { useState } from "react" 
import {AiFillEyeInvisible,AiFillEye } from "react-icons/ai"
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {db} from "../firebase"
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const[FormData, setForData] = useState({
    name:"",
    email: "",  
    password: "",
  });
  const { name, email, password} = FormData; 
  const navigate = useNavigate()
  function onchange(e){
    setForData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
   async function onsubmit(e){
      e.preventDefault()
      try {
        const auth = getAuth()
        const userCredential = await 
        createUserWithEmailAndPassword
        (auth,
        email, 
        password
        );

        updateProfile(auth.currentUser, {
         displayName: name
        })
        const user = userCredential.user;
        
        const formDataCopy = {...FormData }
        delete formDataCopy.password;
        formDataCopy.timestamp = serverTimestamp
        ();

        await setDoc(doc(db, "users", user.uid),
        formDataCopy)
        toast.success("sign up was successfull")
        navigate("/")
      } catch (error) {
        toast.error("Somthing went worng with the registraion")
        
      }
   }
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">

        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">

          <img src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9naW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="key"  
          className="w-full rounded-3xl"
          />
        </div>
          
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
            <form onSubmit={onsubmit} >
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={onchange}
              placeholder="Full name"
              className=" mb-6 w-full rounded-full px-4 py-2 text-xl text-gray-700 bg-gray-200 border-gray-300  transition ease-in-out"
              
              />
              <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={onchange}
              placeholder="Email address"
              className="rounded-full mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-gray-200 border-gray-300  transition ease-in-out"
              
              />
              <div className="relative mb-6">
              <input 
              type={showPassword ? "text" : "password"}
              id="password" 
              value={password} 
              onChange={onchange}
              placeholder="Password"
              className=" rounded-full w-full px-4 py-2 text-xl text-gray-700 bg-gray-200 border-gray-300 transition ease-in-out"
              
              />
              {showPassword ? 
                <AiFillEyeInvisible className="absolute right-3 top-3 text-xl cursor-pointer" 
                onClick={()=>setShowPassword ((prevState)=>!prevState)}/> :

              <AiFillEye className="absolute right-3 top-3 text-xl cursor-pointer" 
              onClick={()=>setShowPassword ((prevState)=>!prevState)}
              
              />}
              </div>
              <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">

                <p className="mb-6">Have an account?
                  <Link to="/sign-up" className="text-red-500 hover:text-red-700 transition duration-200 ease-in-out ml-4">Sign-in</Link>
                </p>
                <p>
                  <Link to="/Forgot-password" className="text-blue-500 hover:text-blue-900 transition duration-200 ease-in-out ml-4">Forgot-password?</Link>
               </p>
              </div>
              <button className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase shadow-md hover:bg-blue-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 rounded-t-full"type="submit">Sign-Up</button>
            < div className=" flex  items-center my-4           before:border-t before:flex-1  before:border-gray-400 
            after:border-t after:flex-1  after:border-gray-400">
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
                <OAuth />
            </form>
        </div>
      </div>
    </section>
  )
}
