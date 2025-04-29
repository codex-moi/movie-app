import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FiSun, FiMoon } from 'react-icons/fi' // Import icons
import Header from './Components/Header'
import Search from './Components/Search'
import MovieDetail from './Components/MovieDetail'
import Navbar from './Components/Navbar'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [search, setSearch] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode from localStorage
    const savedTheme = localStorage.getItem('darkMode')
    return savedTheme === 'true' // Convert string to boolean
  })

  const fetchMovies = async (query = '') => {
    setLoading(true)
    setErrorMessage("")
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`
      const response = await fetch(endpoint, API_OPTIONS)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()

      if (data.response === "false") {
        setErrorMessage("No movies found")
        setMovies([])
        return
      }
      setMovies(data.results || [])
    } catch (err) {
      console.error(`Error fetching movies: ${err}`)
      setErrorMessage("Couldn't Load Movies, Try Again Later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(search)
  }, [search])

  const toggleTheme = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode
      localStorage.setItem('darkMode', newMode) // Save to localStorage
      return newMode
    })
  }

  return (
    <div className={darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}>
      <Router>
        <Navbar />
        <button
          onClick={toggleTheme}
          className="p-2 m-4 border rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
        >
          {darkMode ? (
            <FiSun className="text-yellow-500 text-2xl" /> // Sun icon for light mode
          ) : (
            <FiMoon className="text-gray-800 text-2xl" /> // Moon icon for dark mode
          )}
        </button>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="justify-center items-center">
                  <Header />
                  <Search search={search} setSearch={setSearch} darkMode={darkMode}  />
                </div>
                <div className="">
                  <h2 className="px-3 text-2xl font-bold">Popular Movies</h2>
                  {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : errorMessage ? (
                    <p className="text-red-500 text-center">{errorMessage}</p>
                  ) : (
                    <div className="flex flex-wrap w-full justify-center gap-2 bg-gray-200 dark:bg-gray-800 p-4">
                      {movies.map((movie) => (
                        <div
                          key={movie.id}
                          className="w-[200px] h-[425px] shadow-md bg-gray-200 dark:bg-gray-800 rounded p-2 m-2"
                        >
                          <div className="w-full h-[300px] overflow-hidden rounded">
                            <a href={`/movie/${movie.id}`}>
                              <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full"
                              />
                            </a>
                          </div>
                          <h3 className="text-lg font-bold">{movie.title}</h3>
                          <p>
                            {movie.release_date
                              ? movie.release_date.split('-')[0]
                              : 'N/A'}
                          </p>
                          <div className="flex">
                            <p>
                              <span className="text-yellow-500">
                                {movie.vote_average
                                  ? movie.vote_average.toFixed(1)
                                  : 'N/A'}
                              </span>
                            </p>
                            <p className="px-2">•</p>
                            <p>{movie.original_language}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            }
          />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App