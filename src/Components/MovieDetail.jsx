import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const MovieDetail = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true)
      setErrorMessage("")
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}?api_key=${API_KEY}`,
          API_OPTIONS
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setMovie(data)
      } catch (err) {
        console.error(`Error fetching movie: ${err}`)
        setErrorMessage("Couldn't Load Movie Details, Try Again Later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  if (loading) return <p className="text-center">Loading...</p>
  if (errorMessage) return <p className="text-red-500 text-center">{errorMessage}</p>

  return (
    <div className="p-4">
      <Link
        to="/"
        className="text-blue-500 mb-4 inline-block"
      >
        Back
      </Link><img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full max-w-md mx-auto my-4"
      />
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <p className="text-gray-600">{movie.overview}</p>
      <p>
        <strong>Release Date:</strong> {movie.release_date}
      </p>
      <p>
        <strong>Rating:</strong> {movie.vote_average}
      </p>
      <p>
        <strong>Language:</strong> {movie.original_language}
      </p>
    </div>
  )
}

export default MovieDetail