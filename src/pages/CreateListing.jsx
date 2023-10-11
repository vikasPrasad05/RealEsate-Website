import React, { useState } from 'react'
import Spinner from '../components/Spinner';
import {toast} from "react-toastify"
import {getStorage , ref , uploadBytesResumable , getDownloadURL} from "firebase/storage"
import {getAuth} from 'firebase/auth'
import {v4 as uuidv4} from "uuid";
import {addDoc, collection, serverTimestamp} from "firebase/firestore"
import {db} from "../firebase";
import { useNavigate } from 'react-router';

export default function CreateListing() {

  const navigate = useNavigate();
  const auth = getAuth()

  //GEO LOCATION HOOK
  const [geolocationEnabled , setGeolocationEnabled] = useState(false);

  //LOADING HOOK
  const [loading , setLoading] = useState(false);

  //USE STATE
  const [formData , setFormData]  = useState({
    type : 'sell',
    title : '',
    bedrooms : '',
    bathrooms : '',
    furnished : false,
    parking : false,
    description : '',
    address : '',
    offer : false,
    actualPrice : '',
    discountedPrice : '',
    totalAmount : '',
    latitude : 0,
    longitude : 0,
    images : {},
    email : ''
  });

  //DESTRUCTURING
  const {type , title , bedrooms , bathrooms , parking , furnished , address , description , offer , actualPrice , discountedPrice , totalAmount , latitude , longitude , images , email} = formData;

  //SOME COMPLEX LOGIC TO TOGGLE STATE
  async function onChange(e){
    let boolean = null;

    if(e.target.value === "true"){
      boolean = true;
    }

    if(e.target.value === "false"){
      boolean = false;
    }

    if(e.target.files){
      setFormData((prevState)=>({
        ...prevState,
        images : e.target.files
      }))
    }

    if(!e.target.files){
      setFormData((prevState)=>({
        ...prevState,
        [e.target.id] : boolean ?? e.target.value,
      }))
    }
  }


  //ON SUBIT FUNCTION
  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);

    // discounted prices should be less than regular check
    // if(+discountedPrice >= +actualPrice ){
    //   setLoading(false);
    //   toast.error("Discounted prise should need to be less than regular price");
    //   return;
    // }

    //maximum image quantity should be 6 check
    if(images.length > 6){
      setLoading(false);
      toast.error("maximum 6 images are allowed");
      return;
    }

    let geolocation ={}
    let location 
    if(geolocationEnabled){
      console.log("itna paisa nahi")
    }else{
      geolocation.lat  = latitude;
      geolocation.lng = longitude;
      console.log(latitude , longitude);
    }

    //UPLOADING IMAGES TO FIREBASE

    async function storeImage(image){
      return new Promise((resolve , reject)=>{
        const storage = getStorage()
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage , filename);
        const uploadTask = uploadBytesResumable(storageRef , image)
        uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
    reject(error)
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve( downloadURL);
    });
  }
);
      })
    }

    
    const imgUrls = await Promise.all(
    [...images].map((image)=>storeImage(image))).catch((error)=>{
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    }
  );

  const formDataCopy = {
    ...formData,
    imgUrls,
    timestamp : serverTimestamp(),
    userRef : auth.currentUser.uid,
  };

 // Remove empty fields
for (const key in formDataCopy) {
  if (formDataCopy[key] === '') {
    delete formDataCopy[key];
  }
}
  
  delete formDataCopy.images;
  !formDataCopy.offer && delete formDataCopy.discountedPrice;
  console.log(formDataCopy)
  const docRef = await addDoc(collection(db , "listings"), formDataCopy);
  setLoading(false);
  toast.success("Listing created");
  navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

 


  if(loading){
    return <Spinner/>;
  }

  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6 font-bold'>Create a Lisiting</h1>
      <form className='mt-8' onSubmit={onSubmit}>

        <div className='flex mt-4 '>
          <button type='button' id='type' value="sell" onClick={onChange} className={`px-7 py-3 mr-2 font-medium text-sm uppercase rounded-t-full  transition w-full shadow  ${type === 'rent' ? "bg-white " : "bg-black text-white" }`}>SELL</button>
          <button type='button' id='type' value="rent" onClick={onChange} className={`px-7 py-3 ml-2 font-medium text-sm uppercase  rounded-t-full  f transition w-full shadow  ${type === 'sell' ? "bg-white " : "bg-black text-white" }`}>RENT</button>
        </div>

        <input type="text" placeholder='Title...' id="title" value={title} className='px-7 py-3 mt-6 rounded border w-full outline-none' onChange={onChange} maxLength="32" minLength="10" required/>

        <div className='flex mt-4'>
          
            
            <input type="number" placeholder='Bedrooms' id='bedrooms'  value={bedrooms} className='w-full mr-2 py-3 px-7 border rounded outline-none' onChange={onChange} min="1" max="50" required/>
          
          
            
            <input type="number" placeholder="Bathrooms" id='bathrooms' value={bathrooms} className='w-full ml-2 px-7 py-3 border rounded outline-none' onChange={onChange} min="1" max="50" required/>
          
        </div>

        <div className='flex mt-4 '>
          <button type='button' id='furnished' value={true} onClick={onChange} className={`px-7 py-3 mr-2  font-medium text-sm uppercase rounded  transition w-full shadow hover:shadow-md ${!furnished ? "text-black"  : "bg-black text-white" }`}>Furnished</button>
          <button type='button' id='furnished' value={false} onClick={onChange} className={`px-7 py-3 ml-2 font-medium text-sm uppercase  rounded  transition w-full shadow hover:shadow-md ${ furnished ? " text-black" : "bg-black text-white" }`}>unfurnished</button>
        </div>

        <div className='flex mt-4 '>
          <button type='button' id='parking' value={true} onClick={onChange} className={`px-7 py-3 mr-2 font-medium text-sm uppercase rounded  transition w-full shadow hover:shadow-md  ${!parking ? " text-black" : "bg-black text-white" }`}>Parking space</button>
          <button type='button' id='parking' value={false} onClick={onChange} className={`px-7 py-3 ml-2 font-medium text-sm uppercase  rounded  transition w-full shadow hover:shadow-md  ${parking ? "text-black" : "bg-black text-white" }`}>No parking space</button>
        </div>

        <textarea type="text" placeholder='Description' id="description" value={description} className='px-7 py-3 mt-6 rounded border w-full outline-none' onChange={onChange} required/>

        <textarea type="text" placeholder='Address' id="address" value={address} className='px-7 py-3 mt-6 rounded border w-full outline-none' onChange={onChange} required/>
        {!geolocationEnabled && (
          <div className='flex '>
            <div className='mr-4'>
              <p className='text-sm opacity-50 mt-2'>Latitude</p>
              <input type="number" id='latitude' value={latitude} onChange={onChange} required className='w-full mr-2 py-3 px-7 border rounded outline-none' min="-90" max="90"/>
            </div>
            <div className=''>
              <p className='text-sm opacity-50 mt-2'>Longitide</p>
              <input type="number" id='longitude' value={longitude} onChange={onChange} required className='w-full mr-2 py-3 px-7 border rounded outline-none' min="-180" max="180"/>
            </div>
          </div>
        )}

        <div className='flex mt-4 '>
          <button type='button' id='offer' value={true} onClick={onChange} className={`px-7 py-3 mr-2 font-medium text-sm uppercase rounded  transition w-full shadow hover:shadow-md  ${!offer ? " text-black" : "bg-black text-white" }`}>Offer</button>
          <button type='button' id='offer' value={false} onClick={onChange} className={`px-7 py-3 ml-2 font-medium text-sm uppercase  rounded  transition w-full shadow hover:shadow-md  ${ offer ? " text-black" : "bg-black text-white" }`}>No Offer</button>
        </div>
        
        { offer && (
          <div className='flex mt-4'>
          
            
          <input type="number" placeholder='Actual price in &#8377;' id='actualPrice'  value={actualPrice} className='w-full mr-2 py-3 px-4 border rounded outline-none' onChange={onChange}  />
        
          { type === 'rent' && (
            <p className='text-sm'>&#8377; / months</p>
          )
          }
          
          <input type="number" placeholder="Discounted price" id='discountedPrice' value={discountedPrice} className='w-full ml-2 px-4 py-3 border rounded outline-none' onChange={onChange} />

        
         </div>
        )
        
        }

        { !offer && (
          <input type="number" placeholder={(type === 'sell' ? "Total Amount " : 'Amount / months' ) } id="totalAmount" value={totalAmount} className='px-7 py-3 mt-6 rounded border w-full outline-none' onChange={onChange} required/>
        )
        }

        <input type="email" placeholder='Enter Your Email' id="email" value={email} className='px-7 py-3 mt-6 rounded-b-full bg-white border w-full outline-none' onChange={onChange} required/>



        <div className='mt-6'>
          <input type="file" id='images' onChange={onChange} accept='.jpg , .png , .jpeg' multiple required/>
          <p className='text-sm mt-2 text-red-500'>Note : the first image will be the cover and maximum 6 images are allowed</p>
        </div>

        <button type='submit' onClick={onChange} className={`px-7 py-3 mt-6 font-medium text-sm uppercase rounded  transition w-full shadow bg-gray-900 hover:shadow-md text-white`}>Create Listing</button>

      </form>
    </main>
  )
}
