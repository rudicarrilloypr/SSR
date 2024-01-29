/*---------PAGINA INTRO---------*/
var texto2 = "Sociedad Secreta del Ritmo";
var enlace = "[entrar]";
var velocidad = 100; // Velocidad en milisegundos para cada letra
var j = 0;
var k = 0;

function escribirTitulo() {
    if (j < texto2.length) {
        document.getElementById("titulo").innerHTML += texto2.charAt(j);
        j++;
        setTimeout(escribirTitulo, velocidad);
    } else {
        document.getElementById("descubrir").style.display = "block";
        escribirEnlace();
    }
}

function escribirEnlace() {
    if (k < enlace.length) {
        document.getElementById("descubrir").innerHTML += enlace.charAt(k);
        k++;
        setTimeout(escribirEnlace, velocidad);
    } else {
        document.getElementById("descubrir").style.cursor = "pointer";
        document.getElementById("descubrir").addEventListener('click', function() {
            window.location.href = "main.html";
        });
    }
}

escribirTitulo();
