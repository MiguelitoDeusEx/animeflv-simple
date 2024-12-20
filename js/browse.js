async function getAnimesJSON(query, page) {
    // URL del endpoint que devuelve un JSON
    const urlq = "https://animeflv.ahmedrangel.com/api/search?query=";
    const urlp = "&page=";

    try {
        const response = await fetch(urlq + query + urlp + page); // Espera la respuesta de la solicitud
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

async function cargarAnimes(query, page = 1) {
    // Asegurarse de que la función buscarAnimeEnApi esté disponible
    if (typeof getAnimesJSON === 'function') {
        
        var resultado = await getAnimesJSON(query, page); // Esperar el resultado de getAnimesJSON

        // Verifica si se obtuvo un resultado válido
        if (!resultado) {
            console.error('No se pudo obtener el JSON');
            //window.location.href = 'index.html';
            return;
        }

        console.log(resultado);

        var contenedor = document.querySelector('.container .row');
        contenedor.innerHTML = "";

        if (resultado && resultado.data) {
            // Recorremos solo la parte de los animes
            resultado.data.media.forEach((anime) => {
                const div = document.createElement('div'); // Crear un nuevo div
                div.classList.add('col-md-3', 'mb-4'); // Añadir clases de Bootstrap para diseño de columnas
                
                var coloretiqueta = "bg-secondary";

                if (anime.type.toUpperCase() == "OVA".toUpperCase()) {
                    coloretiqueta = "bg-warning";
                } else if (anime.type.toUpperCase() == "Película".toUpperCase()) {
                    coloretiqueta = "bg-danger";
                } else if (anime.type.toUpperCase() == "Anime".toUpperCase()) {
                    coloretiqueta = "bg-primary";
                } else if (anime.type.toUpperCase() == "Especial".toUpperCase()) {
                    coloretiqueta = "bg-success";
                } else {
                    coloretiqueta = "bg-secondary";
                }


                div.innerHTML = `
                    <a href="anime.html?a=${anime.slug}" class="text-decoration-none">
                        <div class="card result-card">
                            <img src="${anime.cover}" alt="${anime.title}" class="card-img-top">
                            <div class="overlay-text ${coloretiqueta}">${anime.type.toUpperCase()}</div>
                        </div>
                        <div class="text-center mt-2 titulo">${anime.title}</div>
                    </a>
                `;

                contenedor.appendChild(div); // Agregar el nuevo div al contenedor
            });
        } else {
            console.error('No se encontró el array de animes.');
        }

        contenedor = document.querySelector('.pagination');
        contenedor.innerHTML = "";

        if (resultado.data.foundPages && resultado.data.foundPages > 1) {

            for (let i = 1; i <= resultado.data.foundPages; i++) {
                const li = document.createElement('li');
                if(resultado.data.currentPage == i) {
                    li.classList.add('page-item', 'disabled');
                    li.innerHTML = `
                        <a class="page-link bg-primary" href="browse.html?q=${query}&page=${resultado.data.currentPage}">${resultado.data.currentPage}</a>
                    `;
                } else {
                    li.classList.add('page-item');
                    li.innerHTML = `
                        <a class="page-link" href="browse.html?q=${query}&page=${i}">${i}</a>
                    `;
                }
                
                contenedor.appendChild(li);
            }
           
        } else {
            console.error('No se encontró el array de animes.');
        }

    } else {
        console.error('La función getAnimesJSON no está definida');
    }
} 


window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q'); 
    var page = params.get('page');

    page = page == null ? 1 : page;
    
    if (!query) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('searchInput').value = query; // Establecer el valor del campo de búsqueda
        cargarAnimes(query, page);
    }
};
