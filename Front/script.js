var id_usuario_logueado = 0;

async function existeUsuario() {
  const data = {
    nombre_usuario : document.getElementById("username").value,
    contraseña : document.getElementById("password").value
  }

  const response = await fetch('http://localhost:3000/usuarios',{
    method:"POST",
    headers: {
        "Content-Type": "application/json",
      },
    body:JSON.stringify(data),
  })

  console.log(response)
    //Tengo que usar el await porque la respuesta del servidor es lenta
    const result = await response.json()
    console.log(result)
    if (result.length==0) {
        console.log("El usuario no existe")
        return false
    } else {
        console.log("El usuario si existe")
        id_usuario_logueado = result[0].id_usuario
        return true
    }
}

//7
async function ingresarUsuario() {
  if (await existeUsuario() == true) {
    //Como hacer para que se guarde en la variable usuario_logueado el id del usuario;
    //changeScreen();
    alert("Haz ingresado")
    changeScreen()
  } else {
    alert("el usuario no existe o la contraseña no es correcta");
  }
}


//9
async function registrarNuevoUsuario() {
    const data = {
        nombre_usuario : document.getElementById("username").value,
        contraseña : document.getElementById("password").value
      }
    
      const response = await fetch('http://localhost:3000/insertarUsuario',{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
          },
        body:JSON.stringify(data),
      })
    
      console.log(response)
}


let indiceCeldaActual = 0;
document.addEventListener('DOMContentLoaded', () => {
    const celdas = document.querySelectorAll('.cell');

    celdas.forEach(celda => {
        celda.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
            if (e.target.value.length === 1) {
                moverACeldaSiguiente();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (id_usuario_logueado != 0) {
          
          
          if (e.key.match(/^[a-zA-Z]$/) && indiceCeldaActual < celdas.length) {
            celdas[indiceCeldaActual].value = e.key.toUpperCase();
            moverACeldaSiguiente();
          } else if (e.key === 'Backspace') {
            moverACeldaAnterior();
          }
        }
        });

    function moverACeldaSiguiente() {
         if (indiceCeldaActual < celdas.length - 1) {
            indiceCeldaActual++;
            console.log(indiceCeldaActual)
        }
    }

    function moverACeldaAnterior() {
        if (indiceCeldaActual > 0) {
            celdas[indiceCeldaActual].value = '';
            indiceCeldaActual--;
            celdas[indiceCeldaActual].focus();
        }
    }

    window.teclaPresionada = function(letra) {
        if (indiceCeldaActual < celdas.length) {
            celdas[indiceCeldaActual].value = letra;
            moverACeldaSiguiente();
        }
    }

    window.borrarLetra = function() {
        moverACeldaAnterior();
    }
});

let palabra_elegida = ""
let caracteres_palabra_elegida = []
async function elegirPalabra() {
    const response = await fetch('http://localhost:3000/obtenerPalabras',{
        method:"GET",
        headers: {
            "Content-Type": "application/json",
          },
    })

    console.log(response)
    //Tengo que usar el await porque la respuesta del servidor es lenta
    const result = await response.json()
    console.log(result)
    palabra_elegida = result[Math.floor(Math.random() * result.length)].palabra
    for (let i = 0; i < palabra_elegida.length; i++) {
      caracteres_palabra_elegida.push(palabra_elegida[i])
    }
    console.log(palabra_elegida)
    console.log(caracteres_palabra_elegida)
}

function chequearPalabra() {
  let palabra_chequeada = []
  let letras_faltantes = []
  const celdas = document.querySelectorAll('.cell');
  if ((indiceCeldaActual % 5)  == 0){
    if (celdas[indiceCeldaActual-5].value == caracteres_palabra_elegida[0]) {
      palabra_chequeada.push(".")
    } else {
      palabra_chequeada.push(caracteres_palabra_elegida[0])
      letras_faltantes.push(celdas[indiceCeldaActual-5].value)
    }
    if (celdas[indiceCeldaActual-4].value == caracteres_palabra_elegida[1]) {
      console.log("hola")
      palabra_chequeada.push(".")
    } else {
      palabra_chequeada.push(caracteres_palabra_elegida[1])
      console.log("hola2")
      letras_faltantes.push(celdas[indiceCeldaActual-4].value)
    }
    if (celdas[indiceCeldaActual-3].value == caracteres_palabra_elegida[2]) {
      palabra_chequeada.push(".")
    } else {
      palabra_chequeada.push(caracteres_palabra_elegida[2])
      letras_faltantes.push(celdas[indiceCeldaActual-3].value)
    }
    if (celdas[indiceCeldaActual-2].value == caracteres_palabra_elegida[3]) {
      palabra_chequeada.push(".")
    } else {
      palabra_chequeada.push(caracteres_palabra_elegida[3])
      letras_faltantes.push(celdas[indiceCeldaActual-2].value)
    }
    if (celdas[indiceCeldaActual-1].value == caracteres_palabra_elegida[4]) {
      palabra_chequeada.push(".")
    } else {
      palabra_chequeada.push(caracteres_palabra_elegida[4])
      letras_faltantes.push(celdas[indiceCeldaActual-1].value)
    }
    for (let i = 0; i < palabra_chequeada.length; i++) {
      if (palabra_chequeada[i]!=".") {
        if (palabra_chequeada.includes(letras_faltantes[i])) {
          palabra_chequeada[i] = "-"
        }
      }
    }
  }
  console.log(palabra_chequeada)
  console.log(letras_faltantes)
}