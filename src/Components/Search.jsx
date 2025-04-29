import React from 'react'
import { IoIosSearch } from "react-icons/io";

const Search = ({ search, setSearch, darkMode }) => {
  return (
    <div className="w-full justify-center items-center flex mt-5">
      <div
        className={`w-[400px] flex overflow-hidden rounded ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-[#f0f0f0] text-black'
        }`}
      >
        <IoIosSearch
          className={`mx-2 my-3 text-2xl ${
            darkMode ? 'text-white' : 'text-gray-700'
          }`}
        />
        <input
          type="text"
          placeholder="Search Your Movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent focus:outline-none p-2 w-full"
        />
      </div>
    </div>
  )
}

export default Search