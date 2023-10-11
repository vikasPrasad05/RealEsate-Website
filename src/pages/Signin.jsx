import { useState } from "react" 
import {AiFillEyeInvisible,AiFillEye } from "react-icons/ai"
import { Link, Navigate, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { signInWithEmailAndPassword, getAuth} from "firebase/auth";
import { toast } from "react-toastify"; 

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const[FormData, setForData] = useState({
    email: "",
    password: "",
  });
  const {email, password} = FormData;
  const Navigate = useNavigate();
  function onchange(e){
    setForData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  async function onSubmit(e){
      e.preventDefault()
      try {
        const auth = getAuth()
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        if(userCredentials.user){
          Navigate("/")
        }
      } catch (error) {
        toast.error("Bad user credentials")
      }
  }
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign In</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">

        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img src="https://media.istockphoto.com/id/1338320568/photo/3d-lock-and-password-field-password-protected-secure-login-concept-minimal-creative-concept.webp?b=1&s=170667a&w=0&k=20&c=bWm_qE27jl8hRh9kQVWb8Xm52k2ZPdP_nRMP5-mgReg=" alt="key"  
          className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
            <form onSubmit={onSubmit}>
              <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={onchange}
              placeholder="Email address"
              className=" mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 transition ease-in-out rounded-full"
              
              />
              <div className="relative mb-6">
              <input 
              type={showPassword ? "text" : "password"}
              id="password" 
              value={password} 
              onChange={onchange}
              placeholder="Password"
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300  transition ease-in-out rounded-full"
              
              />
              {showPassword ? 
                <AiFillEyeInvisible className="absolute right-3 top-3 text-xl cursor-pointer" 
                onClick={()=>setShowPassword ((prevState)=>!prevState)}/> :

              <AiFillEye className="absolute right-3 top-3 text-xl cursor-pointer" 
              onClick={()=>setShowPassword ((prevState)=>!prevState)}
              
              />}
              </div>
              <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">

                <p className="mb-6">Don't have a account?
                  <Link to="/sign-up" className="text-red-500 hover:text-red-700 transition duration-200 ease-in-out ml-4">Register</Link>
                </p>
                <p>
                  <Link to="/Forgot-password" className="text-blue-500 hover:text-blue-900 transition duration-200 ease-in-out ml-4">Forgot-password?</Link>
               </p>
              </div>
              <button className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase shadow-md hover:bg-blue-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 rounded-full"type="submit">Sign-In</button>
            < div className=" flex items-center my-4           before:border-t before:flex-1  before:border-gray-400 
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
