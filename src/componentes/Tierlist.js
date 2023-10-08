import $ from 'jquery';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/draggable'; // Asegúrate de que estás importando el módulo "draggable" de jQuery UI
import 'jquery-ui/ui/widgets/droppable'; // También importa el módulo "droppable" de jQuery UI si lo usas
import { useEffect } from 'react';
import 'jquery-ui/ui/widgets/autocomplete';
import { Link } from 'react-router-dom';

const Tierlist  = () => {
  useEffect(() => {

    $('#directores-predefinidos').on('click', '.director-button', function() {
      var directorId = $(this).data('director-id');
      buscarDirector(directorId); // Llama a una función para buscar el director por su ID
    });

    function buscarDirector(directorId) {
      $.ajax({
        url: 'https://api.themoviedb.org/3/person/' + directorId + '/movie_credits',
        dataType: 'json',
        data: {
          api_key: 'b8eab5c8f5604ac06e5dc051de99718e',
        },
        success: function(data) {
          $.ajax({
            url: 'https://api.themoviedb.org/3/person/' + directorId + '/movie_credits',
            dataType: 'json',
            data: {
              api_key: 'b8eab5c8f5604ac06e5dc051de99718e',
            },
            success: function(data) {
              $('#portadas').empty();
              $(function() {
        // Agrega el código para que las imágenes de las películas sean arrastrables:
        $('.draggable').draggable({
          revert: true, // La imagen volverá a su posición original si no es soltada en una categoría
          zIndex: 100,
          start: function(event, ui) {
            ui.helper.addClass('dragging'); // Agrega la clase "dragging" para indicar que la imagen está siendo arrastrada
          },
          stop: function(event, ui) {
            ui.helper.removeClass('dragging'); // Remueve la clase "dragging" cuando la imagen deja de ser arrastrada
          }
        });
        
        // Agrega el código para que las divs de cada categoría de la tierlist sean droppables:
        $('.droppable').droppable({
          accept: '.draggable', // Sólo acepta elementos con la clase "draggable"
          hoverClass: 'hovered',
          drop: function(event, ui) {
                  // Obtener la altura de la tier en la que se ha soltado la película
                  var tierHeight = $(this).height();
            
            // Establecer la altura de la imagen de la película
            $(ui.draggable).height(tierHeight);
            $(ui.draggable).width("85px");
            var $this = $(this);
            var $movie = ui.draggable;
            $movie.detach().appendTo($this); // Mueve la imagen de la película a la categoría correspondiente
          }
        });
      });
              $.each(data.crew, function(index, movie) {
                if (movie.department === 'Directing' && movie.poster_path) {
                  var img = $('<img />').attr({
                    'src': 'https://image.tmdb.org/t/p/w185' + movie.poster_path,
                    'alt': movie.title,
                    'class': 'draggable' // Agrega la clase "draggable"
                  });
                  $('#portadas').append(img);
                }
              });
            }
          });
        }
      });
    }

    $('#director-input').autocomplete({
        source: function(request, response) {
            $.ajax({
              url: 'https://api.themoviedb.org/3/search/person',
              dataType: 'json',
              data: {
                api_key: 'b8eab5c8f5604ac06e5dc051de99718e',
                query: request.term
              },
              success: function(data) {
                var directors = $.map(data.results, function(result) {
                  return {
                    label: result.name,
                    value: result.name, // Cambiamos el valor por el nombre del director
                    id: result.id // Guardamos el id para usarlo en la siguiente petición AJAX
                  };
                });
                response(directors);
              }
            });
          },
          minLength: 2,
    
          select: function(event, ui) {
            $('#director-input').val(ui.item.label); // Actualizamos el valor del input con el nombre del director seleccionado
            var directorId = ui.item.id;
            $.ajax({
              url: 'https://api.themoviedb.org/3/person/' + directorId + '/movie_credits',
              dataType: 'json',
              data: {
                api_key: 'b8eab5c8f5604ac06e5dc051de99718e',
              },
              success: function(data) {
                $('#portadas').empty();
                $(function() {
          // Agrega el código para que las imágenes de las películas sean arrastrables:
          $('.draggable').draggable({
            revert: true, // La imagen volverá a su posición original si no es soltada en una categoría
            zIndex: 100,
            start: function(event, ui) {
              ui.helper.addClass('dragging'); // Agrega la clase "dragging" para indicar que la imagen está siendo arrastrada
            },
            stop: function(event, ui) {
              ui.helper.removeClass('dragging'); // Remueve la clase "dragging" cuando la imagen deja de ser arrastrada
            }
          });
          
          // Agrega el código para que las divs de cada categoría de la tierlist sean droppables:
          $('.droppable').droppable({
            accept: '.draggable', // Sólo acepta elementos con la clase "draggable"
            hoverClass: 'hovered',
            drop: function(event, ui) {
                    // Obtener la altura de la tier en la que se ha soltado la película
                    var tierHeight = $(this).height();
              
              // Establecer la altura de la imagen de la película
              $(ui.draggable).height(tierHeight);
              $(ui.draggable).width("85px");
              var $this = $(this);
              var $movie = ui.draggable;
              $movie.detach().appendTo($this); // Mueve la imagen de la película a la categoría correspondiente
            }
          });
        });
                $.each(data.crew, function(index, movie) {
                  if (movie.department === 'Directing' && movie.poster_path) {
                    var img = $('<img />').attr({
                      'src': 'https://image.tmdb.org/t/p/w185' + movie.poster_path,
                      'alt': movie.title,
                      'class': 'draggable' // Agrega la clase "draggable"
                    });
                    $('#portadas').append(img);
                  }
                });
              }
            });
          }
    });
    $('#portadas').droppable({
        accept: '.draggable', // Solo acepta elementos con la clase "draggable"
        hoverClass: 'hovered',
        drop: function(event, ui) {      
          // Establecer la altura de la imagen de la película
          $(ui.draggable).height("90px");
          
          // Mueve la imagen de la película debajo de la tierlist
          $(ui.draggable).detach().appendTo('#portadas');
        }
      });
      
  }, []);
  const handleReset = () => {
    // Selecciona todas las imágenes de películas dentro de las tierlist
    const $moviesInTierlist = $('.tierlist .draggable');
  
    // Mueve cada película de vuelta a la lista de portadas
    $moviesInTierlist.each(function() {
      $(this).height("90px"); // Establece la altura de la imagen
      $(this).detach().appendTo('#portadas'); // Mueve la imagen de vuelta a portadas
    });
  };
      
    return (
    <main>
      <div>
        <Link to="/" className="btn">Volver a inicio</Link>
      </div>
      <div id="divinput_tier">
        <input type="text" id="director-input" placeholder="Selecciona un director de la lista..."></input>
      </div>

      <div id="directores-predefinidos">
        <button class="director-button" data-director-id="138">Director 1</button>
        <button class="director-button" data-director-id="456">Director 2</button>
      </div>

      <div className="tierlist">
        <div className="tier" id="tierperfecta">
          <div className="title" id="perfecta">Perfecta</div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
        </div>
        <div className="tier" id="tierbuena">
          <div className="title" id="buena">Buena</div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
        </div>
        <div className="tier" id="tierregular">
          <div className="title" id="regular">Regular</div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
        </div>
        <div className="tier" id="tiermala">
          <div className="title" id="mala">Mala</div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
        </div>
        <div className="tier" id="tierpesima">
          <div className="title" id="pesima">Pésima</div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
          <div className="item droppable"></div>
        </div>
      </div>

      

      <div id="portadas"></div>

      <div id='div_vaciar'>
      <button onClick={handleReset} className='btn' id='vaciar_boton'>Vaciar Tierlist</button>
      </div>


    </main>
    );
  };
  
  export default Tierlist;   