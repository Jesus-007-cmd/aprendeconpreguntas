import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import './QuizApp.css';

const questionsData =[
  {
    "Question Text": "What does \"age\" mean in English?",
    "Option 1": "tiempo",
    "Option 2": "historia",
    "Option 3": "siglos",
    "Correct Answer": "edad"
  },
  {
    "Question Text": "How do you say \"appear\" in English?",
    "Option 1": "desaparecer",
    "Option 2": "aparecer",
    "Option 3": "ocultar",
    "Correct Answer": "aparecer"
  },
  {
    "Question Text": "What is the English word for \"artist\"?",
    "Option 1": "escritor",
    "Option 2": "músico",
    "Option 3": "artista",
    "Correct Answer": "artista"
  },
  {
    "Question Text": "What is the English word for \"autumn\"?",
    "Option 1": "primavera",
    "Option 2": "verano",
    "Option 3": "otoño",
    "Correct Answer": "otoño",
    "pronunciacion": "aruom"
  },
  {
    "Question Text": "How do you say a large body of water partially enclosed by \"bay\" in English?",
    "Option 1": "lago",
    "Option 2": "océano",
    "Option 3": "baya",
    "Correct Answer": "bahía",
    "pronunciacion": "bei"
  },
  {
    "Question Text": "What is the English word for the part of a bird that is its \"beak\"?",
    "Option 1": "ala",
    "Option 2": "cola",
    "Option 3": "bistek",
    "Correct Answer": "pico"
  },
  {
    "Question Text": "What do flowers do when they \"bloom\" in English?",
    "Option 1": "caen",
    "Option 2": "marchitan",
    "Option 3": "florecen",
    "Correct Answer": "florecer"
  },
  {
    "Question Text": "What is the English word for \"bumpy\"?",
    "Option 1": "liso",
    "Option 2": "brillante",
    "Option 3": "esponjoso",
    "Correct Answer": "abultado"
  },
  {
    "Question Text": "What happens when something suddenly \"bursts\" open in English?",
    "Option 1": "cae",
    "Option 2": "dobla",
    "Option 3": "rompe",
    "Correct Answer": "estalla (o rompe)",
    "pronunciacion": "borst"
  },
  {
    "Question Text": "What is the \"buzz\" that bees make in English?",
    "Option 1": "cantar",
    "Option 2": "zumbido",
    "Option 3": "rugido",
    "Correct Answer": "zumbido",
    "pronunciacion": "baz"
  },
  {
    "Question Text": "What does \"care\" mean in English?",
    "Option 1": "cuidado",
    "Option 2": "carrera",
    "Option 3": "cartera",
    "Correct Answer": "cuidado"
  },
  {
    "Question Text": "How do you say \"check\" in English?",
    "Option 1": "cheque",
    "Option 2": "revisar",
    "Option 3": "chocar",
    "Correct Answer": "revisar"
  },
  {
    "Question Text": "What is the English word for \"chilly\"?",
    "Option 1": "caliente",
    "Option 2": "picante",
    "Option 3": "dulce",
    "Correct Answer": "fresco, relajado",
    "pronunciacion": "chiol"
  },
  {
    "Question Text": "What is the English word for \"chore\"?",
    "Option 1": "trabajo",
    "Option 2": "nucleo",
    "Option 3": "deber",
    "Correct Answer": "tarea",
    "pronunciacion": "coor",
    "__EMPTY": "tarea en casa trabajo"
  },
  {
    "Question Text": "How do you say \"comfort\" in English?",
    "Option 1": "confort",
    "Option 2": "fortalecer",
    "Option 3": "confusión",
    "Correct Answer": "comodidad"
  },
  {
    "Question Text": "What is the English word for \"community\"?",
    "Option 1": "comunicar",
    "Option 2": "asociacion",
    "Option 3": "compañía",
    "Correct Answer": "comunidad",
    "pronunciacion": "comuiniry"
  },
  {
    "Question Text": "How do you say \"country\" in English?",
    "Option 1": "continente",
    "Option 2": "condición",
    "Option 3": "ciudad",
    "Correct Answer": "pais, campo"
  },
  {
    "Question Text": "What is the English word for \"covered\"?",
    "Option 1": "cubierto",
    "Option 2": "descubierto",
    "Option 3": "cerrado",
    "Correct Answer": "cubierto, portada",
    "pronunciacion": "converrd",
    "__EMPTY": "esa caja esta cubierta, the coverd of the book"
  },
  {
    "Question Text": "What is the English word for \"cradle\"?",
    "Option 1": "cama",
    "Option 2": "silla",
    "Option 3": "sillon",
    "Correct Answer": "cuna",
    "pronunciacion": "cradol"
  },
  {
    "Question Text": "How do you say \"dangle\" in English?",
    "Option 1": "balancear",
    "Option 2": "peligroso",
    "Option 3": "brillar",
    "Correct Answer": "colgar",
    "pronunciacion": "dangl"
  },
  {
    "Question Text": "What is the English word for \"decision\"?",
    "Option 1": "desviación",
    "Option 2": "oportunidad",
    "Option 3": "dicción",
    "Correct Answer": "decisión"
  },
  {
    "Question Text": "How do you say \"delicious\" in English?",
    "Option 1": "Delicia",
    "Option 2": "peligroso",
    "Option 3": "delirante",
    "Correct Answer": "delicioso"
  },
  {
    "Question Text": "What is the English word for \"dentist\"?",
    "Option 1": "doctor",
    "Option 2": "enfermero",
    "Option 3": "médico",
    "Correct Answer": "dentista"
  },
  {
    "Question Text": "What is the English word for \"dew\"?",
    "Option 1": "niebla",
    "Option 2": "lluvia",
    "Option 3": "escarcha",
    "Correct Answer": "rocío",
    "pronunciacion": "diu"
  },
  {
    "Question Text": "How do you say \"disappear\" in English?",
    "Option 1": "aparecer",
    "Option 2": "esfumarse",
    "Option 3": "evaporarse",
    "Correct Answer": "desaparecer",
    "pronunciacion": "disapier"
  },
  {
    "Question Text": "What is the English word for a \"drawer\"?",
    "Option 1": "ventana",
    "Option 2": "armario",
    "Option 3": "escritorio",
    "Correct Answer": "cajón",
    "pronunciacion": "drawer"
  },
  {
    "Question Text": "What is the English word for \"dusty\"?",
    "Option 1": "sucio",
    "Option 2": "arenoso",
    "Option 3": "opaco",
    "Correct Answer": "polvoriento"
  },
  {
    "Question Text": "How do you say \"edge\" in English?",
    "Option 1": "margen",
    "Option 2": "final",
    "Option 3": "frontera",
    "Correct Answer": "borde, esquina"
  },
  {
    "Question Text": "What is the English word for a \"farmer\"?",
    "Option 1": "ganadero",
    "Option 2": "campesino",
    "Option 3": "agricultor",
    "Correct Answer": "granjero"
  },
  {
    "Question Text": "How do you say \"fear\" in English?",
    "Option 1": "temor",
    "Option 2": "ansiedad",
    "Option 3": "pánico",
    "Correct Answer": "miedo"
  },
  {
    "Question Text": "What is the English word for a \"firefly\"?",
    "Option 1": "lucero",
    "Option 2": "avispa",
    "Option 3": "mariposa",
    "Correct Answer": "luciérnaga",
    "pronunciacion": "fairefly"
  },
  {
    "Question Text": "How do you say \"fix\" in English?",
    "Option 1": "fixiar",
    "Option 2": "romper",
    "Option 3": "dañar",
    "Correct Answer": "arreglar"
  },
  {
    "Question Text": "What is the English word for \"flipper\"?",
    "Option 1": "suave",
    "Option 2": "aletear",
    "Option 3": "esponjoso",
    "Correct Answer": "aleta"
  },
  {
    "Question Text": "What is the English word for \"fluffy\"?",
    "Option 1": "esponjoso",
    "Option 2": "suave",
    "Option 3": "áspero",
    "Correct Answer": "esponjoso"
  },
  {
    "Question Text": "How do you say \"follow\" in English?",
    "Option 1": "liderar",
    "Option 2": "seguir",
    "Option 3": "adelantar",
    "Correct Answer": "seguir"
  },
  {
    "Question Text": "What is the English word for \"gallop\"?",
    "Option 1": "galope",
    "Option 2": "saltar",
    "Option 3": "arrastrarse",
    "Correct Answer": "galope"
  },
  {
    "Question Text": "How do you say \"gentle\" in English?",
    "Option 1": "fuerte",
    "Option 2": "suave",
    "Option 3": "ruidoso",
    "Correct Answer": "suave"
  },
  {
    "Question Text": "What is the English word for \"giggle\"?",
    "Option 1": "llorar",
    "Option 2": "reír",
    "Option 3": "gritar",
    "Correct Answer": "reír"
  },
  {
    "Question Text": "How do you say \"glance\" in English?",
    "Option 1": "mirar fijamente",
    "Option 2": "echar un vistazo",
    "Option 3": "ignorar",
    "Correct Answer": "echar un vistazo"
  },
  {
    "Question Text": "What is the English word for \"glossy\"?",
    "Option 1": "mate",
    "Option 2": "brillante",
    "Option 3": "áspero",
    "Correct Answer": "brillante"
  },
  {
    "Question Text": "How do you say \"glow\" in English?",
    "Option 1": "apagar",
    "Option 2": "brillar",
    "Option 3": "oscurecer",
    "Correct Answer": "brillar"
  },
  {
    "Question Text": "What is the English word for \"goal\"?",
    "Option 1": "objetivo",
    "Option 2": "sueño",
    "Option 3": "misión",
    "Correct Answer": "objetivo"
  },
  {
    "Question Text": "How do you say \"healthy\" in English?",
    "Option 1": "enfermo",
    "Option 2": "saludable",
    "Option 3": "cansado",
    "Correct Answer": "saludable"
  },
  {
    "Question Text": "What is the English word for \"half\"?",
    "Option 1": "mitad",
    "Option 2": "doble",
    "Option 3": "completo",
    "Correct Answer": "mitad"
  },
  {
    "Question Text": "How do you say \"herd\" in English?",
    "Option 1": "hambre",
    "Option 2": "grupo",
    "Option 3": "rebaño",
    "Correct Answer": "rebaño"
  },
  {
    "Question Text": "What is the English word for \"hoof\"?",
    "Option 1": "cabeza",
    "Option 2": "pata",
    "Option 3": "pezuña",
    "Correct Answer": "pezuña"
  },
  {
    "Question Text": "How do you say \"include\" in English?",
    "Option 1": "excluir",
    "Option 2": "incluir",
    "Option 3": "confundir",
    "Correct Answer": "incluir"
  },
  {
    "Question Text": "What is the English word for \"invitation\"?",
    "Option 1": "invitación",
    "Option 2": "pregunta",
    "Option 3": "respuesta",
    "Correct Answer": "invitación"
  },
  {
    "Question Text": "How do you say \"knight\" in English?",
    "Option 1": "caballero",
    "Option 2": "dragón",
    "Option 3": "mago",
    "Correct Answer": "caballero"
  },
  {
    "Question Text": "What is the English word for \"laundry\"?",
    "Option 1": "lavandería",
    "Option 2": "cocina",
    "Option 3": "jardín",
    "Correct Answer": "lavandería"
  },
  {
    "Question Text": "How do you say \"lazy\" in English?",
    "Option 1": "activo",
    "Option 2": "perezoso",
    "Option 3": "inteligente",
    "Correct Answer": "perezoso"
  },
  {
    "Question Text": "What is the English word for \"leaf\"?",
    "Option 1": "hoja",
    "Option 2": "flor",
    "Option 3": "fruta",
    "Correct Answer": "hoja"
  },
  {
    "Question Text": "How do you say \"leak\" in English?",
    "Option 1": "fuga",
    "Option 2": "gota",
    "Option 3": "estanque",
    "Correct Answer": "fuga"
  },
  {
    "Question Text": "What is the English word for \"library\"?",
    "Option 1": "biblioteca",
    "Option 2": "escuela",
    "Option 3": "parque",
    "Correct Answer": "biblioteca"
  },
  {
    "Question Text": "How do you say \"market\" in English?",
    "Option 1": "mercado",
    "Option 2": "tienda",
    "Option 3": "playa",
    "Correct Answer": "mercado"
  },
  {
    "Question Text": "What is the English word for \"market\"?",
    "Option 1": "mercado",
    "Option 2": "tienda",
    "Option 3": "playa",
    "Correct Answer": "mercado"
  },
  {
    "Question Text": "How do you say \"melt\" in English?",
    "Option 1": "derretir",
    "Option 2": "romper",
    "Option 3": "hervir",
    "Correct Answer": "derretir"
  },
  {
    "Question Text": "What is the English word for \"miserable\"?",
    "Option 1": "alegre",
    "Option 2": "miserable",
    "Option 3": "emocionado",
    "Correct Answer": "miserable"
  },
  {
    "Question Text": "How do you say \"month\" in English?",
    "Option 1": "semana",
    "Option 2": "día",
    "Option 3": "mes",
    "Correct Answer": "mes"
  },
  {
    "Question Text": "What is the English word for \"muddy\"?",
    "Option 1": "fangoso",
    "Option 2": "rocoso",
    "Option 3": "arenoso",
    "Correct Answer": "fangoso"
  },
  {
    "Question Text": "How do you say \"museum\" in English?",
    "Option 1": "biblioteca",
    "Option 2": "teatro",
    "Option 3": "museo",
    "Correct Answer": "museo"
  },
  {
    "Question Text": "What is the English word for \"note\"?",
    "Option 1": "nota",
    "Option 2": "mensaje",
    "Option 3": "carta",
    "Correct Answer": "nota"
  },
  {
    "Question Text": "How do you say \"pace\" in English?",
    "Option 1": "ritmo",
    "Option 2": "espacio",
    "Option 3": "paso",
    "Correct Answer": "paso"
  },
  {
    "Question Text": "What is the English word for \"pair\"?",
    "Option 1": "par",
    "Option 2": "parar",
    "Option 3": "pareja",
    "Correct Answer": "par"
  },
  {
    "Question Text": "How do you say \"patient\" in English?",
    "Option 1": "paciente",
    "Option 2": "impaciente",
    "Option 3": "médico",
    "Correct Answer": "paciente"
  },
  {
    "Question Text": "What is the English word for \"peaceful\"?",
    "Option 1": "pacífico",
    "Option 2": "violento",
    "Option 3": "ruidoso",
    "Correct Answer": "pacífico"
  },
  {
    "Question Text": "How do you say \"peck\" in English?",
    "Option 1": "picar",
    "Option 2": "lamer",
    "Option 3": "morder",
    "Correct Answer": "picar"
  },
  {
    "Question Text": "What is the English word for \"pilot\"?",
    "Option 1": "conductor",
    "Option 2": "piloto",
    "Option 3": "pasajero",
    "Correct Answer": "piloto"
  },
  {
    "Question Text": "How do you say \"plan\" in English?",
    "Option 1": "pensar",
    "Option 2": "planear",
    "Option 3": "jugar",
    "Correct Answer": "planear"
  },
  {
    "Question Text": "What is the English word for \"pointy\"?",
    "Option 1": "puntiagudo",
    "Option 2": "redondo",
    "Option 3": "cuadrado",
    "Correct Answer": "puntiagudo"
  },
  {
    "Question Text": "How do you say \"polite\" in English?",
    "Option 1": "rudo",
    "Option 2": "educado",
    "Option 3": "grosero",
    "Correct Answer": "educado"
  },
  {
    "Question Text": "What is the English word for \"pond\"?",
    "Option 1": "estanque",
    "Option 2": "río",
    "Option 3": "lago",
    "Correct Answer": "estanque"
  },
  {
    "Question Text": "How do you say \"president\" in English?",
    "Option 1": "presidente",
    "Option 2": "rey",
    "Option 3": "líder",
    "Correct Answer": "presidente"
  },
  {
    "Question Text": "What is the English word for \"protect\"?",
    "Option 1": "dañar",
    "Option 2": "cuidar",
    "Option 3": "romper",
    "Correct Answer": "cuidar"
  },
  {
    "Question Text": "How do you say \"proud\" in English?",
    "Option 1": "orgulloso",
    "Option 2": "triste",
    "Option 3": "feliz",
    "Correct Answer": "orgulloso"
  },
  {
    "Question Text": "What is the English word for \"race\"?",
    "Option 1": "raza",
    "Option 2": "lucha",
    "Option 3": "competencia",
    "Correct Answer": "carrera"
  },
  {
    "Question Text": "How do you say \"reach\" in English?",
    "Option 1": "agarrar",
    "Option 2": "alcanzar",
    "Option 3": "esconder",
    "Correct Answer": "alcanzar"
  },
  {
    "Question Text": "What is the English word for \"relax\"?",
    "Option 1": "tensar",
    "Option 2": "relajar",
    "Option 3": "apretar",
    "Correct Answer": "relajar"
  },
  {
    "Question Text": "How do you say \"rotten\" in English?",
    "Option 1": "fresco",
    "Option 2": "podrido",
    "Option 3": "dulce",
    "Correct Answer": "podrido"
  },
  {
    "Question Text": "What is the English word for \"round\"?",
    "Option 1": "cuadrado",
    "Option 2": "redondo",
    "Option 3": "triangular",
    "Correct Answer": "redondo"
  },
  {
    "Question Text": "How do you say \"row\" in English?",
    "Option 1": "fila",
    "Option 2": "saltar",
    "Option 3": "rodar",
    "Correct Answer": "fila"
  },
  {
    "Question Text": "What is the English word for \"sail\"?",
    "Option 1": "nadar",
    "Option 2": "volar",
    "Option 3": "navegar",
    "Correct Answer": "navegar"
  },
  {
    "Question Text": "How do you say \"scene\" in English?",
    "Option 1": "escena",
    "Option 2": "sonido",
    "Option 3": "olor",
    "Correct Answer": "escena"
  },
  {
    "Question Text": "What is the English word for \"scrub\"?",
    "Option 1": "fregar",
    "Option 2": "arañar",
    "Option 3": "limpiar",
    "Correct Answer": "fregar"
  },
  {
    "Question Text": "How do you say \"shade\" in English?",
    "Option 1": "sombra",
    "Option 2": "luz",
    "Option 3": "calor",
    "Correct Answer": "sombra"
  },
  {
    "Question Text": "What is the English word for \"shaky\"?",
    "Option 1": "fuerte",
    "Option 2": "inmóvil",
    "Option 3": "tembloroso",
    "Correct Answer": "tembloroso"
  },
  {
    "Question Text": "How do you say \"ship\" in English?",
    "Option 1": "avión",
    "Option 2": "barco",
    "Option 3": "coche",
    "Correct Answer": "barco"
  },
  {
    "Question Text": "What is the English word for \"shore\"?",
    "Option 1": "costa",
    "Option 2": "desierto",
    "Option 3": "montaña",
    "Correct Answer": "costa"
  },
  {
    "Question Text": "How do you say \"silky\" in English?",
    "Option 1": "rugoso",
    "Option 2": "suave",
    "Option 3": "áspero",
    "Correct Answer": "suave"
  },
  {
    "Question Text": "What is the English word for \"sink\"?",
    "Option 1": "lavabo",
    "Option 2": "fregadero",
    "Option 3": "bañera",
    "Correct Answer": "fregadero"
  },
  {
    "Question Text": "How do you say \"slide\" in English?",
    "Option 1": "resbalar",
    "Option 2": "saltar",
    "Option 3": "volar",
    "Correct Answer": "resbalar"
  },
  {
    "Question Text": "What is the English word for \"slip\"?",
    "Option 1": "patinar",
    "Option 2": "resbalar",
    "Option 3": "correr",
    "Correct Answer": "resbalar"
  },
  {
    "Question Text": "How do you say \"sniff\" in English?",
    "Option 1": "llorar",
    "Option 2": "oler",
    "Option 3": "toser",
    "Correct Answer": "oler"
  },
  {
    "Question Text": "What is the English word for \"soapy\"?",
    "Option 1": "jabonoso",
    "Option 2": "salado",
    "Option 3": "seco",
    "Correct Answer": "jabonoso"
  },
  {
    "Question Text": "How do you say \"sparkle\" in English?",
    "Option 1": "brillar",
    "Option 2": "oscurecer",
    "Option 3": "apagar",
    "Correct Answer": "brillar"
  },
  {
    "Question Text": "What is the English word for \"spotted\"?",
    "Option 1": "liso",
    "Option 2": "manchado",
    "Option 3": "brillante",
    "Correct Answer": "manchado"
  },
  {
    "Question Text": "How do you say \"spring\" in English?",
    "Option 1": "primavera",
    "Option 2": "verano",
    "Option 3": "otoño",
    "Correct Answer": "primavera"
  },
  {
    "Question Text": "What is the English word for \"stare\"?",
    "Option 1": "mirar",
    "Option 2": "hablar",
    "Option 3": "escuchar",
    "Correct Answer": "mirar"
  },
  {
    "Question Text": "How do you say \"summer\" in English?",
    "Option 1": "invierno",
    "Option 2": "verano",
    "Option 3": "otoño",
    "Correct Answer": "verano"
  },
  {
    "Question Text": "What is the English word for \"supplies\"?",
    "Option 1": "suministros",
    "Option 2": "alimentos",
    "Option 3": "regalos",
    "Correct Answer": "suministros"
  },
  {
    "Question Text": "How do you say \"tangled\" in English?",
    "Option 1": "enredado",
    "Option 2": "limpio",
    "Option 3": "suelto",
    "Correct Answer": "enredado"
  },
  {
    "Question Text": "What is the English word for \"tent\"?",
    "Option 1": "tienda",
    "Option 2": "casa",
    "Option 3": "coche",
    "Correct Answer": "tienda"
  },
  {
    "Question Text": "How do you say \"tomorrow\" in English?",
    "Option 1": "ayer",
    "Option 2": "hoy",
    "Option 3": "mañana",
    "Correct Answer": "mañana"
  },
  {
    "Question Text": "What is the English word for \"trade\"?",
    "Option 1": "comercio",
    "Option 2": "viaje",
    "Option 3": "estudio",
    "Correct Answer": "comercio"
  },
  {
    "Question Text": "How do you say \"trunk\" in English?",
    "Option 1": "tronco",
    "Option 2": "caja",
    "Option 3": "rama",
    "Correct Answer": "tronco"
  },
  {
    "Question Text": "What is the English word for \"warm\"?",
    "Option 1": "caliente",
    "Option 2": "frío",
    "Option 3": "templado",
    "Correct Answer": "caliente"
  },
  {
    "Question Text": "How do you say \"wave\" in English?",
    "Option 1": "ola",
    "Option 2": "viento",
    "Option 3": "nieve",
    "Correct Answer": "ola"
  },
  {
    "Question Text": "What is the English word for \"week\"?",
    "Option 1": "día",
    "Option 2": "semana",
    "Option 3": "mes",
    "Correct Answer": "semana"
  },
  {
    "Question Text": "How do you say \"wiggle\" in English?",
    "Option 1": "girar",
    "Option 2": "sacudir",
    "Option 3": "retorcer",
    "Correct Answer": "sacudir"
  },
  {
    "Question Text": "What is the English word for \"winter\"?",
    "Option 1": "verano",
    "Option 2": "otoño",
    "Option 3": "invierno",
    "Correct Answer": "invierno"
  },
  {
    "Question Text": "How do you say \"wish\" in English?",
    "Option 1": "esperar",
    "Option 2": "desear",
    "Option 3": "temer",
    "Correct Answer": "desear"
  },
  {
    "Question Text": "What is the English word for \"yesterday\"?",
    "Option 1": "hoy",
    "Option 2": "mañana",
    "Option 3": "ayer",
    "Correct Answer": "ayer"
  },
  {
    "Question Text": "How do you say \"young\" in English?",
    "Option 1": "viejo",
    "Option 2": "joven",
    "Option 3": "adulto",
    "Correct Answer": "joven"
  }
]



function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    
    setQuestions(questionsData);
    shuffleAnswers();
  }, []);

  const shuffleAnswers = () => {
    const shuffledQuestions = questionsData.map(question => {
      const options = [
        question["Option 1"],
        question["Option 2"],
        question["Option 3"],
        question["Correct Answer"]
      ];
      shuffleArray(options);
      return { ...question, options };
    });

    setQuestions(shuffledQuestions);
  };

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);

  const handleAnswerSelect = selectedAnswer => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (selectedAnswer === currentQuestion["Correct Answer"]) {
      setScore(score + 1);
      setShowCorrect(true);
      setTimeout(() => {
        setShowCorrect(false);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setShowResult(true);
        }
      }, 500); // Espera 1 segundo antes de avanzar a la siguiente pregunta
    } else {
      setSelectedAnswer(selectedAnswer);
    }
  };
  const isAnswerCorrect = answer => {
    const currentQuestion = questions[currentQuestionIndex];
    return answer === currentQuestion["Correct Answer"];
  };

  const handleRestartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    shuffleAnswers();
  };

  return (
    <div className="quiz-container">
    {!showResult ? (
      <div>
        <h1>Quiz App</h1>
        {questions.length > 0 && currentQuestionIndex < questions.length && (
          <div className="question-container">
            <h2>{questions[currentQuestionIndex]["Question Text"]}</h2>
            {questions[currentQuestionIndex]["options"].map(option => (
              <button
                key={uuidv4()}
                onClick={() => handleAnswerSelect(option)}
                className={selectedAnswer === option ? "selected" : ""}
              >
                {option}
              </button>
            ))}
            {showCorrect &&  (<div>  <p className="correct">¡Bien hecho!</p> 
            
             <h1 className='correct'>Correcta:{}</h1>
            
             </div>
            )}
             
          </div>
        )}
      </div>
    ) : (
        <div className="result-container">
          <h1>Result</h1>
          <p>Your Score: {score}</p>
          <button onClick={handleRestartQuiz}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
}

export default QuizApp;
