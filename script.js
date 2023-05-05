var apiKey = "b8eab5c8f5604ac06e5dc051de99718e";

function obtenerPeliculas(busqueda = "") {
  var url = "";

  if (busqueda === "") {
    url = "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey;
  } else {
    url = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + busqueda;
  }

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var peliculas = data.results;

      var contenedorPeliculas = document.getElementById("peliculas");
      if (peliculas.length === 0) {
        contenedorPeliculas.innerHTML = "No se encontraron películas";
        var relleno = document.createElement("div");
        relleno.classList.add("abajo");
        contenedorPeliculas.appendChild(relleno);
        return;
      }
      contenedorPeliculas.innerHTML = ""; // Borrar las películas anteriores

      peliculas.forEach(function(pelicula) {
        var divPelicula = document.createElement("div");
        divPelicula.classList.add("pelicula");

        var imagenPelicula = document.createElement("img");
        imagenPelicula.src = "https://image.tmdb.org/t/p/w500" + pelicula.poster_path;
        imagenPelicula.alt = pelicula.title;

        var tituloPelicula = document.createElement("h2");
        tituloPelicula.textContent = pelicula.title;

        divPelicula.addEventListener("click", function() {
          // Redireccionar a la página de detalles de la película
          window.location.href = "detalles.html?id=" + pelicula.id;
        });

        
        divPelicula.appendChild(imagenPelicula);
        divPelicula.appendChild(tituloPelicula);

        contenedorPeliculas.appendChild(divPelicula);
      });
    });
}

document.addEventListener("DOMContentLoaded", function() {
  var pagina = 1; // Inicialmente, estamos en la página 1 de películas populares

  obtenerPeliculas();

  var input = document.getElementById("input1");
  var botonCargarMas = document.getElementById("cargar-mas");
  botonCargarMas.style.display = "block";
  
  input.addEventListener("input", function() {
    if (input.value === "") {
      botonCargarMas.style.display = "block";
    } else {
      botonCargarMas.style.display = "none";
    }
    obtenerPeliculas(input.value);
  });

  var botonCargarMas = document.getElementById("cargar-mas");
  botonCargarMas.addEventListener("click", function() {
    pagina++; // Aumentar el número de página
    obtenerPeliculasPopulares(pagina);
  });
});

function obtenerPeliculasPopulares(pagina) {
  var url = "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&page=" + pagina;
   // Aquí agregamos los parámetros de búsqueda para género, año de estreno y calificación mínima
   var selectGenero = document.getElementById("genero");
   var selectAnio = document.getElementById("anio");
   var selectCal = document.getElementById("calificacion");
   var selectDir = document.getElementById("directors");
    
   var generoSeleccionado = selectGenero.value;
   var anioSeleccionado = selectAnio.value;
   var calSeleccionado = selectCal.value;
   var directorSeleccionado = selectDir.value;
   
   if (generoSeleccionado !== "") {
     url += "&with_genres=" + generoSeleccionado;
   }
 
   if (anioSeleccionado !== "") {
     url += "&primary_release_year=" + anioSeleccionado;
   }
 
   if (calSeleccionado !== "") {
    const calificacionSuperior = parseFloat(calSeleccionado) + 0.999; // Obtiene la siguiente calificación después de calificacionSeleccionada
    url += "&vote_average.gte=" + calSeleccionado + "&vote_average.lte=" + calificacionSuperior.toFixed(3);
  }
  
  
  
  
   if (directorSeleccionado !== "") {
    url += "&with_crew=" + directorSeleccionado + "&with_crew.department=Directing";
  }
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var peliculas = data.results;

      var contenedorPeliculas = document.getElementById("peliculas");

      peliculas.forEach(function(pelicula) {
        var divPelicula = document.createElement("div");
        divPelicula.classList.add("pelicula");

        var imagenPelicula = document.createElement("img");
        imagenPelicula.src = "https://image.tmdb.org/t/p/w500" + pelicula.poster_path;
        imagenPelicula.alt = pelicula.title;

        var tituloPelicula = document.createElement("h2");
        tituloPelicula.textContent = pelicula.title;

        divPelicula.addEventListener("click", function() {
          // Redireccionar a la página de detalles de la película
          window.location.href = "detalles.html?id=" + pelicula.id;
        });

        divPelicula.appendChild(imagenPelicula);
        divPelicula.appendChild(tituloPelicula);

        contenedorPeliculas.appendChild(divPelicula);
      });
            // Verificar si hay más páginas de resultados
            if (data.total_pages > pagina) {
              var botonCargarMas = document.getElementById("cargar-mas");
              botonCargarMas.style.display = "block";
            } else {
              var botonCargarMas = document.getElementById("cargar-mas");
              botonCargarMas.style.display = "none";
            }
    });

}

// Obtener la lista de géneros de TMDB
fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=b8eab5c8f5604ac06e5dc051de99718e&language=es-MX')
  .then(response => response.json())
  .then(data => {
    // Obtener el menú desplegable de géneros
    const generoDropdown = document.getElementById('genero');
    // Verificar si el menú desplegable ya tiene opciones
    if (generoDropdown.options.length === 1) {
      // Iterar sobre la lista de géneros y agregar un elemento de opción para cada uno
      data.genres.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero.id;
        option.text = genero.name;
        generoDropdown.appendChild(option);
      });
    }
  });


  document.addEventListener("DOMContentLoaded", function() {
// Obtener el menú desplegable de años
const anioDropdown = document.getElementById('anio');

// Obtener el año actual
const fechaActual = new Date();
const anioActual = fechaActual.getFullYear();

// Iterar sobre los años desde el año actual hasta 1900 y agregar un elemento de opción para cada año
for (let i = anioActual; i >= 1900; i--) {
  const option = document.createElement('option');
  option.value = i;
  option.text = i;
  anioDropdown.appendChild(option);
}
  });

  function obtenerPeliculasPorGeneroAnioYCalificacion(genero, anio, calificacionMinima, dir) {
    var url = "https://api.themoviedb.org/3/discover/movie?api_key=" + apiKey;
  
    if (genero !== "") {
      url += "&with_genres=" + genero;
    }
  
    if (anio !== "") {
      url += "&primary_release_year=" + anio;
    }
  
    if (calificacionMinima !== "") {
      const calificacionSuperior = parseFloat(calificacionMinima) + 0.999; // Obtiene la siguiente calificación después de calificacionSeleccionada
      url += "&vote_average.gte=" + calificacionMinima + "&vote_average.lte=" + calificacionSuperior.toFixed(3);
    }
    
    
    
    

    if (dir !== ""){
      url += "&with_crew=" + dir + "&with_crew.department=Directing";
    }
  
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var peliculas = data.results;
  
        var contenedorPeliculas = document.getElementById("peliculas");
        if (peliculas.length === 0) {
          contenedorPeliculas.innerHTML = "No se encontraron películas";
          var relleno = document.createElement("div");
          relleno.classList.add("abajo");
          contenedorPeliculas.appendChild(relleno);
          return;
        }
        contenedorPeliculas.innerHTML = ""; // Borrar las películas anteriores
  
        peliculas.forEach(function(pelicula) {
          var divPelicula = document.createElement("div");
          divPelicula.classList.add("pelicula");
  
          var imagenPelicula = document.createElement("img");
          imagenPelicula.src = "https://image.tmdb.org/t/p/w500" + pelicula.poster_path;
          imagenPelicula.alt = pelicula.title;
  
          var tituloPelicula = document.createElement("h2");
          tituloPelicula.textContent = pelicula.title;
  
          divPelicula.addEventListener("click", function() {
            // Redireccionar a la página de detalles de la película
            window.location.href = "detalles.html?id=" + pelicula.id;
          });
  
          divPelicula.appendChild(imagenPelicula);
          divPelicula.appendChild(tituloPelicula);
  
          contenedorPeliculas.appendChild(divPelicula);
        });
      });
  }
  
  var selectGenero = document.getElementById("genero");
  var selectAnio = document.getElementById("anio");
  var selectCal = document.getElementById("calificacion");
  var selectDir = document.getElementById("directors")

  selectGenero.addEventListener("change", function() {
    var generoSeleccionado = selectGenero.value;
    var anioSeleccionado = selectAnio.value;
    var calSeleccionado = selectCal.value;
    var directorSeleccionado = selectDir.value;
    obtenerPeliculasPorGeneroAnioYCalificacion(generoSeleccionado, anioSeleccionado,calSeleccionado,directorSeleccionado);
  });
  selectAnio.addEventListener("change", function() {
    var generoSeleccionado = selectGenero.value;
    var anioSeleccionado = selectAnio.value;
    var calSeleccionado = selectCal.value;
    var directorSeleccionado = selectDir.value;
    obtenerPeliculasPorGeneroAnioYCalificacion(generoSeleccionado, anioSeleccionado,calSeleccionado,directorSeleccionado);
  });
  selectCal.addEventListener("change", function() {
    var generoSeleccionado = selectGenero.value;
    var anioSeleccionado = selectAnio.value;
    var calSeleccionado = selectCal.value;
    var directorSeleccionado = selectDir.value;
    obtenerPeliculasPorGeneroAnioYCalificacion(generoSeleccionado, anioSeleccionado,calSeleccionado,directorSeleccionado);
  });
  selectDir.addEventListener("change", function() {
    var generoSeleccionado = selectGenero.value;
    var anioSeleccionado = selectAnio.value;
    var calSeleccionado = selectCal.value;
    var directorSeleccionado = selectDir.value;
    obtenerPeliculasPorGeneroAnioYCalificacion(generoSeleccionado, anioSeleccionado,calSeleccionado,directorSeleccionado);
  }); 

// Función que busca el ID de un director en la API de TMDb y lo asigna como valor del atributo "value" del elemento "option"
function buscarIDdeDirector(option) {
  // Obtener el nombre del director del atributo "data-director" del elemento "option"
  var director = option.getAttribute('data-director');

  // Realizar una búsqueda de personas en la API de TMDb con el nombre del director
  var url = 'https://api.themoviedb.org/3/search/person?api_key=b8eab5c8f5604ac06e5dc051de99718e&query=' + encodeURIComponent(director);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Obtener el ID del primer resultado de la búsqueda
      var id = data.results[0].id;

      // Asignar el ID como valor del atributo "value" del elemento "option"
      option.value = id;
    })
    .catch(error => console.error(error));
}

// Obtener todos los elementos "option" del elemento "select"
var options = document.getElementById('directors').getElementsByTagName('option');

// Iterar sobre cada elemento "option"
for (var i = 0; i < options.length; i++) {
  var option = options[i];

  // Si el elemento "option" tiene un atributo "data-director", buscar el ID del director en la API de TMDb y asignarlo como valor del atributo "value"
  if (option.hasAttribute('data-director')) {
    buscarIDdeDirector(option);
  }
}
