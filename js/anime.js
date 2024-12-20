async function getAnimeJSON(slug) {
    // URL del endpoint que devuelve un JSON
    const url = "https://animeflv.ahmedrangel.com/api/anime/";

    try {
        const response = await fetch(url + slug); // Espera la respuesta de la solicitud
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const data = await response.json(); // Convierte la respuesta a JSON
        return data; // Devuelve el JSON para que se pueda usar
    } catch (error) {
        console.error("Hubo un problema con el fetch:", error);
        return null; // Devuelve null en caso de error
    }
}

async function cargarAnime(slug) {
    // Asegurarse de que la función buscarAnimeEnApi esté disponible
    if (typeof getAnimeJSON === 'function') {
        
        var resultado = await getAnimeJSON(slug); // Esperar el resultado de getAnimeJSON

        // Verifica si se obtuvo un resultado válido
        if (!resultado) {
            console.error('No se pudo obtener el JSON');
            window.location.href = 'index.html';
            return;
        }

        console.log(resultado);

        // TITULO
        const titulo = document.querySelector('h2.accordion-header button.accordion-button strong');
        titulo.innerHTML = resultado.data.title;

        // SINOPSIS
        const sinopsis = document.querySelector('p.sinopsis');
        sinopsis.innerHTML = resultado.data.synopsis;

        // COVER
        const cover = document.querySelector('img.card-img-top');
        cover.setAttribute('src', resultado.data.cover); 

        // TIPO
        const tipo = document.querySelector('div.overlay-text');
        if (resultado.data.type.toUpperCase() == "OVA".toUpperCase()) {
            tipo.classList.add("bg-warning");
        } else if (resultado.data.type.toUpperCase() == "Película".toUpperCase()) {
            tipo.classList.add("bg-danger");
        } else if (resultado.data.type.toUpperCase() == "Anime".toUpperCase()) {
            tipo.classList.add("bg-primary");
        } else if (resultado.data.type.toUpperCase() == "Especial".toUpperCase()) {
            tipo.classList.add("bg-success");
        } else {
            tipo.classList.add("bg-secondary");
        }
        tipo.innerHTML = resultado.data.type.toUpperCase();

        // ESTADO
        const estado = document.querySelector('div.card-body button.estado-btn');
        if (resultado.data.status.toUpperCase() == "Finalizado".toUpperCase()) {
            estado.classList.add('bg-danger');
        } else if (resultado.data.status.toUpperCase() == "Proximamente".toUpperCase()) {
            estado.classList.add('bg-warning');
        } else {
            estado.classList.add('bg-success');
        }
        estado.innerHTML = resultado.data.status.toUpperCase();

        // ETIQUETAS
        const contenedor = document.querySelector('div.tags');
        contenedor.innerHTML = "";

        if (resultado.data.genres) {
            resultado.data.genres.forEach((eti) => {
                const span = document.createElement('span');
                span.classList.add('badge', 'bg-secondary');
                span.innerHTML = `${eti}`;
                contenedor.appendChild(span);
            });
        } else {
            console.error('No se encontró el array de etiquetas.');
        }

        // EPISODIOS
        const episodiosContenedor = document.querySelector('div.card-body ul.list-group');
        episodiosContenedor.innerHTML = "";

        if (resultado.data.episodes) {
            resultado.data.episodes.reverse().forEach((epi) => {
                const a = document.createElement('a');
                a.classList.add('list-group-item', 'list-group-item-action', 'text-decoration-none', 'text-white');
                a.setAttribute('href', 'watch.html?a=' + slug + '&e=' + epi.number);
                a.innerHTML = `<i class="fa-solid fa-play"></i>&nbsp;&nbsp;&nbsp;${epi.number}`;
                episodiosContenedor.appendChild(a);
            });
        } else {
            console.error('No se encontró el array de episodios.');
        }

        // TERMINAR CON EL LOADING
        let loadingRow = document.querySelector("div.row.loading");
        if (loadingRow) {
            loadingRow.classList.add("d-none");
            document.querySelector("div.row.contenido").classList.remove("d-none");
        }

    } else {
        console.error('La función getAnimeJSON no está definida');
    }
} 

// Detectar el parámetro "q" en la URL al cargar la página
window.onload = function() {
    const params = new URLSearchParams(window.location.search); // Obtener parámetros de la URL
    const slug = params.get('a'); // Buscar el parámetro 'a'

    if (!slug) {
        // Si no se encuentra el parámetro 'a', redirigir a index.html
        window.location.href = 'index.html';
    } else {
        // Si el parámetro 'a' existe, realizar la búsqueda y cargar el anime
        //llamarApiAnimeflv(query);
        cargarAnime(slug);
    }
};
