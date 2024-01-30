const proximamenteElement = document.getElementById('proximamente-text');
let proximamenteTexto = '🚧 pagina en construcción';
let proximamenteIndice = 0;
let cursorVisible = false;

function escribirProximamente() {
    if (proximamenteIndice < proximamenteTexto.length) {
        proximamenteElement.textContent += proximamenteTexto.charAt(proximamenteIndice);
        proximamenteIndice++;
    } else {
        if (cursorVisible) {
            proximamenteElement.textContent = proximamenteElement.textContent.slice(0, -1);
            cursorVisible = false;
        } else {
            proximamenteElement.textContent += '_';
            cursorVisible = true;
        }
    }
    setTimeout(escribirProximamente, 200);
}

if(proximamenteElement){
    escribirProximamente();
}

document.getElementById("boton-volver").addEventListener("click", function() {
    window.location.href = "main.html";
});
