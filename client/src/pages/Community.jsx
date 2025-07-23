import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [showOverlays, setShowOverlays] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get('/api/user/get-published-creation', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        '/api/user/toggle-like-creation',
        { id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.message);
        await fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  const toggleOverlay = (index) => {
    setShowOverlays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return !loading ? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6 overflow-hidden">
      <h1 className="text-xl font-semibold text-gray-700">Creations</h1>

      <div className="bg-white flex flex-wrap gap-4 p-4 rounded-xl overflow-y-auto h-full">
        {creations.map((creation, index) => (
          <div
            key={index}
            onClick={() => toggleOverlay(index)}
            className="relative group w-full sm:w-1/2 lg:w-1/3 rounded-lg overflow-hidden cursor-pointer"
          >
            <img
              src={creation.content}
              className="w-full h-60 object-cover rounded-lg"
              alt="creation"
            />

            <div
              className={`absolute bottom-0 left-0 right-0 bg-black/60 p-3 text-white 
                transition-opacity duration-300 ${
                  showOverlays[index] ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
            >
              <p className="text-sm mb-2 line-clamp-2">{creation.prompt}</p>
              <div className="flex items-center gap-2">
                <p>{creation.likes.length}</p>
                <Heart
                  onClick={(e) => {
                    e.stopPropagation(); // prevent image tap toggling overlay
                    imageLikeToggle(creation.id);
                  }}
                  className={`w-5 h-5 cursor-pointer transition ${
                    creation.likes.includes(user.id)
                      ? 'fill-red-500 text-red-600'
                      : 'text-white'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full">
      <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin" />
    </div>
  );
};

export default Community;
