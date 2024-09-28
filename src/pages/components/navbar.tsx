import React, { useState } from "react";
import Modal from "./Modal";
import RatingModal from "./ReviewModal"; 

interface NavProps {
    onSuccess? : () => void;
    onReview?: (id: any) => void
  }
  
const Navbar: React.FC<NavProps> = ({onSuccess ,onReview}) => {
  const [showModal, setShowModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false); 


  return (
    <div>
      <nav className="bg-[#e1deea] border-gray-200 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-black">
              MOVIECRITIC
            </span>
          </a>
          <div className="flex gap-5">
          <button
            type="button"
            className="text-white bg-transparent border border-white hover:bg-blue-800 focus:ring-4 ring-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:hover:bg-blue-700 focus:outline-none"
            onClick={() => setShowRatingModal(true)}
          >
           Add New Rating
          </button>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
            onClick={() => setShowModal(true)} 
          >
            Add New Movie
          </button>
          </div>
        </div>
      </nav>

      <Modal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={onSuccess}
      />
      <RatingModal
        isVisible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onReview={onReview}
      />
    </div>
  );
};

export default Navbar;