import { Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import Markdown from 'react-markdown';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
import axios  from 'axios'
const RemoveBackground = () => {
  const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState("");   
    const { getToken } = useAuth()
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
        setLoading(true)
           const formData = new FormData()
           formData.append('image',input)

            const {data} = await axios.post('/api/ai/remove-image-background',formData,{headers:{Authorization: `Bearer ${await getToken() }`}})
            if(data.success){
              setContent(data.content)
            }else{
              toast.error(data.message)
            }
    } catch (error) {
      toast.error(error.message)
      
    }
    setLoading(false)

    if (!input) return;

    // Example processing logic
    const formData = new FormData();
    formData.append('image', input);

    console.log("Image ready for upload:", input.name);
    // You could use fetch() to send this to your backend here
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setInput(e.target.files[0])}
          className="w-full p-2 px-3 mt-2 outline-none text-gray-600 text-sm rounded-md border border-gray-300"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports JPG, PNG, and other image formats
        </p>

        <button
        disabled={loading}
          type="submit"
          className="mt-6 w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 text-sm rounded-lg cursor-pointer"
        >
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>: <Eraser className="w-5" />}
          Remove Background
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        {!content ? ( <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center">
            <Eraser className="w-9 h-9" />
            <p>Upload an image and click "Remove Background" to get started</p>
          </div>
        </div>):(
          <div>
            <img src={content} alt="image" className='mt-3 w-full h-full' />
          </div>
        )}
       
      </div>
    </div>
  );
};

export default RemoveBackground;
