// Animación de entrada para la descripción y las secciones
const descripcion = document.querySelector("#parrafo");

const secciones = document.querySelectorAll(".container-main .sections-main a");
secciones.forEach((seccion) => {
    seccion.style.animation = "entradaTexto 0.8s linear forwards";
});

// Agregar transición de color a las secciones
secciones.forEach((seccion) => {
    seccion.addEventListener("mouseover", function () {
        this.style.color = "#ff0000";
    });

    seccion.addEventListener("mouseout", function () {
        this.style.color = "#fff";
    });
});

// función para el efecto de "escritura" del párrafo
let textoParrafo = "Somos la sociedad secreta de productores musicales y beatmakers dedicada a ofrecer productos musicales de alta gama para cualquiera que los requiera...";
let k = 0; // indice para recorrer el texto del parrafo
let velocidadParrafo = 100; // ajusta la velocidad de escritura del parrafo

function escribirParrafo() {
    if (k < textoParrafo.length) {
        descripcion.textContent += textoParrafo.charAt(k);
        k++;
        setTimeout(escribirParrafo, velocidadParrafo);
    }
}

escribirParrafo(); // iniciamos la animación

// Tu función existente
var texto2 = "Sociedad Secreta del Ritmo";
var j = 0;
var velocidad = 500; // velocidad de la animación de escritura

function escribirTitulo() {
    if (j < texto2.length) {
        document.getElementById("titulo").innerHTML += texto2.charAt(j);
        j++;
        setTimeout(escribirTitulo, velocidad);
    }
}

// iniciamos la animación para el título
escribirTitulo();
