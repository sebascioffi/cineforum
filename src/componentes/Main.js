import 'bootstrap/dist/css/bootstrap.min.css';
import './../index.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImagenPorDefecto from "../imagenes/sinImagen.png";

function Pelicula({ pelicula }) {
  return (
    <div className="pelicula">
      {pelicula.poster_path ? (
        <img src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`} alt={pelicula.title} />
      ) : (
        <img src={ImagenPorDefecto} alt={pelicula.title} />
      )}
      <h2>{pelicula.title}</h2>
    </div>
  );
}


function Main({setFromFavoritas}) {
  const apiKey = "b8eab5c8f5604ac06e5dc051de99718e";
  const [peliculas, setPeliculas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarBoton, setMostrarBoton] = useState(true);
  const [generos, setGeneros] = useState([]);
  const [anios, setAnios] = useState([]);
  const [directoresIds, setDirectoresIds] = useState({});
  const [generoSeleccionado, setGeneroSeleccionado] = useState("");
  const [anioSeleccionado, setAnioSeleccionado] = useState("");
  const [calificacionSeleccionada, setCalificacionSeleccionada] = useState("");
  const [directorSeleccionado, setDirectorSeleccionado] = useState("");

  const handleFavoritas = () => {
    setFromFavoritas(false);
  };

  useEffect(() => {
    obtenerPeliculas(busqueda, 1, generoSeleccionado, anioSeleccionado, calificacionSeleccionada, directorSeleccionado);
  }, [busqueda, generoSeleccionado, anioSeleccionado, calificacionSeleccionada, directorSeleccionado]);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + apiKey + '&language=es-MX')
      .then(response => response.json())
      .then(data => setGeneros(data.genres))
      .catch(error => console.error('Error al obtener la lista de géneros: ' + error));
  }, []);

  useEffect(() => {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const aniosDisponibles = Array.from({ length: anioActual - 1899 }, (_, i) => anioActual - i);
    setAnios(aniosDisponibles);
  }, []);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + apiKey + '&language=es-MX')
      .then(response => response.json())
      .then(data => {
        const options = Array.from(document.getElementById('directors').getElementsByTagName('option'));
        const newDirectoresIds = {};

        Promise.all(options.map(option => {
          if (option.hasAttribute('data-director')) {
            const director = option.getAttribute('data-director');
            const url = 'https://api.themoviedb.org/3/search/person?api_key=' + apiKey + '&query=' + encodeURIComponent(director);

            return fetch(url)
              .then(response => response.json())
              .then(directorData => {
                const id = directorData.results[0]?.id;
                if (id) {
                  newDirectoresIds[director] = id;
                }
              })
              .catch(error => console.error(error));
          }
          return Promise.resolve();
        })).then(() => {
          setDirectoresIds(newDirectoresIds);
        });
      })
      .catch(error => console.error(error));
  }, []);


  const obtenerPeliculas = (busqueda = "", page = 1) => {
    setCargando(true);
    let url = "https://api.themoviedb.org/3/movie/popular"; // URL predeterminada para películas populares
    const params = {
      api_key: apiKey,
      page: page,
    };
  
    if (busqueda === "") {
      if (generoSeleccionado !== "") {
        params.with_genres = generoSeleccionado;
      }
  
      if (anioSeleccionado !== "") {
        params.primary_release_year = anioSeleccionado;
      }
  
      if (directorSeleccionado !== "") {
        const Id = directoresIds[directorSeleccionado];
        params.with_crew = Id;
      }
  
      if (calificacionSeleccionada !== "") {
        const calificacionMinima = parseFloat(calificacionSeleccionada);
        const calificacionSuperior = calificacionMinima + 1.0;
        params['vote_average.gte'] = calificacionMinima;
        params['vote_average.lte'] = calificacionSuperior.toFixed(3);
      }
  
      // Construye la URL con los parámetros seleccionados
      const queryString = new URLSearchParams(params).toString();
      url = `https://api.themoviedb.org/3/discover/movie?${queryString}`;
    } else {
      // Si hay una búsqueda de texto, utiliza la búsqueda de películas
      params.query = busqueda;
      const queryString = new URLSearchParams(params).toString();
      url = `https://api.themoviedb.org/3/search/movie?${queryString}`;
    }
  
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var peliculasNuevas = data.results;
  
        // Actualizar el estado de las películas
        if (page === 1) {
          // Si es la primera página, reemplaza las películas anteriores
          setPeliculas(peliculasNuevas);
        } else {
          // Si no es la primera página, agrega las nuevas películas al estado existente
          setPeliculas((prevPeliculas) => [...prevPeliculas, ...peliculasNuevas]);
        }
  
        // Verificar si hay más páginas de resultados
        if (data.total_pages > page) {
          setPagina(page + 1); // Incrementar la página
        } else {
          setMostrarBoton(false); // Ocultar el botón "Ver más" si no hay más resultados
        }
  
        // Después de cargar las películas, establece cargando en false
        setCargando(false);
      })
      .catch(function (error) {
        console.error("Error al obtener películas: " + error);
        setCargando(false); // En caso de error, establece cargando en false
      });
  };
  

  const handleInputChange = event => {
    const valor = event.target.value;
    setBusqueda(valor);
    setPeliculas([]);
    setPagina(1);
    setMostrarBoton(true);
  };

  const cargarMasPeliculas = () => {
    obtenerPeliculas(busqueda, pagina);
  };  

  return (
    <main>
      <div className="contenedor-busq">
            <div className="contenedor-busqavan">
                <div>
                    <h2>Busqueda avanzada:</h2>
                </div>
                    <div id="avanzada">
                        <label htmlFor="genero" id="lblgenero" className="labels">Género:</label>
                        <select id="genero" className="selects" value={generoSeleccionado} onChange={(e) => setGeneroSeleccionado(e.target.value)}>
                            <option value="">Todos</option>
                            {generos.map(genero => (
                              <option key={genero.id} value={genero.id}>
                                {genero.name}
                              </option>
                            ))}
                        </select>

                        <label htmlFor="anio" className="labels">Año de estreno:</label>
                        <select id="anio" className="selects" value={anioSeleccionado} onChange={(e) => setAnioSeleccionado(e.target.value)}>
                            <option value="" className="options">Todos</option>
                            {anios.map(anio => (
                              <option key={anio} value={anio}>
                                {anio}
                              </option>
                             ))}
                        </select>
                        <label htmlFor="calificacion" className="labels">Calificación:</label>
                        <select id="calificacion" className="selects" value={calificacionSeleccionada} onChange={(e) => setCalificacionSeleccionada(e.target.value)}>
                            <option value="">Todas</option>
                            <option value="1.000">1</option>
                            <option value="2.000">2</option>
                            <option value="3.000">3</option>
                            <option value="4.000">4</option>
                            <option value="5.000">5</option>
                            <option value="6.000">6</option>
                            <option value="7.000">7</option>
                            <option value="8.000">8</option>
                            <option value="9.000">9</option>
                            <option value="10.000">10</option>
                        </select>
                        <label htmlFor="directors" id="lbldirectors" className="labels">Director:</label>
                        <select id="directors" name="directors" className="selects" value={directorSeleccionado} onChange={(e) => setDirectorSeleccionado(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Quentin Tarantino" data-director="Quentin Tarantino">Quentin Tarantino</option>
                            <option value="Christopher Nolan" data-director="Christopher Nolan">Christopher Nolan</option>
                            <option value="Steven Spielberg" data-director="Steven Spielberg">Steven Spielberg</option>
                            <option value="David Fincher" data-director="David Fincher">David Fincher</option>
                            <option value="Martin Scorsese" data-director="Martin Scorsese">Martin Scorsese</option>
                            <option value="Juan Jose Campanella" data-director="Juan Jose Campanella">Juan Jose Campanela</option>
                            <option value="Ridley Scott" data-director="Ridley Scott">Ridley Scott</option>
                            <option value="Alfred Hitchcock" data-director="Alfred Hitchcock">Alfred Hitchcock</option>
                            <option value="Stanley Kubrick" data-director="Stanley Kubrick">Stanley Kubrick</option>
                            <option value="Spike Lee" data-director="Spike Lee">Spike Lee</option>
                            <option value="Clint Eastwood" data-director="Clint Eastwood">Clint Eastwood</option>
                            <option value="Greta Gerwig" data-director="Greta Gerwig">Greta Gerwig</option>
                            <option value="Jordan Peele" data-director="Jordan Peele">Jordan Peele</option>
                            <option value="Bong Joon-ho" data-director="Bong Joon-ho">Bong Joon-ho</option>
                            <option value="Denis Villeneuve" data-director="Denis Villeneuve">Denis Villeneuve</option>
                            <option value="Guillermo del Toro" data-director="Guillermo del Toro">Guillermo del Toro</option>
                            <option value="Wes Anderson" data-director="Wes Anderson">Wes Anderson</option>
                            <option value="Taika Waititi" data-director="Taika Waititi">Taika Waititi</option>
                            <option value="Ava DuVernay" data-director="Ava DuVernay">Ava DuVernay</option>
                            <option value="Sofia Coppola" data-director="Sofia Coppola">Sofia Coppola</option>
                            <option value="Yorgos Lanthimos" data-director="Yorgos Lanthimos">Yorgos Lanthimos</option>
                            <option value="Joel Coen" data-director="Joel Coen">Joel Coen</option>
                            <option value="Ethan Coen" data-director="Ethan Coen">Ethan Coen</option>
                            <option value="Hayao Miyazaki" data-director="Hayao Miyazaki">Hayao Miyazaki</option>
                            <option value="Darren Aronofsky" data-director="Darren Aronofsky">Darren Aronofsky</option>
                            <option value="James Cameron" data-director="James Cameron">James Cameron</option>
                            <option value="Francis Ford Coppola" data-director="Francis Ford Coppola">Francis Ford Coppola</option>
                            <option value="Oliver Stone" data-director="Oliver Stone">Oliver Stone</option>
                            <option value="Pedro Almodóvar" data-director="Pedro Almodóvar">Pedro Almodóvar</option>
                            <option value="Paul Thomas Anderson" data-director="Paul Thomas Anderson">Paul Thomas Anderson</option>
                            <option value="Danny Boyle" data-director="Danny Boyle">Danny Boyle</option>
                            <option value="Jean-Pierre Jeunet" data-director="Jean-Pierre Jeunet">Jean-Pierre Jeunet</option>
                            <option value="Terrence Malick" data-director="Terrence Malick">Terrence Malick</option>
                            <option value="Gaspar Noé" data-director="Gaspar Noé">Gaspar Noé</option>
                            <option value="Lynne Ramsay" data-director="Lynne Ramsay">Lynne Ramsay</option>
                            <option value="Dario Argento" data-director="Dario Argento">Dario Argento</option>
                            <option value="Terry Gilliam" data-director="Terry Gilliam">Terry Gilliam</option>
                            <option value="David Lynch" data-director="David Lynch">David Lynch</option>
                            <option value="Peter Jackson" data-director="Peter Jackson">Peter Jackson</option>
                            <option value="Spike Jonze" data-director="Spike Jonze">Spike Jonze</option>
                            <option value="Sergio Leone" data-director="Sergio Leone">Sergio Leone</option>                            
                        </select>
                    </div>                   
            </div>
            <div className="contenedor-input">
                <div>
                    <h2>Busqueda por título:</h2>
                </div> 
                <form id="divinput">
                    <input id="input1" type="text" placeholder="Buscar..." onChange={handleInputChange} value={busqueda}></input>
                </form>
            </div>
            </div>
            <div id="peliculas">
  {cargando ? (
    <p className='noPeliculas'>Cargando...</p>
  ) : (
    // Verificar si hay películas para mostrar
    peliculas.length > 0 ? (
      peliculas.map((pelicula) => (
        <Link to={`/pelicula/${pelicula.id}`} key={pelicula.id} onClick={handleFavoritas}>
          <Pelicula pelicula={pelicula} />
        </Link>
      ))
    ) : (
      <p className='noPeliculas'>No se han encontrado películas</p>
    ))
  }
</div>

      {mostrarBoton && (
  <div className="divcargarmas">
    <button id="cargar-mas" onClick={cargarMasPeliculas}>
      Ver más
    </button>
  </div>
)}
    </main>
  );
}
export default Main;