import React, { useEffect, useState } from 'react';
import ImagenPorDefecto from "../imagenes/sinImagen.png";
import { Link } from 'react-router-dom';

const Favoritas = ({ valorEmail, setFromFavoritas }) => {
  const apiKey = "b8eab5c8f5604ac06e5dc051de99718e";
  const [peliculasFavoritas, setPeliculasFavoritas] = useState([]);
  const [cargando, setCargando] = useState(false);

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

  const handleFavoritas = () => {
    setFromFavoritas(true);
    // Resto de tu código
  };

  function obtenerPeliculasFavoritas() {
    setCargando(true);
    // Define la URL de tu endpoint en el backend para obtener las películas favoritas
    const apiUrl = `https://cineforum-backend.onrender.com/api/obtenerFavoritas?userEmail=${encodeURIComponent(valorEmail)}`;
  
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
          setCargando(false);
          throw new Error('Error al obtener las películas favoritas');
        }
        setCargando(false);
        return response.json();
      })
      .then((data) => data.favoritas || []); // Suponiendo que el campo en la respuesta es "favoritas"
  }

  // Función para obtener detalles de una película por su ID
  const obtenerDetallesPelicula = async (peliculaId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${peliculaId}?api_key=${apiKey}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la película');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  // Obtener detalles de las películas favoritas
  useEffect(() => {
    obtenerPeliculasFavoritas()
      .then(async (peliculasIds) => {
        // Realizar solicitudes para obtener detalles de las películas
        const detallesPromises = peliculasIds.map(async (peliculaId) => {
          return obtenerDetallesPelicula(peliculaId);
        });

        // Esperar a que se completen todas las solicitudes
        const detallesPeliculas = await Promise.all(detallesPromises);
        setPeliculasFavoritas(detallesPeliculas.filter((pelicula) => pelicula !== null));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [valorEmail]);

  return (
    <main>
      <h2 id='h2-favoritas'>Tus películas favoritas</h2>
      {cargando ? (
        <div id='peliculas'>
          <p className='noPeliculas'>Cargando...</p>
        </div>
      ) : (
        <div id='peliculas'>
          {peliculasFavoritas.length === 0 ? (
            <p className='noPeliculas'>No has agregado películas favoritas!</p>
          ) : (
            peliculasFavoritas.map((pelicula) => (
              <Link to={`/pelicula/${pelicula.id}`} key={pelicula.id} onClick={handleFavoritas}>
                <Pelicula pelicula={pelicula} />
              </Link>
            ))
          )}
        </div>
      )}
    </main>
  );
  
};

export default Favoritas;
