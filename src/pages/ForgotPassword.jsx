import { useState } from "react" 
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

export default function ForgotPassword() {

  const[Email, setEmail] = useState("");
  
  function onchange(e){
    setEmail(e.target.value);
  }
  async function onSubmit(e){
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, Email)
      toast.success("Email was send");
    } catch (error) {
      toast.error("could not send reset password")
      
    }
  }

return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">ForgotPassword</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">

        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9naW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="key"  
          className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
            <form  onSubmit={onSubmit}>
              <input 
              type="email" 
              id="email" 
              value={Email} 
              onChange={onchange}
              placeholder="Email address"
              className=" mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-gray-200 border-gray-300 transition ease-in-out rounded-full"
              
              />
              
              <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">

                <p className="mb-6">Don't have a account?
                  <Link to="/sign-up" className="text-red-500 hover:text-red-700 transition duration-200 ease-in-out ml-4">Register</Link>
                </p>
                <p>
                  <Link to="/Sign-in" className="text-blue-500 hover:text-blue-900 transition duration-200 ease-in-out ml-4">Sign-In instead</Link>
               </p>
              </div>
              <button className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase shadow-md hover:bg-blue-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 rounded-t-full"type="submit">send reset password</button>

            <div className=" flex  items-center my-4 before:border-t before:flex-1  before:border-gray-400 
            after:border-t after:flex-1  after:border-gray-400 ">
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
                <OAuth />
            </form>
        </div>
      </div>
    </section>
  )
}

