// URL con los datos de la película
const url = 'https://japceibal.github.io/japflix_api/movies-data.json';

let peliculas = [];

// Trae el listado de información sobre las películas.
fetch(url)
    .then(response => response.json())
    .then(data => { 
        peliculas = data;
        console.log('Las películas fueron cargadas con éxito', data);
    })
    .catch(error => {
        console.error('Error al cargar las películas', error);
    });

// Filtrar películas para la búsqueda.
document.getElementById('btnBuscar').addEventListener('click', () => {
    const query = document.getElementById('inputBuscar').value.trim().toLowerCase();
    if (query) {
        buscarPeliculas(query);
    }
});

const buscarPeliculas = (query) => {
    const resultados = peliculas.filter(pelicula => {
        return pelicula.title.toLowerCase().includes(query) ||
               pelicula.genres.some(genre => genre.name.toLowerCase().includes(query)) ||
               pelicula.tagline.toLowerCase().includes(query) ||
               pelicula.overview.toLowerCase().includes(query);
    });

    mostrarPeliculas(resultados);
};

// Mostrar los resultados de la búsqueda.
const mostrarPeliculas = (resultados) => {
    const lista = document.getElementById('lista'); // Contenedor que va a mostrar los resultados.
    lista.innerHTML = ''; // Limpia resultados anteriores.

    resultados.forEach(pelicula => {
        const listadoPelicula = document.createElement('li'); // Crea un elemento para cada película.
        listadoPelicula.classList.add('pelicula');

        listadoPelicula.innerHTML = `
            <div>
                <h2>${pelicula.title}</h2>
                <p>${pelicula.tagline}</p>
            </div>
        `;
        lista.appendChild(listadoPelicula); 
        listadoPelicula.appendChild(mostrarEstrellas(pelicula.vote_average));
    });
};

const mostrarEstrellas = (puntuacion) => {
    const estrellas = document.createElement('div');
    estrellas.classList.add('estrellas');
    const estrellasCompletas = Math.round(puntuacion);
    const estrellasIncompletas = 10 - estrellasCompletas;

    for (let i = 0; i < estrellasCompletas; i++) {
        const estrella = document.createElement('i');
        estrella.classList.add('fa', 'fa-star', 'text-warning');
        estrellas.appendChild(estrella);
    }

    for (let i = 0; i < estrellasIncompletas; i++) {
        const estrella = document.createElement('i');
        estrella.classList.add('fa', 'fa-star-o', 'text-warning');
        estrellas.appendChild(estrella);
    }

    return estrellas;
};

// Mostrar detalles de la película
document.addEventListener('click', function(evento) {
    const peliculaElement = evento.target.closest('.pelicula'); 

    if (peliculaElement) {
        const detalles = document.getElementById('detallesPelicula');
        detalles.style.display = 'block'; // Muestra el bloque

        // Obtener la película correspondiente
        const pelicula = peliculas.find(p => p.title === peliculaElement.querySelector('h2').innerText);

        // Cargar información de la película en el bloque
        const primerBloque = detalles.querySelector('.accordion-texto');
        primerBloque.innerHTML = `
            <h3>${pelicula.title}</h3>
            <p>${pelicula.overview}</p>
            <p><strong>Géneros:</strong> ${pelicula.genres.map(g => g.name).join(' - ')}</p>
        `;
        const segundoBloque = detalles.querySelector('.dropdown-menu');
        segundoBloque.innerHTML = `
            <p><strong>Año:</strong> ${pelicula.release_date.split('-')[0]}</p>
            <p><strong>Duración:</strong> ${pelicula.runtime} mins</p>
            <p><strong>Presupuesto:</strong> $${pelicula.budget}</p>
            <p><strong>Ingresos:</strong> $${pelicula.revenue}</p>
        `;
    }

    // Cerrar el bloque
    if (evento.target.classList.contains('close-button')) {
        const detalles = document.getElementById('detallesPelicula');
        detalles.style.display = 'none'; // Oculta el bloque
    }
});



       