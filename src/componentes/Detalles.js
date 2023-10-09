import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ImagenPorDefecto from "../imagenes/sinImagen.png";

const Detalles = ({ isAuthenticated, valorEmail, fromFavoritas  }) => {
  const [pelicula, setPelicula] = useState(null);
  const [creditos, setCreditos] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [director, setDirector] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const apiKey = "b8eab5c8f5604ac06e5dc051de99718e";

  const { id } = useParams(); // Importa "useParams" de react-router-dom  

  useEffect(() => {
    console.log(Number(id));
    if (isAuthenticated) {
      obtenerPeliculasFavoritas()
        .then((peliculasFavoritas) => {
          // Verificar si el ID está en las películas favoritas
          const esFavorita = peliculasFavoritas.includes(Number(id));
          setIsFavorite(esFavorita);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [isAuthenticated, id]);

  useEffect(() => {
    // Obtener créditos de la película
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        const director = data.crew.find(crewMember => crewMember.job === "Director");
        const directorName = director ? director.name : "Desconocido";
        setDirector(directorName);
        setCreditos(data);
      })
      .catch(error => console.error('Error al obtener créditos de la película: ', error));
  }, [id]);

  useEffect(() => {
    // Obtener detalles de la película
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => setPelicula(data))
      .catch(error => console.error('Error al obtener detalles de la película: ', error));

    // Obtener créditos de la película
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => setCreditos(data))
      .catch(error => console.error('Error al obtener créditos de la película: ', error));

    // Obtener el video del tráiler
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const videoKey = data.results[0].key;
          setVideoKey(videoKey);
        }
      })
      .catch(error => console.error('Error al obtener el tráiler de la película: ', error));
  }, [id]);

  const handleFavoriteClick = async () => {
    if (isAuthenticated){
      try {
      const response = await fetch('https://cineforum-backend.onrender.com/api/agregarFavorita', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: valorEmail, // Reemplaza 'user.email' con la forma en que obtienes el email del usuario actualmente autenticado
          pelicula: pelicula.id, // Reemplaza 'pelicula' con los datos de la película que deseas agregar a favoritas
        }),
      });
  
      if (response.status === 200) {
        // La película se agregó con éxito a favoritas
        // Puedes realizar alguna acción, como cambiar el estado para reflejar que la película está en favoritas
        setIsFavorite(true);
        console.log("pelicula agregada a favoritos")
      }else {
        // Manejar el caso de error, por ejemplo, mostrar un mensaje al usuario
        console.log('Error al agregar a favoritas');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    }else{
      alert("Debes estar logueado para agregar una película a favoritas!");
    }
  };

  function obtenerPeliculasFavoritas() {
    // Define la URL de tu endpoint en el backend para obtener las películas favoritas
    const apiUrl = `https://cineforum-backend.onrender.com/api/obtenerFavoritas?userEmail=${(localStorage.getItem("userEmail"))}`;
  
    // Define los datos de la solicitud
    const requestData = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    // Realiza la solicitud al servidor
    return fetch(apiUrl, requestData)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las películas favoritas');
          
        }
        return response.json();
        
      })
      .then((data) => data.favoritas || []); // Suponiendo que el campo en la respuesta es "favoritas"
  }

  const handleRemoveFavoriteClick = async () => {
    try {
      const response = await fetch('https://cineforum-backend.onrender.com/api/quitarFavorita', {
        method: 'DELETE', // Utilizamos el método DELETE para eliminar la película
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: valorEmail, // Reemplaza 'user.email' con la forma en que obtienes el email del usuario actualmente autenticado
          peliculaId: pelicula.id, // Reemplaza 'pelicula' con los datos de la película que deseas eliminar de favoritas
        }),
      });
  
      if (response.status === 200) {
        // La película se eliminó con éxito de favoritas
        // Puedes realizar alguna acción, como cambiar el estado para reflejar que la película ya no está en favoritas
        setIsFavorite(false);
        console.log("pelicula eliminada de favoritos")
      } else {
        // Manejar el caso de error, por ejemplo, mostrar un mensaje al usuario
        console.log('Error al eliminar de favoritas');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  return (
    <main>
      {fromFavoritas ? (
        <div>
          <Link to="/favoritas" className="btn">Volver a Favoritas</Link>
        </div>
      ) : (
        <div>
        <Link to="/" className="btn">Volver a Inicio</Link>
        </div>
      )}
      {pelicula && (
        <div id="pelicula">

          {pelicula.title && (
            <div>
              {pelicula.poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`} alt={pelicula.title} />
              ) : (
                <img src={ImagenPorDefecto} alt={pelicula.title} width={"400px"} />
              )}

            </div> 
          )}
          <div>
            <div className='titulo_pelicula'>
            {pelicula.title && (
              <h2>{pelicula.title}</h2>
            )}
  
            {isFavorite ? (
            <button className="favorite-button active" onClick={handleRemoveFavoriteClick}>
              Quitar de Favoritas
            </button>
            ) : (
            <button className="favorite-button" onClick={handleFavoriteClick}>
              Agregar a Favoritas
            </button>
            )}
    
           
            </div>        

            {pelicula.overview && (
              <p><strong>Sinopsis:</strong> {pelicula.overview} </p>
            )}
            {pelicula.release_date && (
              <p><strong>Fecha de estreno:</strong> {pelicula.release_date}</p>
            )}
            {director && (
              <p><strong>Director/a:</strong> {director} </p>
            )}
            {creditos && creditos.cast && creditos.cast.length > 0 && (
              <p><strong>Elenco:</strong> {creditos.cast.slice(0, 5).map(a => `${a.name} (${a.character})`).join(", ")} </p>
            )}
            {pelicula.genres && pelicula.genres.length > 0 && (
              <p><strong>Géneros:</strong> {pelicula.genres.map(g => g.name).join(", ")}</p>
            )}
            <p><strong>Duracion:</strong> {pelicula.runtime ? pelicula.runtime.toLocaleString() + " m" : "Desconocido"} </p>
            {pelicula.production_countries && pelicula.production_countries.length > 0 && (
              <p><strong>País de origen:</strong> {pelicula.production_countries.map(c => c.name).join(", ")} </p>
            )}
            <p><strong>Calificación de audiencia:</strong> {(pelicula.vote_average ? pelicula.vote_average.toLocaleString() : "Desconocido")} </p>
            {pelicula.production_companies && pelicula.production_companies.length > 0 && (
              <p><strong>Compañías productoras:</strong> {pelicula.production_companies.map(c => c.name).join(", ")} </p>
            )}
            <p><strong>Presupuesto:</strong> {(pelicula.budget ? pelicula.budget.toLocaleString() + " USD" : "Desconocido")}</p>
            <p><strong>Ingresos de taquilla:</strong> {(pelicula.revenue ? pelicula.revenue.toLocaleString() + " USD" : "Desconocido")} </p>

          </div>
        </div>
      )}
      {videoKey && pelicula && (
        <div id="trailer">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}`}
            width="560"
            height="315"
            allowFullScreen
            title={`${pelicula.title} Trailer`}
          ></iframe>
        </div>
      )}
    </main>
  );
};

export default Detalles;
