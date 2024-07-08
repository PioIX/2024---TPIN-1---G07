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
    elegirPalabra()
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
      ingresarUsuario()
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
            chequearPalabra();
        }
    }

    function moverACeldaAnterior() {
      let multiplo = indiceCeldaActual % 5
        if (indiceCeldaActual > 0 && multiplo != 0) {
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

let puntaje = 0
let partidas_ganadas = 0
let partidas_perdidas = 0
function chequearPalabra() {
  let palabra_chequeada = []
  let letras_faltantes = []
  let celdas2 = []
  const celdas = document.querySelectorAll('.cell');
  let comienzoFila = 0;
  let i = 0;
  while(celdas[i * 5].value != "" && i < 5)
    i++;
  comienzoFila = i - 1;

  if ((indiceCeldaActual % 5)  == 0){
    for (let i = (comienzoFila * 5); i < ((comienzoFila * 5) + 5); i++) {
      celdas2.push(celdas[i].value)
    }
    for (let i = 0; i < 5; i++) {
      document.getElementById(i+(5*comienzoFila)).readonly = true
      document.getElementById(i+(5*comienzoFila)).disabled = true
      if (celdas[indiceCeldaActual-(5 - i)].value == caracteres_palabra_elegida[i]) {
        palabra_chequeada.push(".")
        celdas2[i] = "."
        document.getElementById(i+(5*comienzoFila)).style.background = "#00ff00"
      } else {
        palabra_chequeada.push(caracteres_palabra_elegida[i])
        letras_faltantes.push(celdas[indiceCeldaActual-(5 - i)].value)
      }
    }
    for (let i = 0; i < celdas2.length; i++) {
      if (palabra_chequeada[i]!=".") {
        console.log(`Voy a chequear ${celdas2[i]} pos ${i}`)
        if (palabra_chequeada.includes(celdas2[i])) {

          console.log(celdas2)
          let indice = palabra_chequeada.indexOf(celdas2[i])
          document.getElementById(i+(5*comienzoFila)).style.background = "#ffff00"
          palabra_chequeada[indice] = "-"
          console.log(`Celdas 2 quedo `, celdas2)
        }
      }
    }
  }
  let contador = 0; 

  for (let i = 0; i < palabra_chequeada.length; i++) {
    if (palabra_chequeada[i]==".")
      contador++;
  }

  if (contador==5) {
    let i = 0
    while(i<6) {
      if (comienzoFila==i) {
        puntaje = 6-i
        sumarPuntaje()
        partidas_ganadas++
      }
      i++;
    }
    alert("Haz ganado")
    changeScreen2()
  } else if (comienzoFila==6 && contador!=5){
    partidas_perdidas++;
    alert("Haz perdido")
    changeScreen2()
  }
  console.log(palabra_chequeada)
  console.log(letras_faltantes)
}

async function sumarPuntaje() {
  const data = {
    puntaje_usuario: puntaje,
    id_usuario: id_usuario_logueado
 }

 const response = await fetch('http://localhost:3000/modificarUsuarioPuntaje',{
     method:"PUT",
     headers: {
         "Content-Type": "application/json",
       },
     body:JSON.stringify(data),
 })
 let result = await response.json()
 console.log(result.puntaje)
 document.getElementById("puntajetotal").innerHTML = result.puntaje
}