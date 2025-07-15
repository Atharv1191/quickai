import React, { useState } from 'react';
import Markdown from 'react-markdown'

const CrationItems = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer"
      onClick={() => setExpanded(!expanded)} // Toggle expand on click
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2>{item.prompt}</h2>
          <p className="text-gray-500">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <button className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full">
          {item.type}
        </button>
      </div>

      {expanded ? (
        <div>
          {item.type === 'image' ? (
            <img
              src={item.content}
              alt="image"
              className="mt-3 w-full max-w-md rounded"
            />
          ) : (
            <div className='reset-tw'>
                <Markdown>{item.content}</Markdown>
            </div>

          )}
        </div>
      ) : null}
    </div>
  );
};

export default CrationItems;
