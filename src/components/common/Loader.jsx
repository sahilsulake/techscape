import React from 'react';
// Assuming you have some basic Loader component defined

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
};

// Ensure you use 'export default'
export default Loader; // <-- THIS LINE IS THE KEY FIX
