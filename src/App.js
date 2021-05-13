import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [loading, setLoading] = useState(true)
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  let url;
  const urlPage = `&page=${page}`
  const queryUrl = `&query=${query}`

  if (query) {
    url = `${searchUrl}${clientID}${urlPage}${queryUrl}`
  } else {
    url = `${mainUrl}${clientID}${urlPage}`
  }
  // console.log(url);

  const fetchImage = async () => {
    setLoading(true)
    try {
      const response = await fetch(url)
      const data = await response.json()
      console.log(data);
      setPhotos((oldPhots) => {
        if (query && page === 1) {
          return [...data.results]
        }
        else if (query) {
          return [...oldPhots, ...data.results]
        } else {
          return [...oldPhots, ...data]
        }
      })
      setLoading(false)

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchImage()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    const event = window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY >= document.body.scrollHeight - 10)) {
        setPage((oldPage) => {
          return oldPage + 1
        })
      }
    })
    // eslint-disable-next-line
    return () => window.removeEventListener('scroll', event)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    fetchImage()
  }
  return (
    <main>
      <section className="search">
        <form className="search-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="search" className="form-input" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      (
      <section className="photos">

        <div className="photos-center">
          {photos.map((photo, index) => {
            return <Photo key={index} {...photo} />
          })}
        </div>
      </section>
      )
      {loading && <h2 className="loading">Loading...</h2>}
    </main>
  )
}
export default App
