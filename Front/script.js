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

async function existeNombreUsuario() {
  const data = {
    nombre_usuario : document.getElementById("username").value
  }

  const response = await fetch('http://localhost:3000/usuarioexiste',{
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
        return false
    } else {
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
      if (await existeNombreUsuario() == true) {
        alert("El nombre de usuario ya existe")
      } else {
        alert("Se ha registrado exitosamente")
        ingresarUsuario()
      }   
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
         if (indiceCeldaActual < celdas.length) {
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
  let numeroDeCelda = 0
  while(celdas[numeroDeCelda].value != "" && i < 6)
    {
      i++;
      numeroDeCelda = i * 5;
      if (numeroDeCelda >= 30) {
        numeroDeCelda = 29;
      }
    }

  comienzoFila = i - 1;
  //console.log("comienzo fila " + comienzoFila + " indiceCeldaActual: " + indiceCeldaActual)
  if ((indiceCeldaActual % 5)  == 0){
    console.log("comienzo fila " + comienzoFila + " indiceCeldaActual: " + indiceCeldaActual)
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
  console.log("Llego aca")
  console.log("Celda: " + celdas[29].value + " Contador: " + contador)
  if (contador==5) {
    setTimeout(() => {
      let i = 0
      while(i<6) {
        if (comienzoFila==i) {
          puntaje = 6-i
          partidas_ganadas++
          sumarPartidasYPuntajes()
        }
        i++;
      }
      alert("Haz ganado")
      changeScreen2()
    }, "1000");
  } else if (celdas[29].value != "" && contador!=5){
    setTimeout(() => {
      console.log("Retrasado por 1 segundo.");
      partidas_perdidas++;
      sumarPartidasYPuntajes()
      alert("Haz perdido")
      changeScreen2()
    }, "1000");
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

async function sumarPartidasGanadas() {
  const data = {
    partidas_ganadas: partidas_ganadas,
    id_usuario: id_usuario_logueado
 }

 const response = await fetch('http://localhost:3000/modificarUsuarioPartidasganadas',{
     method:"PUT",
     headers: {
         "Content-Type": "application/json",
       },
     body:JSON.stringify(data),
 })
 let result = await response.json()
 console.log(result.ganadas)
 document.getElementById("partidasganadas").innerHTML = result.ganadas
}

async function sumarPartidasPerdidas() {
  const data = {
    partidas_perdidas: partidas_perdidas,
    id_usuario: id_usuario_logueado
 }

 const response = await fetch('http://localhost:3000/modificarUsuarioPartidasperdidas',{
     method:"PUT",
     headers: {
         "Content-Type": "application/json",
       },
     body:JSON.stringify(data),
 })
 let result = await response.json()
 console.log({result})
 document.getElementById("partidasperdidas").innerHTML = result.perdidas
}

async function sumarPartidasYPuntajes() {
  await sumarPuntaje()
  await sumarPartidasGanadas()
  await sumarPartidasPerdidas()
}

async function reiniciarPartida() {
  const celdas = document.querySelectorAll('.cell');
  for (let i = 0; i < celdas.length; i++) {
    celdas[i].value = ""
    document.getElementById(i).readonly = false
    document.getElementById(i).disabled = false
    document.getElementById(i).style.background = "#ffffff"
  }
  indiceCeldaActual = 0
  palabra_elegida = ""
  caracteres_palabra_elegida = []
  await elegirPalabra()
}

function logout() {
  changeScreen3()
  id_usuario_logueado = 0
  reiniciarPartida()
}

function volverJugar() {
  changeScreen4()
  reiniciarPartida()
  puntaje = 0
  partidas_ganadas = 0
  partidas_perdidas = 0
}