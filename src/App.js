import React, { useState, useEffect } from "react";
import axios from "axios";
import Movie from "./components/Movie";
import Add from "./components/Add";
import Edit from "./components/Edit";
import Pagination from "./components/Pagination";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showAdd, setShowAdd] = useState(false); // add state for showing/hiding Add component
  const [currentPage, setCurrentPage] = useState(1)
  const [moviesPerPage] = useState(5)
  const [prevDisplay, setPrevDisplay] = useState(false)

  const handleCreate = (data) => {
    axios
      .post("http://localhost:3000/movies", data)
      .then((response) => {
        let newMovies = [...movies, response.data];
        setMovies(newMovies);
        setShowAdd(false); // hide Add component after creating a new movie
      })
      .catch((error) => console.log(error));
  };

  const getMovies = () => {
    axios
      .get(`https://api.themoviedb.org/3/discover/movie?api_key=7ad3eb0336e7d980b07099008b38c2ce&with_genres=27&page=${currentPage}`)
      .then((response) => {
        setMovies(response.data.results);
        console.log(response.data.results);
      })
      .catch((error) => console.log(error));
  };



  const handleEdit = (data) => {
    axios
      .put("http://localhost:3000/movies/" + data._id, data)
      .then((response) => {
        let newMovies = movies.map((movie) => {
          return movie._id !== data._id ? movie : data;
        });
        setMovies(newMovies);
        toggleEdit();
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (deletedMovie) => {
    axios
      .delete("http://localhost:3000/movies/" + deletedMovie._id)
      .then((response) => {
        let newMovies = movies.filter((movie) => {
          return movie._id !== deletedMovie._id;
        });
        setMovies(newMovies);
      })
      .catch((error) => console.log(error));
  };

  //Pagination

  const indexOfLastRecord = currentPage * moviesPerPage

  const indexOfFirstRecord = indexOfLastRecord - moviesPerPage

  const currentMovies = movies.slice(indexOfFirstRecord, indexOfLastRecord)

  const nPages = Math.ceil(movies.length / moviesPerPage)

  const prevPage = () => {
    let prev = (currentPage - 1)
    if (prev == 0){
      setPrevDisplay(false)
    } else {
      setPrevDisplay(true)
    setCurrentPage(prev)
    getMovies()
  }
}

  const nextPage = () => {
    let next = (currentPage + 1)
    setCurrentPage(next)
    setPrevDisplay(true)
    getMovies()
  }

  //Display Toggles

  const toggleEdit = (movie = null) => {
    setShowEdit(!showEdit);
    setSelectedMovie(movie);
  };

  const toggleAdd = () => {
    setShowAdd(!showAdd); // toggle showing/hiding Add component
  }

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <>
      <div>
        <div className="toggle-menu">
          <button className="create-nav" onClick={toggleAdd}>
            {" "}
            ≡{" "}
          </button>
        </div>

        {showAdd && <Add handleCreate={handleCreate} />}

        <h1>SLASHR</h1>

        <div className="cards-container">
          {movies.map((movie) => {
            return (
              <div className="card" key={movie._id}>
                <div onClick={() => setSelectedMovie(movie)}>
                  <Movie movie={movie} />
                </div>

                {selectedMovie && selectedMovie._id === movie._id && (
                  <div className="edit-form">
                    <button onClick={() => toggleEdit(movie)}>Edit</button>{" "}
                    <button
                      onClick={() => {
                        handleDelete(movie);
                      }}
                    >
                      Delete
                    </button>
                    {showEdit &&
                      selectedMovie &&
                      selectedMovie._id === movie._id && (
                        <Edit movie={selectedMovie} handleEdit={handleEdit} />
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

          {prevDisplay
      ?<button onClick={prevPage}>Prev</button>
      : null}
          <button onClick={nextPage}>Next</button>

      {/* <Movie movie={currentMovies} /> */}
      {/* <Pagination 
        nPages = {nPages}
        currentPage = {currentPage}
        setCurrentPage = {setCurrentPage}
        /> */}

    </>
  );
}



export default App;
