function loadIframe(url) {
    document.getElementById('videoIframe').src = url;
}

async function getEpisodeJSON(slug, episode) {
    // URL del endpoint que devuelve un JSON
    const urla = "https://animeflv.ahmedrangel.com/api/anime/";
    const urle = "/episode/";

    try {
        const response = await fetch(urla + slug + urle + episode); // Espera la respuesta de la solicitud
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const data = await response.json(); // Convierte la respuesta a JSON
        return data; // Devuelve el JSON para que se pueda usar
    } catch (error) {
        //console.error("Hubo un problema con el fetch:", error);
        return null; // Devuelve null en caso de error
    }
}

async function cargarEpisodio(slug, episode) {
    // Asegurarse de que la función buscarAnimeEnApi esté disponible
    if (typeof getEpisodeJSON === 'function') {
        
        var resultado = await getEpisodeJSON(slug, episode); // Esperar el resultado de getAnimeJSON
        

        // Verifica si se obtuvo un resultado válido
        if (!resultado) {
            console.error('No se pudo obtener el JSON');
            window.location.href = 'anime.html?a=' + slug;
            return;
        }

        var contenedorOpciones = document.querySelector('div.botonera'); 
        contenedorOpciones.innerHTML = "";

        if (resultado && resultado.data.servers) {

            // TITULO
            const titulo = document.querySelector('h1.text-white');
            titulo.innerHTML = resultado.data.title;

            // EPISODIO
            const episodio = document.querySelector('h2.text-gray');
            episodio.innerHTML = "Episodio " + episode;
            
            // OPCIONES
            resultado.data.servers.forEach((opcion, index) => {
                if (opcion.embed) {
                    const btn = document.createElement('btn');
                    btn.setAttribute('type', 'button'); 
                    btn.setAttribute('onclick', `loadIframe('` + opcion.embed + `')`); 
                    btn.classList.add('btn','btn-dark', 'btn-sm');
                    btn.innerHTML = opcion.name;
                    
                    if (index == 0) {
                        document.getElementById('videoIframe').setAttribute('src', opcion.embed);
                    }

                    contenedorOpciones.appendChild(btn); 
                }
            });

             // TERMINAR CON EL LOADING
            // Buscar el elemento con la clase "loading"
            let loadingRow = document.querySelector("div.row.loading");
            // Verificar si el elemento existe y ocultarlo
            if (loadingRow) {
                document.querySelectorAll(".container div.row").forEach((div) => {
                    div.classList.remove("d-none");
                });
                loadingRow.classList.add("d-none");
            }


            // PAGINACION
            var btnLista = document.querySelector('a.lista');
            btnLista.setAttribute('href', 'anime.html?a=' + slug); 

            var resSig = await getEpisodeJSON(slug, parseInt(episode, 10) + 1);

            var btnAnterior = document.querySelector('a.anterior');
            var btnSiguiente = document.querySelector('a.siguiente');

            if ((parseInt(episode, 10) - 1) > 0) {
                btnAnterior.setAttribute('href', 'watch.html?a=' + slug + '&e=' + (parseInt(episode, 10)-1)); 
                btnAnterior.classList.remove("d-none");
            }
            if (resSig) {
                btnSiguiente.setAttribute('href', 'watch.html?a=' + slug + '&e=' + (parseInt(episode, 10)+1)); 
                btnSiguiente.classList.remove("d-none");
            }
            
            
        } else {
            console.error('No se encontró data');
        }

       

    } else {
        console.error('La función getEpisodeJSON no está definida');
    }
} 

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('a');
    const episode = params.get('e');

    if (!slug) {
        window.location.href = 'index.html';
    } if (!episode) {
        window.location.href = 'anime.html?a=' + a;
    } else {
        cargarEpisodio(slug, episode);
    }
};

document.addEventListener('click', function (e) {
    // Evita clics que intenten abrir nuevas ventanas
    if (e.target.tagName === 'IFRAME') {
        e.preventDefault();
        e.stopPropagation();
        console.log('Intento de clic en iframe bloqueado.');
    }
}, true);