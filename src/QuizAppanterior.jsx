import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import './QuizApp.css';

const questionsData = [
  {
    "Question Text": "1.- ¿Qué es VoLTE?",
    "Option 1": "Envío de mensajes de texto en redes 3G",
    "Option 2": "Navegación en internet mediante conexiones móviles",
    "Option 3": "Llamadas de video de alta calidad en redes LTE",
    "Correct Answer": "Voice Over sobre LTE (Long Term Evolution)"
  },
  {
    "Question Text": "2.- ¿Qué es ViLTE?",
    "Option 1": "Transmisión de datos a alta velocidad en redes Wi-Fi",
    "Option 2": "Envío de mensajes de texto en redes 3G",
    "Option 3": "Videollamdas con ip ",
    "Correct Answer": "Videollamadas (Voz e imagen sobre LTE)"
  },
  {
    "Question Text": "3.- ¿Memoria que solo funciona como lectura?",
    "Option 1": "Memoria RAM",
    "Option 2": "Memoria Flash",
    "Option 3": "Memoria Cache",
    "Correct Answer": "Memoria ROM"
  },
  {
    "Question Text": "4.- ¿Método para la transmisión de datos a través de un canal analógico? Los bits de datos son agrupados en pares y son representados por una forma de onda única, llamada símbolo?",
    "Option 1": "Codificación Huffman (Huffman Coding)",
    "Option 2": "QPSK (Quadrature Phase Shift Keying)",
    "Option 3": "BPSK (Binary Phase Shift Keying)",
    "Correct Answer": "Pi/4 DQPSK (Digital Quadrature Phase Shift Keying)"
  },
  {
    "Question Text": "5. - ¿Qué es Amplitud Modulada?",
    "Option 1": "Transmisión de datos a través de un canal analógico.",
    "Option 2": "Envío de mensajes de texto en redes 3G",
    "Option 3": "Tipo de modulación en donde la amplitud de la señal cambia en función de la potencia de la señal portadora",
    "Correct Answer": "Tipo de modulación en donde la señal que se desea transmitir cambia la amplitud de la señal portadora."
  },
  {
    "Question Text": "6. - ¿Qué significa Fota?",
    "Option 1": "Network Over The Air.",
    "Option 2": "Frequency Over The Air.",
    "Option 3": "Field Operation Test Application",
    "Correct Answer": "Firmware Over The Air."
  },
  {
    "Question Text": "7.- Una red de datos es compuesta de los siguientes elementos",
    "Option 1": "Hardware, Ethernet",
    "Option 2": "Software de red, Cables de Red y routers",
    "Option 3": "Controladores de dispositivos",
    "Correct Answer": "Hardware, Software y Elementos de conectividad"
  },
  {
    "Question Text": "8.- ¿Tiempo de garantía de reparación con costo?",
    "Option 1": "2 Meses",
    "Option 2": "15 días",
    "Option 3": "30 días",
    "Correct Answer": "1 Mes"
  },
  {
    "Question Text": "9.-  Según la norma ISO/IEC 20000-1:2018 ¿Que es un objeto de Configuración (CI)?",
    "Option 1": "Un elemento que se descompone en partes pequeñas.",
    "Option 2": "Un software utilizado para gestionar bases de datos.",
    "Option 3": "Un servicio de conectividad en la nube.",
    "Correct Answer": "Elemento que requiere ser controlado para entregar un servicio"
  },
  {
    "Question Text": "10.- ¿Son los responsables de definir y mantener la clasificación de la información y el nivel de seguridad requerido?",
    "Option 1": "Administradores de sistemas",
    "Option 2": "Usuarios finales",
    "Option 3": "Desarrolladores de software",
    "Correct Answer": "Dueños de la información"
  },
  {
    "Question Text": "11.- ¿Donde se gestionan las garantías o reparaciones con costo por parte de Apple? ",
    "Option 1": "GSX1",
    "Option 2": "GSX3",
    "Option 3": "GSX4",
    "Correct Answer": "GSX2"
  },
  {
    "Question Text": "12. Debe de realizar el mantenimiento de series de los equipos reemplazados por el fabricante y/o proveedor originado de los descuentos.",
    "Option 1": "El Técnico de Reparaciones",
    "Option 2": "El Ingeniero de Desarrollo",
    "Option 3": "El Coordinador de Ventas",
    "Correct Answer": "El Analista de Garantías Regional"
  },
  {
    "Question Text": "13.-Tiempo para diagnosticar un Equipo",
    "Option 1": "1 Hora",
    "Option 2": "30 minutos",
    "Option 3": "1 Día",
    "Correct Answer": "10 minutos"
  },
  {
    "Question Text": "14.-Proceso de garantía para accesorios Kodak, Alcatel y pomo",
    "Option 1": "Proceso de devolución de productos en tienda",
    "Option 2": "Garantía extendida para accesorios",
    "Option 3": "Garantía de por vida para accesorios",
    "Correct Answer": "Mismo proceso de garantía que la de un equipo de telefonía celular"
  },
  {
    "Question Text": "15.-Vigencia para realizar el trámite de devolución de equipos con el sistema HMS de Huawei",
    "Option 1": "30 días",
    "Option 2": "2 Meses",
    "Option 3": "10 días",
    "Correct Answer": "15 días"
  },
  {
    "Question Text": "16.- Beneficio de Volte",
    "Option 1": "*Mejora la velocidad de procesador, *Ahorro de bateria, velocidad para ejectutar aplicaciones, video llamada de alta calidad",
    "Option 2": "*Mayor Rapidez en enlace de llamadas, mejora la velocidad de las aplicaciones, libera memoria cache",
    "Option 3": "*Menor consumo de batería",
    "Correct Answer": "*Voz alta definición, *Video Mejorado, *Mayor Rapidez en enlace de llamadas,  *Menor consumo de batería"
  },
  {
    "Question Text": "17.- ¿Es el área que cubre una estación base y va de acuerdo a la potencia de transmisión de los radios que tenga?",
    "Option 1": "Zona de Cobertura",
    "Option 2": "Extensión de Radio",
    "Option 3": "Área de Señal",
    "Correct Answer": "Celda"
  },
  {
    "Question Text": "18.- No importa la marca, modelo y tecnología del teléfono, ¿Cuántos y cuáles son los módulos más importantes de Teléfono?",
    "Option 1": "3 (Etapa de R.F. recepción y transmisión, Etapa de Banda Base y Etapa lógica)",
    "Option 2": "4 (Etapa de R.F. recepción y transmisión, Etapa de Banda Base, Etapa de reguladores y circuito de carga y Etapa de interfaz de usuario)",
    "Option 3": "2 (Etapa de R.F. recepción y transmisión y Etapa de Banda Base)",
    "Correct Answer": "5 (Etapa de R.F. recepción y transmisión, Etapa de Banda Base, Etapa lógica, Etapa de reguladores y circuito de carga y Etapa de interfaz de usuario)"
  },
  {
    "Question Text": "19.- ¿Cómo Procede la garantía de un equipo sin Relación Comercial?",
    "Option 1": "Se procede con el cambio físico del equipo por uno nuevo sin necesidad de revisión",
    "Option 2": "El AET debe comunicarse con el equipo de soporte técnico",
    "Option 3": "El AET deberá tratar de reparar el equipo para ingresarlo en código 9000 sin un cambio",
    "Correct Answer": "El AET deberá tratar de reparar como primera instancia el equipo antes de aplicar cualquier cambio"
  },
  {
    "Question Text": "20.- Datos Personales es",
    "Option 1": "Datos Personales de Compañía",
    "Option 2": "Contraseñas personales de usuarios",
    "Option 3": "Información pública",
    "Correct Answer": "Activo de Información"
  },
  {
    "Question Text": "21.- Significado de NFC",
    "Option 1": "Network Frequency Conversion",
    "Option 2": "Non-Functional Connection",
    "Option 3": "Nocturnal Field Control",
    "Correct Answer": "Near Field Communication"
  },
  {
    "Question Text": "22- Uno de los compromisos más importantes del sistema de seguridad y salud en el trabajo es:",
    "Option 1": "Cuidar de enfermedades a los empleados",
    "Option 2": "Aumentar las horas de trabajo",
    "Option 3": "Mejorar la eficiencia productiva",
    "Correct Answer": "Prevenir accidentes y lesiones"
  },
  {
    "Question Text": "23- Cuando hablamos de calidad nos referimos al cumplimiento de requisitos entre los cuales podemos mencionar",
    "Option 1": "Seguridad de la información, los aplicables (legales, gubernamentales, del producto, establecidos por Telcel y establecidos por el gobierno)",
    "Option 2": "La cantidad de post-its en la estación de trabajo",
    "Option 3": "La marca de café en la cocina",
    "Correct Answer": "Seguridad de la información, los aplicables (legales, gubernamentales, del producto, establecidos por Telcel y los descritos en las normas que integran el SGI) y la seguridad y salud en el trabajo"
  },
  {
    "Question Text": "24.- Es la única persona que puede autorizar un cambio de modelo en una garantía de venta empleado",
    "Option 1": "Supervisor de Ventas",
    "Option 2": "Gerente de Recursos Humanos",
    "Option 3": "Jefe de Almacén",
    "Correct Answer": "Jefe de CAC (Centro de Servicio a Clientes Personalizado)"
  },
  {
    "Question Text": "25.- Es el responsable de verificar que los pendientes almacén esté actualizados semanalmente",
    "Option 1": "Jefe de Almacén",
    "Option 2": "Supervisor de Ventas",
    "Option 3": "Analista de Garantías",
    "Correct Answer": "Jefe de CAC"
  },
  {
    "Question Text": "26.- Una tarjeta SIM se considera dentro de garantía cuando",
    "Option 1": "Es de un color específico",
    "Option 2": "no tiene ningun rayon.",
    "Option 3": "Presenta daño físico y está quemada",
    "Correct Answer": "Tiene menos del año de facturada, no presenta daño físico o por humedad y no esta quemada, no mostrar tarjeta SIM rechazada o PUK bloqueado"
  },
  {
    "Question Text": "27.- ¿En qué casos es obligatorio dar solución al cliente en su primera visita al CAC?",
    "Option 1": "En todos los casos, sin importar el tiempo de facturación",
    "Option 2": "En ningún caso, siempre se requieren múltiples visitas",
    "Option 3": "Únicamente en equipos de alta gama",
    "Correct Answer": "En los equipos con 30 o menos días de facturación y los que se encuentre en periodo de Reincidencia en falla"
  },
  {
    "Question Text": "28.- ¿De cuántos módulos o bloques importantes consta un teléfono celular, sin importar marca, modelo o tecnología?",
    "Option 1": 3,
    "Option 2": 4,
    "Option 3": 2,
    "Correct Answer": 5
  },
  {
    "Question Text": "29.- Es un canal unidireccional en sentido red a móvil que se utiliza para buscar al móvil (llamadas terminadas)",
    "Option 1": "SDCCH",
    "Option 2": "TCH",
    "Option 3": "FACCH",
    "Correct Answer": "PCH"
  },
  {
    "Question Text": "30.- ¿En donde se realiza la función básica de conmutación dentro del NSS?",
    "Option 1": "BSC",
    "Option 2": "HLR",
    "Option 3": "VLR",
    "Correct Answer": "MSC"
  },
  {
    "Question Text": "31.- Es básicamente una tarjeta inteligente que sigue los estándares ISO, que contienen toda la información referente al usuario almacenado en la parte de usuario de la interfaz radio",
    "Option 1": "SD CARD",
    "Option 2": "Memory Card",
    "Option 3": "Memoria Flash",
    "Correct Answer": "SIM CARD"
  },
  {
    "Question Text": "32.- ¿Cuándo ocurre un hard hand OFF?",
    "Option 1": "Cuando el móvil se pasa de una radiobase a otra sin interrupción",
    "Option 2": "Cuando el móvil se apaga y se enciende nuevamente",
    "Option 3": "Cuando el móvil cambia de red de datos automáticamente",
    "Correct Answer": "Cuando el móvil momentáneamente se encuentra en el aire sin que ninguna radiobase lo tenga enganchado."
  },
  {
    "Question Text": "33.- ¿Cuándo se creó el primer sistema de telefonía analógica en el continente americano?",
    "Option 1": "En el siglo XIX",
    "Option 2": "En los años 70",
    "Option 3": "En la década de los 90´s",
    "Correct Answer": "Fue desarrollado por los laboratorios Bell a principios de la década de los 80´s"
  },
  {
    "Question Text": "34.- ¿Cuándo se creó el primer sistema GSM por la CEPT?",
    "Option 1": 1995,
    "Option 2": 1978,
    "Option 3": 2003,
    "Correct Answer": 1982
  },
  {
    "Question Text": "35. - ¿Qué es HSDPA?",
    "Option 1": "Hyper Sonic Data Processor Algorithm",
    "Option 2": "Hybrid System Detection and Protection Architecture",
    "Option 3": "Holographic Signal Distribution Process Algorithm",
    "Correct Answer": "High Speed Downlink Packet Access"
  },
  {
    "Question Text": "36.- En una penalización ¿Quién autoriza cambio de equipo por un IPhone?",
    "Option 1": "Gerente General",
    "Option 2": "Asistente de Ventas",
    "Option 3": "Director de Marketing",
    "Correct Answer": "Gerente de servicio a clientes"
  },
  {
    "Question Text": "37.-Siglas el número único de Identidad Internacional Móvil del Usuario",
    "Option 1": "IMEI",
    "Option 2": "ICCID",
    "Option 3": "PIN",
    "Correct Answer": "IMSI"
  },
  {
    "Question Text": "38.-¿Que integra un programa interno de protección civil?",
    "Option 1": "programa para proteger los cacs",
    "Option 2": "Manual para prevenir accidentes en el trabajo",
    "Option 3": "Planes para proteger usuarios y empleados",
    "Correct Answer": "Planes de respuesta ante emergencia"
  },
  {
    "Question Text": "39.- Sismos, incendios y explosiones son:",
    "Option 1": "Accidentes que ocasionan lesione o la muerte de personas",
    "Option 2": "Formas de energía renovable",
    "Option 3": "Fenomenos naturales que comprometen la seguridad de las personas",
    "Correct Answer": "Agentes perturbadores que se incluyen en el plan de protección civil"
  },
  {
    "Question Text": "40.- ¿Es un canal unidireccional en el sentido red a móvil, utilizado por la red para asignar un canal dedicado de control tras un acceso aleatorio exitoso?",
    "Option 1": "El Canal de Transmisión Asincrónica (ATC, Asynchronous Transmission Channel)",
    "Option 2": "El Canal de Datos en Tiempo Real (RTDC, Real Time Data Channel)",
    "Option 3": "El Canal de Reserva de Banda Ancha (BBRC, Broadband Reservation Channel)",
    "Correct Answer": "El Canal de Acceso Garantizado (AGCH, Access Grant Channel)"
  },
  {
    "Question Text": "41.- ¿Es la etapa que controla toda la operación del teléfono, consta de un microcontrolador, RAM, memoria flash, EEPROM y señal reloj (CLK)?",
    "Option 1": "Etapa de Alimentación",
    "Option 2": "Etapa de Reducción de Ruido",
    "Option 3": "Etapa de Conectividad",
    "Correct Answer": "Etapa Lógica"
  },
  {
    "Question Text": "42.- Este es el primer sistema de telefonía analógica creada en el continente americano y es conocida también como estándar IS-19",
    "Option 1": "TDMA (Time Division Multiple Access)",
    "Option 2": "CDMA (Code Division Multiple Access)",
    "Option 3": "GSM (Global System for Mobile Communications)",
    "Correct Answer": "AMPS (Advanced Mobile Phone System)"
  },
  {
    "Question Text": "43.- Misión, Visión, valores y objetivos institucionales forman parte de:",
    "Option 1": "Estructura financiera",
    "Option 2": "Estrategia de marketing",
    "Option 3": "Proceso de producción",
    "Correct Answer": "Cultura corporativa"
  },
  {
    "Question Text": "44.- ¿Qué es un objeto de configuración?",
    "Option 1": "Un dispositivo que se utiliza para conectar computadoras",
    "Option 2": "Un elemento decorativo para la oficina",
    "Option 3": "Un tipo de archivo digital",
    "Correct Answer": "Elemento que requiere ser controlado para entregar un servicio"
  },
  {
    "Question Text": "45.- ¿Quiénes deben respetar las normas de seguridad personal de la empresa?",
    "Option 1": "Solo los empleados del departamento de seguridad",
    "Option 2": "Los empleados de alto rango",
    "Option 3": "Los empleados que trabajan en áreas de riesgo",
    "Correct Answer": "Todos los empleados, proveedores y contratistas, debido a que la seguridad e integridad de los empleados y de terceros puede estar en riesgo"
  },
  {
    "Question Text": "46.- La norma ISO 20001:2018 ¿cuantos procesos gestiona?",
    "Option 1": 10,
    "Option 2": 30,
    "Option 3": 15,
    "Correct Answer": 21
  },
  {
    "Question Text": "47.- Se refiere a la debilidad presente en un activo que puede ser aprovechada por un atacante para realizar acciones que afecten los objetivos del negocio",
    "Option 1": "Amenaza",
    "Option 2": "Riesgo",
    "Option 3": "Fallo",
    "Correct Answer": "Vulnerabilidad"
  },
  {
    "Question Text": "48.- ¿Persona que autoriza cambio de modelo en una garantía?",
    "Option 1": "Jefe de Servicio al Cliente",
    "Option 2": "Supervisor de Ventas",
    "Option 3": "Gerente General",
    "Correct Answer": "JEFE DE CAC"
  },
  {
    "Question Text": "49.- ¿En cuanto tiempo se envía un equipo a CSA?",
    "Option 1": "En la misma hora",
    "Option 2": "En menos de 2 horas",
    "Option 3": "En menos de una semana",
    "Correct Answer": "Al siguiente día hábil"
  },
  {
    "Question Text": "50.- ¿Método para la transmisión de datos a través de un canal analógico?",
    "Option 1": "QAM (Quadrature Amplitude Modulation)",
    "Option 2": "ASK (Amplitude Shift Keying)",
    "Option 3": "FM (Frequency Modulation)",
    "Correct Answer": "PI/4 DQPSK"
  },
  {
    "Question Text": "51.- Ancho de banda de un canal de voz en GSM",
    "Option 1": "50 MHz",
    "Option 2": "1 GHz",
    "Option 3": "10 KHz",
    "Correct Answer": "200 KHz"
  },
  {
    "Question Text": "52.- PUK",
    "Option 1": "Personal User Knowledge",
    "Option 2": "Public Unlock Key",
    "Option 3": "Personal Unlocked Key",
    "Correct Answer": "Personal Unlock Key"
  },
  {
    "Question Text": "53.- Son algunas recomendaciones para la prevención de accidentes",
    "Option 1": "Usar el celular mientras camina, dejar las puertas abiertas",
    "Option 2": "Saltar por las escaleras, no cerrar los cajones",
    "Option 3": "Viajar en el techo del coche, usar el celular mientras maneja",
    "Correct Answer": "Evitar el uso del celular al caminar o desplazarse, cerrar puertas y cajones después de úsalos"
  },
  {
    "Question Text": "54.- Son algunos TIPS de autocuidado",
    "Option 1": "Dormir mas de 9 horas y comer 5 veces al diá",
    "Option 2": "Correr por la calle, levantar objetos pesados incorrectamente, comer comida rápida todos los días",
    "Option 3": "no Jugar videojuegos, comer solo frutas y verduras, y  beber agua",
    "Correct Answer": "Ser precavido en la calle, realiza pautas activas, cuidar tu higiene postural"
  },
  {
    "Question Text": "55.- Cuál es el propósito de un sistema de gestión de seguridad y salud en el trabajo (SST)",
    "Option 1": "Ser precavido en la calle, realiza pautas activas, cuidar tu higiene postural",
    "Option 2": "Evitar el uso del celular al caminar o desplazarse, cerrar puertas y cajones después de úsalos",
    "Option 3": "no Jugar videojuegos, comer solo frutas y verduras, y  beber agua",
    "Correct Answer": "Promover una cultura preventiva de seguridad y salud dentro de la organización para cumplir con los estándares legales de la SST"
  },
  {
    "Question Text": "56.- ¿Cómo se le denomina al canal físico en GSM?",
    "Option 1": "PSD (PHYSICAL SIGNAL DISTRIBUTION)",
    "Option 2": "RCV (RADIO CHANNEL VARIATION)",
    "Option 3": "DCT (DIGITAL COMMUNICATION TERMINAL)",
    "Correct Answer": "ARFCN (ABSOLUTE RADIO FREQUENCY CHANNEL)"
  },
  {
    "Question Text": "57.- Generalmente se utiliza para conectar la red GSM a red de datos",
    "Option 1": "GPRS",
    "Option 2": "CDMA",
    "Option 3": "BSC",
    "Correct Answer": "MSC"
  },
  {
    "Question Text": "58.- ¿Qué significa \"SIM\" en el contexto de telefonía móvil?",
    "Option 1": "System Information Manager",
    "Option 2": "Signal Interface Module",
    "Option 3": "Service Identifier Module",
    "Correct Answer": "Subscriber Identity Module"
  },
  {
    "Question Text": "59.- ¿Qué es \"VMI\" en relación con la marca Apple?",
    "Option 1": "Virtual Memory Interface",
    "Option 2": "Video Music Integration",
    "Option 3": "Visual Mobile Interface",
    "Correct Answer": "Es la guía Visual que proporciona la marca Apple para determinar si un equipo de su marca aplica cambio en garantía o costo"
  },
  {
    "Question Text": "60.- ¿Cuántos días de garantía tiene un equipo Apple de reparación con costo?",
    "Option 1": "30 días",
    "Option 2": "120 días",
    "Option 3": "60 días",
    "Correct Answer": "90 días"
  },
  {
    "Question Text": "61.- ¿Qué tipo de reparación se les da a los equipos que han sido portados por Telcel?",
    "Option 1": "Se les niega la reparación",
    "Option 2": "Se les reemplaza automáticamente",
    "Option 3": "Se les da un descuento en la reparación",
    "Correct Answer": "Se puede recibir el equipo y tratar de corregir las fallas en SerTec, puede ser escalado a la marca correspondiente para su reparación en garantía siempre y cuando el usuario presente la factura o ticket debidamente sellado donde se indique la fecha de compra IMEI de la unidad"
  },
  {
    "Question Text": "62.- ¿Qué significa \"GPRS\" en el contexto de telefonía móvil?",
    "Option 1": "Global Phone Radio Signal",
    "Option 2": "General Public Radio System",
    "Option 3": "General Packet Relay System",
    "Correct Answer": "General Packet Radio Service"
  },
  {
    "Question Text": "64.- ¿Qué es \"RACh\" en telefonía móvil?",
    "Option 1": "Radio Access Chain",
    "Option 2": "Relay and Access Channel",
    "Option 3": "Receiver and Antenna Control Hub",
    "Correct Answer": "Random Access Channel utilizado para solicitar acceso al sistema"
  },
  {
    "Question Text": "65.- ¿Qué se hace con un equipo de +180 días que reclama el cliente y el equipo se encuentra en almacén?",
    "Option 1": "Se devuelve al cliente sin hacer nada",
    "Option 2": "Se reemplaza automáticamente por un equipo nuevo",
    "Option 3": "Se repara en el almacén y luego se entrega al cliente",
    "Correct Answer": "Se deberá generar un nuevo folio SERTEC para realizar la entrega del mismo al usuario final además el AV deberá facturar a 0 pesos el equipo a nombre del cliente en comentarios de la factura debe aclarar que no ampara el tiempo de garantía del equipo."
  },
  {
    "Question Text": "66.- ¿Quién es responsable de realizar la carga en SIGADE de los equipos que no han sido reemplazados en tiempo por el fabricante y no hay aclaración por parte del proveedor o fabricante?",
    "Option 1": "Gerente de Ventas",
    "Option 2": "Analista de Garantias Regional",
    "Option 3": "Gerente de ventas regional",
    "Correct Answer": "Analista de Costos Regional"
  },
  {
    "Question Text": "67.- ¿Cuál es el modem homologado por Telcel para Internet en Casa?",
    "Option 1": "Telcom M300",
    "Option 2": "Netlink C320",
    "Option 3": "WifiMax G650",
    "Correct Answer": "Eltel R520"
  },
  {
    "Question Text": "68.- ¿Qué es \"Internet de las cosas\"?",
    "Option 1": "Una nueva forma de conectarse a internet",
    "Option 2": "Un tipo de virus informático",
    "Option 3": "Una red social para objetos",
    "Correct Answer": "Es la interconexión digital de los objetos cotidianos a internet"
  },
  {
    "Question Text": "69.- ¿Qué se entiende por \"problema\" en este contexto?",
    "Option 1": "Es un desafío sin solución",
    "Option 2": "Es un error en el sistema",
    "Option 3": "Es una pregunta sin respuesta",
    "Correct Answer": "Es la causa de uno o más incidentes"
  },
  {
    "Question Text": "70.- ¿Qué significa \"CPD\" en relación con problemas técnicos?",
    "Option 1": "Central Processing Device",
    "Option 2": "Customer Priority Demand",
    "Option 3": "Common Problem Diagnosis",
    "Correct Answer": "Customer Problem Description"
  },
  {
    "Question Text": "71.- ¿Cuál es la etapa que controla todos los elementos de un equipo?",
    "Option 1": "Etapa de Potencia",
    "Option 2": "Etapa de Conectividad",
    "Option 3": "Etapa de Recepción",
    "Correct Answer": "Etapa lógica"
  },
  {
    "Question Text": "72.- ¿De cuantos digitos se compone un \"ICCID\" ?S",
    "Option 1": "Código de Identificación de Chip de Comunicación Internacional",
    "Option 2": "19 y 1 digito de verificación alfanúmerico",
    "Option 3": "Código de Comunicación y Control Internacional de Datos",
    "Correct Answer": "Se compone de 20 dígitos"
  },
  {
    "Question Text": "73.- ¿Cuáles son los requisitos para el uso del servicio VOLTE?",
    "Option 1": "Sim card versión 5.0 o mayor, cobertura 3G",
    "Option 2": "Tarjeta SIM de cualquier versión, cobertura 2G",
    "Option 3": "Aprovisionamiento del servicio, cob",
    "Correct Answer": "Sim card versión 6.3 o mayor, aprovisionamiento del servicio, cobertura 4G LTE"
  },
  {
    "Question Text": "74.- ¿A qué se le llama \"descuento por reincidencia\"?",
    "Option 1": "Un descuento que se da al comprar un equipo nuevo",
    "Option 2": "Un descuento por comprar accesorios adicionales",
    "Option 3": "Un descuento por recomendar un amigo",
    "Correct Answer": "Cuando un equipo ha sido reparado o intercambiado bajo garantía por el fabricante y éste presenta una falla por defecto de fabricación y/o una mala reparación durante los primeros 90 días naturales después de haber sido entregado"
  },
  {
    "Question Text": "75.- ¿Qué no se debe hacer a equipos DOA (Dead on Arrival) y reincidentes?",
    "Option 1": "Realizar todas las reparaciones posibles",
    "Option 2": "Actualizar el software de manera regular",
    "Option 3": "Hacer cambios en la configuración del equipo",
    "Correct Answer": "No realizar reparaciones ni actualizaciones de software"
  },
  {
    "Question Text": "76.- ¿Cuánto tiempo se estima para generar una solicitud de servicio técnico según la tabla de actividades básicas para trámites de servicio técnico?",
    "Option 1": "30 minutos",
    "Option 2": "1 hora",
    "Option 3": "10 minutos",
    "Correct Answer": "3 minutos"
  },
  {
    "Question Text": "77.- ¿Es un chip que se aloja en el teléfono y a través del cual permite identificarnos ante nuestro operador GSM o con otros operadores GSM.",
    "Option 1": "Suscripción de Identificación Móvil",
    "Option 2": "Modulo de Identificación de suscipción",
    "Option 3": "Sistema de Mensajes Instantáneos",
    "Correct Answer": "Subscriber Identity Module– Módulo de identidad del usuario. "
  },
  {
    "Question Text": "78.- ¿Qué es la \"memoria flash\" en un teléfono móvil?",
    "Option 1": "Memoria para almacenar datos, archivos, fotos y videos",
    "Option 2": "Memoria para guardar datos momentáneos u operaciones que son llevadas a cabo por el microcontrolador, siendo una memoria volátil y al quitar la batería se pierden sus datos",
    "Option 3": "Memoria que sirve para almacenar datos como el directorio, la lista de llamadas perdidas y valores de calibración del teléfono",
    "Correct Answer": "Aquella donde se guarda el software del teléfono, en ocasiones contiene el ESN, se puede sobrescribir."
  },
  {
    "Question Text": "79.- ¿Qué condiciones invalidan la garantía de un equipo?",
    "Option 1": "Uso normal del equipo",
    "Option 2": "Cambio de accesorios originales",
    "Option 3": "Actualización del software",
    "Correct Answer": "Equipo intervenido por personas no autorizadas, golpeado"
  },
  {
    "Question Text": "80.- ¿Qué acción se debe realizar antes de diagnosticar una penalización de falla fuera de caja FFC DOA como AET?",
    "Option 1": "Realizar una restauración de fábrica",
    "Option 2": "Enviar el equipo al fabricante",
    "Option 3": "Cambiar el IMEI del equipo",
    "Correct Answer": "Corroborar que el IMEI que se muestra en la documentación sea validado con la terminal y su tiempo de uso menor a 30 días"
  },
  {
    "Question Text": "81.- ¿Qué son los \"perfiles bluetooth\"?",
    "Option 1": "Son tipos de audífonos bluetooth",
    "Option 2": "Son las contraseñas para emparejar dispositivos",
    "Option 3": "Son nombres de dispositivos bluetooth",
    "Correct Answer": "Son descripciones de comportamientos generales que los dispositivos pueden utilizar para comunicarse."
  },
  {
    "Question Text": "82.- ¿Qué servicios no son compatibles con VoLTE?",
    "Option 1": "Mensajes de texto, llamadas de voz, internet",
    "Option 2": "Llamadas de voz, videoconferencias, internet",
    "Option 3": "Radio FM, llamadas de emergencia, internet",
    "Correct Answer": "Contestone, banda ancha, Telcel directo (PTT)"
  },
  {
    "Question Text": "83.- ¿Qué es la \"FM\" en la transmisión de señales?",
    "Option 1": "Frecuencia Máxima",
    "Option 2": "Frecuencia Mínima",
    "Option 3": "Función Moduladora",
    "Correct Answer": "Es cuando la señal hace variar la frecuencia"
  },
  {
    "Question Text": "84.- ¿Para qué sirve el manual de \"VMI\" (Visual Mechanical Inspection) en iPhone?",
    "Option 1": "Para aprender a utilizar las aplicaciones de iPhone",
    "Option 2": "Para conocer las especificaciones técnicas del iPhone",
    "Option 3": "Para encontrar soluciones a problemas de software en iPhone",
    "Correct Answer": "Para saber bajo qué condiciones físicas se puede tramitar o invalidar las garantías de los equipos Apple"
  },
  {
    "Question Text": "85.- ¿Cuál es el objetivo del sistema de gestión de seguridad y salud en el trabajo?",
    "Option 1": "Optimizar la productividad del trabajo",
    "Option 2": "Reducir los costos de operación",
    "Option 3": "Implementar nuevas tecnologías en el trabajo",
    "Correct Answer": "Proporcionar lugares de trabajo seguros y saludables."
  },
  {
    "Question Text": "86.- ¿Qué se debe hacer si un cliente se presenta a solicitar un equipo de más de 180 días y el equipo se encuentra en servicio técnico?",
    "Option 1": "Devolver el equipo al cliente",
    "Option 2": "Reemplazar el equipo por uno nuevo",
    "Option 3": "Mantener el equipo en servicio técnico",
    "Correct Answer": "Avanzar el folio hasta entregado"
  },
  {
    "Question Text": "87.- ¿Qué hacer si el usuario no presenta un accesorio en el equipo?",
    "Option 1": "Ignorar el problema",
    "Option 2": "Buscar el accesorio en el almacén",
    "Option 3": "Hacer una reparación rápida",
    "Correct Answer": "Solicitar al AV uno de venta para el diagnóstico"
  },
  {
    "Question Text": "88.- ¿Cuáles son los 3 componentes principales de una red de telefonía celular?",
    "Option 1": "CPU, RAM y Disco Duro",
    "Option 2": "Tarjeta SIM, batería y pantalla",
    "Option 3": "Antena, bocina y micrófono",
    "Correct Answer": "MTSO, BS Y MS"
  },
  {
    "Question Text": "89.- ¿Qué es \"Mobile station\" en este contexto?",
    "Option 1": "Estación de carga móvil",
    "Option 2": "Una estación de trabajo móvil",
    "Option 3": "Un centro de llamadas móvil",
    "Correct Answer": "Es lo que finalmente ven los clientes y a los que normalmente culpan por cualquier problema que se pudiera tener con los otros sistemas."
  },
  {
    "Question Text": "90 - ¿Qué es la \"resistencia\" en el contexto eléctrico?",
    "Option 1": "Un componente que amplifica la señal eléctrica",
    "Option 2": "Una fuente de energía",
    "Option 3": "Un dispositivo de almacenamiento",
    "Correct Answer": "Es la oposición al paso de la energía eléctrica, libera la energía sobrante en forma de calor"
  },
  {
    "Question Text": "91. - ¿Qué es un \"firewall\"?",
    "Option 1": "Un sistema de extinción de incendios",
    "Option 2": "Un software para crear pantallas de fuego en la pantalla",
    "Option 3": "Una red social para bomberos",
    "Correct Answer": "Está diseñado para bloquear el acceso no autorizado a una red o sistema permitiendo al mismo tiempo comunicaciones autorizadas"
  },
  {
    "Question Text": "92.- ¿Cuál es el APN utilizado para internet en casa?",
    "Option 1": "Datos.tcel.com",
    "Option 2": "Internet.telcel.com",
    "Option 3": "Casa.conexion",
    "Correct Answer": "Hogar.itelcel.com"
  },
  {
    "Question Text": "93.- ¿Cuál es la potencia utilizada en un canal Telcel 1800 clase 1?",
    "Option 1": "5 watts",
    "Option 2": "10 watts",
    "Option 3": "0.5 watts",
    "Correct Answer": "1 watt"
  },
  {
    "Question Text": "94.- ¿Cuál es el servicio que permite hacer llamadas de emergencia?",
    "Option 1": "SOS – Service of Safety",
    "Option 2": "ESN – Emergency Service Number",
    "Option 3": "LDE – Llamada de Emergencia",
    "Correct Answer": "SDN – Service Dialing Number"
  },
  {
    "Question Text": "95.- ¿Qué componentes componen el IMSI (International Mobile Subscriber Identity)?",
    "Option 1": "Mobile Serial Number, International Code, Network Code y Home Location",
    "Option 2": "Subscriber Identity, Network Code, Serial Number y Home Address",
    "Option 3": "Country Code, Network Code, IMEI y SIM Number",
    "Correct Answer": "Mobile Country Code, Mobile Network Code, Home Location Register y Serial Number"
  },
  {
    "Question Text": "96.- ¿Qué es la EEPROM en un teléfono móvil?",
    "Option 1": "Memoria para almacenar imágenes y videos",
    "Option 2": "Memoria para guardar aplicaciones",
    "Option 3": "Memoria para almacenar el sistema operativo",
    "Correct Answer": "Memoria que sirve para almacenar datos como el directorio, la lista de llamadas perdidas y valores de calibración del teléfono"
  },
  {
    "Question Text": "97.- ¿Qué es la Memoria RAM en un teléfono móvil?",
    "Option 1": "Memoria para almacenar música",
    "Option 2": "Memoria para guardar aplicaciones",
    "Option 3": "Memoria para almacenar el sistema operativo",
    "Correct Answer": "Memoria para guardar datos momentáneos u operaciones que son llevadas a cabo por el microcontrolador, siendo una memoria volátil y al quitar la batería se pierden sus datos"
  },
  {
    "Question Text": "98.- ¿Qué significa \"APN\" en el contexto de telefonía móvil?",
    "Option 1": "Access Point Number",
    "Option 2": "Alta Potencia Neta",
    "Option 3": "Área de Procesamiento de Números",
    "Correct Answer": "Access Point Name"
  },
  {
    "Question Text": "99.- ¿Cuánto tiempo dura una pantalla LCD en promedio?",
    "Option 1": "10,000 – 20,000 horas",
    "Option 2": "100,000 – 120,000 horas",
    "Option 3": "5,000 – 10,000 horas",
    "Correct Answer": "50,000 – 60,000 horas"
  },
  {
    "Question Text": "100.- ¿Cuál es el componente encargado de proporcionar y gestionar la interfaz radio entre estaciones móviles y el resto del sistema GSM?",
    "Option 1": "MSC",
    "Option 2": "HLR",
    "Option 3": "VLR",
    "Correct Answer": "BSS"
  },
  {
    "Question Text": "101.- ¿Qué es la modulación por frecuencia o frecuencia modulada?",
    "Option 1": "Es cuando la señal que se desea transmitir hace variar la amplitud más no la frecuencia de la señal portadora",
    "Option 2": "Es cuando la señal que se desea transmitir modifica ambas la amplitud y la frecuencia de la señal portadora",
    "Correct Answer": "Es cuando la señal que se desea transmitir hace variar la frecuencia más no la amplitud de la señal portadora"
  },
  {
    "Question Text": "102.- ¿Qué es la modulación por amplitud o amplitud modulada?",
    "Option 1": "Es cuando la señal que se desea transmitir hace variar la frecuencia más no la amplitud de la señal portadora",
    "Option 2": "Es cuando la señal que se desea transmitir modifica ambas la amplitud y la frecuencia de la señal portadora",
    "Option 3": "Tipo de modulación en donde la amplitud de la señal cambia en función de la potencia de la señal portadora",
    "Correct Answer": "Es cuando la señal que se desea transmitir hace variar la amplitud más no la frecuencia de la señal portadora"
  },
  {
    "Question Text": "103.- ¿En el servicio Telcel UP, ¿cuál es el límite de siniestros por concepto de daño, falla o robo?",
    "Option 1": "1 siniestro",
    "Option 2": "3 siniestros",
    "Option 3": "No hay límite",
    "Correct Answer": "2 siniestros"
  },
  {
    "Question Text": "104.- ¿Cuál es la tecnología de transmisión de datos también conocida como WCDMA?",
    "Option 1": "LTE (Long-Term Evolution)",
    "Option 2": "GSM (Global System for Mobile Communications)",
    "Option 3": "CDMA (Code Division Multiple Access)",
    "Correct Answer": "UMTS (Universal Mobile Telecommunications System)"
  },
  {
    "Question Text": "105.- De los siguientes casos, ¿cuál no aplica DOA (Dead on Arrival)?",
    "Option 1": "Equipo con pantalla rota",
    "Option 2": "Equipo que no enciende",
    "Option 3": "Equipo con rayones",
    "Correct Answer": "Equipo sin relación comercial"
  },
  {
    "Question Text": "106.- De acuerdo a la norma ISO/IEC 20000-1:2018, ¿qué es un requerimiento de servicio?",
    "Option 1": "Un contrato entre el cliente y la empresa",
    "Option 2": "Necesidades de clientes, usuarios y empresas relacionadas a los servicios y el SGS(Sistema de Gestión de Servicios) que son implicitas u obligatorias",
    "Option 3": "Un requerimiento es una solicitud formulada para contratar un bien, servicio u obra que satisfaga las necesidades de una Entidad.",
    "Correct Answer": "Necesidades de clientes, usuarios y la organización relacionada a los servicios y el SGS(Sistema de Gestión de Servicios) que son declaradas u obligatorias"
  },
  {
    "Question Text": "107.- ¿A qué se refiere la segunda fase del IMEI?",
    "Option 1": "Type Allocation Code, organización que regula el equipo",
    "Option 2": "Región geográfica del equipo",
    "Option 3": "Numero de serie del equipo",
    "Correct Answer": "Fabricante del equipo (Final Assembly Code \"FAC\")"
  },
  {
    "Question Text": "108.- ¿Qué compone el IMSI (International Mobile Subscriber Identity)?",
    "Option 1": "Mobile Country Code + Mobile Network Code + VLR + Serial Number",
    "Option 2": "Subscriber Network Code + Home Location Registrer + Serial Number",
    "Option 3": "Mobile Serial Number + Home Network Code + Home Location Registrer",
    "Correct Answer": "Mobile Country Code + Mobile Network Code + Home Location Registrer + Serial Number"
  },
  {
    "Question Text": "109.- ¿Cuáles son los tiempos de respuesta de CSA (Centro de Servicio Autorizado)?",
    "Option 1": "3 días foráneos y 5 días para locales",
    "Option 2": "7 días foráneos y 2 días para locales",
    "Option 3": "2 días foráneos y 7 días para locales",
    "Correct Answer": "5 días foráneos y 3 días para locales"
  },
  {
    "Question Text": "110.- ¿Cuáles son los 3 servicios GSM que ofrece el Sim CARD?",
    "Option 1": "Servicios de mensajería, Servicios de navegación, Servicios de llamadas",
    "Option 2": "Servicios de música, Servicios de entretenimiento, Servicios de redes sociales",
    "Option 3": "Servicios de seguridad, Servicios de transferencia, Servicios de sincronización",
    "Correct Answer": "Servicios administrados por el usuario, Servicios administrados por la Red (operador Telcel), Servicios administrados por la terminal"
  },
  {
    "Question Text": "111.- ¿Cuál es el tiempo establecido en archivo muerto de la papelería generada de los trámites de falla fuera de caja y penalizaciones para su posterior destrucción?",
    "Option 1": "2 años",
    "Option 2": "5 años",
    "Option 3": "3 años",
    "Correct Answer": "4 años"
  },
  {
    "Question Text": "112.- ¿Qué combinación utiliza la interfaz radio en GSM?",
    "Option 1": "Acceso Múltiple por división de tiempo (TDMA) y Acceso Múltiple por división de frecuencia (FDMA), con una pizca de modulación de amplitud (AM)",
    "Option 2": "Acceso Múltiple por división de frecuencia (FDMA) y Acceso Múltiple por división de tiempo (TDMA), con una pizca de modulación de frecuencia (FM)",
    "Option 3": "Acceso Múltiple por división de tiempo (TDMA) y Acceso Múltiple por división de código (CDMA), con una pizca de salto en frecuencia (FH, Frequency Hopping)",
    "Correct Answer": "Acceso Multiple por division de frecuencia (FDMA) y Acceso Multiple por division de tiempo (TDMA), con una pizca de salto en frecuencia (FH, Frequency Hopping)"
  },
  {
    "Question Text": "113.- ¿Qué son las conductas peligrosas que afectan tu salud física, mental y social?",
    "Option 1": "Hábitos",
    "Option 2": "Aficiones",
    "Option 3": "Pasatiempos",
    "Correct Answer": "Adicciones"
  },
  {
    "Question Text": "114.- ¿Cuál es el código con el que encontramos en el @doc el objetivo y alcance de la SST (Sistema de Seguridad y Salud en el Trabajo)?",
    "Option 1": "SSS-111-112",
    "Option 2": "01234-56789-ABC",
    "Option 3": "HSE-2022",
    "Correct Answer": "O-00.00.00.00.00-008"
  },
  {
    "Question Text": "115.- ¿Cómo se llama la plantilla del teclado interno que realiza la función de conductor eléctrico al oprimir las teclas?",
    "Option 1": "Keyboardator",
    "Option 2": "Keymatrix",
    "Option 3": "ConducTouch",
    "Correct Answer": "MILLER"
  },
  {
    "Question Text": "116.- ¿Cuál es la técnica de direccionamiento en redes IP que permite la distribución de contenidos a múltiples destinos a partir de un único flujo origen?",
    "Option 1": "Unicast",
    "Option 2": "Broadcast",
    "Option 3": "Anycast",
    "Correct Answer": "Multicast"
  },
  {
    "Question Text": "117.- Completa la oración: En un cambio en garantía por el mismo equipo y modelo, ¿qué ocurre?",
    "Option 1": "Se paga la diferencia",
    "Option 2": "Se obtiene un reembolso",
    "Option 3": "No aplica cambio",
    "Correct Answer": "No paga diferencia"
  },
  {
    "Question Text": "118.- ¿De qué está formada la SIM que se utiliza en un teléfono móvil?",
    "Option 1": "Está formada por una batería, una pantalla y un altavoz",
    "Option 2": "Está formada por un GPS, una cámara y un sensor de huellas",
    "Option 3": "Está formada por un CPU, una GPU y una unidad de disco",
    "Correct Answer": "Está formada por un Microprocesador, memoria ROM, EEPROM y RAM"
  },
  {
    "Question Text": "119.- Una vez aprobado el cambio en Telcel UP, ¿quién se encarga de validar las condiciones físicas, funcionalidades y que el equipo sea borrado a valores de fábrica?",
    "Option 1": "Equipo de desarrollo de software",
    "Option 2": "Gerente de ventas",
    "Option 3": "Técnico de reparación",
    "Correct Answer": "Asesor de servicio al cliente en conjunto con el cliente"
  },
  {
    "Question Text": "120.- ¿Cuál de los siguientes elementos consta de 20 caracteres?",
    "Option 1": "IMEI",
    "Option 2": "SIM",
    "Option 3": "IP Address",
    "Correct Answer": "ICCID"
  },
  {
    "Question Text": "121.- ¿Cuánto tiempo se da de garantía por reparaciones con costo en CSA (Centro de Servicio Autorizado) y cómo procede?",
    "Option 1": "3 meses de garantía y aplica para todo el equipo",
    "Option 2": "6 meses de garantía y aplica para todo el equipo",
    "Option 3": "1 año de garantía y aplica para todo el equipo",
    "Correct Answer": "1 mes de garantía y aplica solamente para la pieza reparada"
  },
  {
    "Question Text": "122.- ¿Qué debe hacer en AET  al recibir un equipo reemplazado por el CSA?",
    "Option 1": "Validar que corresponda el imei y software de operador",
    "Option 2": "Devolver el equipo al fabricante",
    "Option 3": "Enviar el equipo a un taller de reparación",
    "Correct Answer": "Inspeccionar el equipo que tenga el mismo sistema operativo del operador y aplicar borrado general"
  },
  {
    "Question Text": "123.- ¿Qué es el Catálogo de Servicios según la Norma ISO/IEC 20000?",
    "Option 1": "Un catálogo de productos para la venta",
    "Option 2": "Un conjunto de normas de seguridad para la organización",
    "Option 3": "Un registro de gastos operativos",
    "Correct Answer": "Información documentada acerca de servicios que una organización proporciona a sus clientes"
  },
  {
    "Question Text": "124.- ¿Cómo debe estar tu área de trabajo según las normas de seguridad?",
    "Option 1": "Permitir alimentos y bebidas, pero mantener el área de trabajo ordenada y limpia",
    "Option 2": "Mantener herramientas y equipo en el área de trabajo",
    "Option 3": "No importa el estado del área de trabajo",
    "Correct Answer": "No tener bebidas ni alimentos y mantener limpio tu área de trabajo"
  },
  {
    "Question Text": "125.- ¿Quién debe respetar las normas de seguridad y salud definidas por la empresa?",
    "Option 1": "Solo los empleados de nivel ejecutivo",
    "Option 2": "Solo los proveedores y contratistas",
    "Option 3": "Solo los empleados de tiempo completo",
    "Correct Answer": "Todos los empleados, proveedores, distribuidores, contratistas y demás socios comerciales"
  },
  {
    "Question Text": "126.- ¿Qué característica permite sacar una memoria externa sin tener que apagar el dispositivo en el que se encuentra, protegiendo la información contra pérdida?",
    "Option 1": "Plug and Play",
    "Option 2": "Cold Start",
    "Option 3": "Overclocking",
    "Correct Answer": "Hot Swap"
  },
  {
    "Question Text": "¿Es el responsable del departamento de Datos Personales?",
    "Option 1": "Departamenteo de datos personales",
    "Option 2": "Comisión de datos personales",
    "Option 3": "Gerente de SCPT",
    "Correct Answer": "Gerencia del cumplimiento"
  },
  {
    "Question Text": "128.- En LTE, ¿cuáles son 3 funciones que se asignan al nodo en la E-UTRAN (Evolved UTRAN)?",
    "Option 1": "Control de tráfico en la red de acceso, administración de la red IP, encriptación de datos",
    "Option 2": "Almacenamiento de datos, configuración de antenas, control de la señalización",
    "Option 3": "Programación de aplicaciones, enrutamiento de llamadas, administración de SIM",
    "Correct Answer": "Coordinación de la interferencia entre células, gestión de la movilidad de conexión, control de radio portador"
  },
  {
    "Question Text": "129.- ¿En cuál de los siguientes sistemas operativos no puede convivir la llamada VoLTE?",
    "Option 1": "Android",
    "Option 2": "iOS",
    "Option 3": "Windows Phone",
    "Correct Answer": "Symbian"
  },
  {
    "Question Text": "130.- ¿Cuál es el organismo de las Naciones Unidas que se encarga de regular las telecomunicaciones a nivel internacional, entre las distintas administraciones y empresas operadoras?",
    "Option 1": "UN (United Nations)",
    "Option 2": "FCC (Federal Communications Commission)",
    "Option 3": "WHO (World Health Organization)",
    "Correct Answer": "ITU (International Telecommunication Union)"
  },
  {
    "Question Text": "131.- ¿Cuáles son las bandas de frecuencia para Telcel LTE?",
    "Option 1": "900 MHz - 1800 MHz",
    "Option 2": "1900 MHz - 2300 MHz",
    "Option 3": "800 MHz - 2600 MHz",
    "Correct Answer": "1700 MHz - 2100 MHz"
  },
  {
    "Question Text": "133.- ¿Qué mantiene la seguridad informática?",
    "Option 1": "La confidencialidad de los usuarios",
    "Option 2": "La velocidad de las conexiones de red",
    "Option 3": "La compatibilidad entre sistemas operativos",
    "Correct Answer": "Las condiciones y características de seguridad de los sistemas de procesamiento y almacenamiento de datos."
  },
  {
    "Question Text": "134.- De la familia ISO 20000, ¿cuál es la norma que se certifica?",
    "Option 1": "ISO/IEC 20000-1:2013",
    "Option 2": "ISO/IEC 20000-1:2015",
    "Option 3": "ISO/IEC 20001:2011",
    "Correct Answer": "ISO/IEC 20000-1:2011"
  },
  {
    "Question Text": "135.- ¿Cuál es un lineamiento del P-00.00.00.00.00-001 control de información documentada del sistema de gestión integrado?",
    "Option 1": "Se debe imprimir cada documento para tener copias físicas disponibles",
    "Option 2": "Cada empleado debe crear sus propios documentos para uso personal",
    "Option 3": "Solo los gerentes tienen acceso a los documentos",
    "Correct Answer": "Es responsabilidad de cada empleado consultar y emplear solo los documentos que se encuentran en el S/N 001 sistema @doc"
  },
  {
    "Question Text": "136.- ¿Cuáles son las dos partes principales en la arquitectura de una red GSM?",
    "Option 1": "CPU y GPU",
    "Option 2": "RAM y ROM",
    "Option 3": "SIM y IMEI",
    "Correct Answer": "BSS y NSS"
  },
  {
    "Question Text": "137.- ¿Qué perfil da acceso remoto a los ficheros de directorios, detención envío y borrado de ficheros, basado en GOEP y OBEX como transporte?",
    "Option 1": "HTTP",
    "Option 2": "TCP",
    "Option 3": "SMTP",
    "Correct Answer": "FTP"
  },
  {
    "Question Text": "138.- ¿Cuáles son los sistemas que conforman los dos servicios en el alcance de la norma ISO/IEC 20000-1:2018?",
    "Option 1": "Remedy, TEMIP, Círculo Azul, ECAC, PAC",
    "Option 2": "Remedy, TEMIP, Círculo Azul, ECAC, Sistema de Cajas (Sicatel)",
    "Option 3": "Remedy, TEMIP, PAC, Sistema de Cajas (Sicatel)",
    "Correct Answer": "Remedy, TEMIP, Círculo Azul, Sistema de Cajas (Sicatel)"
  },
  {
    "Question Text": "139.- De acuerdo con la presentación de ISO 45001, ¿qué es la salud?",
    "Option 1": "Es la ausencia de enfermedad física",
    "Option 2": "Es la ausencia de enfermedad mental",
    "Option 3": "Es tener un cuerpo perfectamente tonificado",
    "Correct Answer": "Es el completo bienestar de los aspectos físico, mental y social."
  },
  {
    "Question Text": "140.- Según la norma ISO/IEC 20000-1:2011, ¿cuál es el objetivo del proceso Gestión de la Capacidad?",
    "Option 1": "Reducir al mínimo la capacidad de los sistemas para ahorrar energía",
    "Option 2": "Asegurar que todos los empleados tengan suficiente capacidad de almacenamiento",
    "Option 3": "Garantizar que los servidores estén siempre a plena capacidad",
    "Correct Answer": "Asegurar que los servicios de TI tengan en todo momento la capacidad suficiente para cubrir la demanda acordada"
  },
  {
    "Question Text": "141.- Según la norma ISO/IEC 20000-1:2011, ¿qué es un servicio de TI?",
    "Option 1": "Es cualquier producto físico relacionado con la tecnología de información",
    "Option 2": "Es la combinación de tecnología de información, personas y procesos que buscan responder a las necesidades que la empresa necesite .",
    "Option 3": "Es cualquier aplicación móvil",
    "Correct Answer": "Es la combinación de tecnología de información, personas y procesos que buscan responder a las necesidades de un usuario."
  },
  {
    "Question Text": "142.- Según la norma ISO/IEC 20000-1:2011, ¿qué es un usuario interno de TI?",
    "Option 1": "Es un desarrollador de software",
    "Option 2": "Es un usuario que normalmente  interactúa con un sistema o aplicación",
    "Option 3": "Es un empleado que trabaja en el área de ventas",
    "Correct Answer": "Es una persona que utiliza los servicios de TI en el día a día"
  },
  {
    "Question Text": "143.- ¿Cuáles son algunos de los valores de Telcel?",
    "Option 1": "Experiencia al cliente, innovación, , competencia, rentabilidad",
    "Option 2": "Cumplimiento de objetivos, liderazgo, profesionalismo, Experiencia al cliente, innovación, ",
    "Option 3": "Experiencia al cliente, innovación, desarrollo humano, sustentabilidad, integridad y responsable",
    "Correct Answer": "Experiencia al cliente, innovación, desarrollo humano, sustentabilidad, integridad y eficiencia"
  },
  {
    "Question Text": "144.- Al reducir peligros, riesgos y accidentes, ¿en qué contribuimos?",
    "Option 1": "Incrementar la productividad",
    "Option 2": "Reducir costos operativos",
    "Option 3": "Aumentar la eficiencia administrativa",
    "Correct Answer": "Contar con un lugar de trabajo seguro y saludable"
  },
  {
    "Question Text": "145.- El enunciado “como parte de una comunidad empresarial, todos debemos velar por la imagen de nuestra compañía, que se puede ver seriamente afectada si no cumplimos con esas normas básicas de ética y conducta” hace referencia a:",
    "Option 1": "El manual de procedimientos",
    "Option 2": "El plan de marketing",
    "Option 3": "La política de recursos humanos",
    "Correct Answer": "El código de ética"
  },
  {
    "Question Text": "146.- ¿Cómo se define el daño que se presenta en la condición física, mental o cognitiva de una persona?",
    "Option 1": "Accidente laboral",
    "Option 2": "Incapacidad temporal",
    "Option 3": "Enfermedad crónica",
    "Correct Answer": "Deterioro de salud"
  },
  {
    "Question Text": "147.- ¿Por qué tenemos un código de ética?",
    "Option 1": "Porque es requerido por las regulaciones gubernamentales",
    "Option 2": "Para establecer reglas estrictas de comportamiento personal",
    "Option 3": "Para aumentar la productividad en el lugar de trabajo",
    "Correct Answer": "Actuar conforme a los valores de la empresa es esencial para la continuidad de nuestras operaciones y como parte de una cultura de integridad"
  },
  {
    "Question Text": "148.- ¿Cuáles son los principales parámetros de autenticación para una tarjeta SIM en una red GSM?",
    "Option 1": "ICCID, PUK, PIN y ESN",
    "Option 2": "MSISDN, ICCID, IMEI y SIM",
    "Option 3": "PLMN, TMSI, EIR y HLR",
    "Correct Answer": "IMSI, KI, RND y KC."
  },
  {
    "Question Text": "149.- ¿Cómo demuestra la alta dirección su liderazgo y compromiso ante la SST?",
    "Option 1": "Asignando esta responsabilidad al departamento de Recursos Humanos",
    "Option 2": "Contratando a un consultor externo",
    "Option 3": "Dejando la responsabilidad a los trabajadores",
    "Correct Answer": "Asumiendo la total responsabilidad y rendición de cuentas para la prevención de las lesiones y el deterioro de la salud relacionados con el trabajo, así como la provisión de actividades y lugares de trabajo seguros y saludables."
  },
  {
    "Question Text": "150.- ¿Cuál es el propósito de un sistema de gestión de seguridad y salud en el trabajo (SGSST)?",
    "Option 1": "Asegurar la máxima productividad en el lugar de trabajo",
    "Option 2": "Proporcionar un marco de referencia para gestionar los riesgos y oportunidades para cumplir con las regulaciones gubernamentales",
    "Option 3": "Generar ganancias para la empresa",
    "Correct Answer": "Proporcionar un marco de referencia para gestionar los riesgos y oportunidades para la seguridad y salud en el trabajo (SST)."
  },
  {
    "Question Text": "151.- El alcance de la seguridad y salud en el trabajo (SST) contempla:",
    "Option 1": "Solo los trabajadores internos de la empresa",
    "Option 2": "Solo los trabajadores que están en funciones de alto riesgo",
    "Option 3": "Solo los trabajadores que trabajan a tiempo completo",
    "Correct Answer": "Los trabajadores internos, externos, visitantes y clientes que se encuentren en los centros de trabajo"
  },
  {
    "Question Text": "152.- La siguiente afirmación es parte de las políticas de seguridad y salud de los trabajadores:",
    "Option 1": "Dejar que los empleados y contratistas decidan si cumplen o no con las medidas de seguridad",
    "Option 2": "Ignorar los actos inseguros si no representan un peligro inmediato",
    "Option 3": "Solo los gerentes tienen la responsabilidad de seguridad y salud",
    "Correct Answer": "Vigilar que todos los empleados y contratistas cumplan con las medidas de seguridad y salud en caso de ser necesario cuestionar y suspender cualquier acto inseguro que observen sin temor a ser sancionados"
  },
  {
    "Question Text": "153.- La siguiente afirmación es parte de la política de seguridad y salud de los trabajadores:",
    "Option 1": "Decidir si usar el equipo de protección personal según su preferencia",
    "Option 2": "Ignorar las medidas de seguridad y salud si son incómodas",
    "Option 3": "Usar el equipo de protección personal solo en áreas de bajo riesgo",
    "Correct Answer": "Cumplir con las medidas de seguridad y salud y usar el equipo de protección personal de acuerdo con la naturaleza de su función laboral, especialmente en aquellas áreas o funciones de alto riesgo."
  },
  {
    "Question Text": "154.- De acuerdo con la presentación de ISO 45001, ¿qué es seguridad?",
    "Option 1": "La protección de activos físicos",
    "Option 2": "La detección temprana de peligros",
    "Option 3": "La prevención de riesgos en el trabajo",
    "Correct Answer": "La ausencia de riesgo"
  },
  {
    "Question Text": "155.- ¿Qué responsabilidades tienen los directores, subdirectores y gerentes en el proceso de mejora continua?",
    "Option 1": "Delegar la responsabilidad en los empleados de nivel inferior",
    "Option 2": "Asumir que las acciones correctivas se resolverán por sí mismas",
    "Option 3": "Ignorar las acciones correctivas si no tienen impacto inmediato",
    "Correct Answer": "Validar que la acción cumpla con lo requerido en P-00-00-00-00-00-007 Acciones Correctivas, facilitar los recursos, supervisar su avance y tomar las acciones pertinentes en caso de no existir avances."
  },
  {
    "Question Text": "156.- ¿Cuál es el término utilizado mayormente para describir las celdas pequeñas que aumentan la capacidad en un área determinada?",
    "Option 1": "Nanoceldas",
    "Option 2": "Megaceldas",
    "Option 3": "Miniceldas",
    "Correct Answer": "Microceldas"
  },
  {
    "Question Text": "157.- ¿Qué término se utiliza para describir las celdas utilizadas para un área muy pequeña, como el piso de un edificio?",
    "Option 1": "Gigaceldas",
    "Option 2": "Kiloceldas",
    "Option 3": "Millaceldas",
    "Correct Answer": "Picoceldas"
  },
  {
    "Question Text": "158.- ¿Cuál es el alcance de la banda 2.5 GHz y 5 GHz?",
    "Option 1": "2.5 GHz: 50 metros, 5 GHz: 100 metros",
    "Option 2": "2.5 GHz: 200 metros, 5 GHz: 20 metros",
    "Option 3": "2.5 GHz: 20 metros, 5 GHz: 200 metros",
    "Correct Answer": "2.5 GHz: 100 metros, 5 GHz: 50 metros"
  },
  {
    "Question Text": "159.- Si un cliente se presenta a solicitar un equipo de más de 180 días y el equipo se encuentra en el CAC, ¿qué procedimiento se debe seguir?",
    "Option 1": "Se rechaza la solicitud del cliente",
    "Option 2": "Se envía el equipo a reparación",
    "Option 3": "Se genera un nuevo equipo sin costo",
    "Correct Answer": "Se realiza folio SERTE indicando el trámite y se factura en 0 debido a que ya tiene material"
  },
  {
    "Question Text": "160.- ¿Cuáles son los 4 objetivos estratégicos para lograr los resultados de Telcel?",
    "Option 1": "Innovación, expansión internacional, adquisición de competidores, eficiencia operativa",
    "Option 2": "Diversificación de servicios, relaciones públicas, captación de inversores, expansión de redes",
    "Option 3": "Reducción de costos, incremento de precios, externalización de servicios, expansión geográfica",
    "Correct Answer": "Satisfacción del cliente, crecimiento, liderazgo, rentabilidad"
  },
  {
    "Question Text": "161.- ¿Cuáles son los requisitos para acceder a la red 5G?",
    "Option 1": "SIM card versión 5.0, cobertura y equipo compatible con la red 5G",
    "Option 2": "SIM card versión 6.2, solo equipo compatible con la red 5G",
    "Option 3": "SIM card versión 6.2, cobertura 4G",
    "Correct Answer": "SIM card versión 6.2, cobertura y equipo compatible con la red 5G"
  },
  {
    "Question Text": "162.- ¿Qué modulación utiliza GSM?",
    "Option 1": "QPSK (Quadrature Phase Shift Keying)",
    "Option 2": "FSK (Frequency Shift Keying)",
    "Option 3": "PSK (Phase Shift Keying)",
    "Correct Answer": "GMSK (Gaussian Minimum Shift Keying)"
  },
  {
    "Question Text": "163.- ¿Qué significa ICCID?",
    "Option 1": "International Calling Card Identifier",
    "Option 2": "Individual Cellular Communication Identifier",
    "Option 3": "Internal Circuit Connection Detail",
    "Correct Answer": "Integrated Circuit Card Identification"
  },
  {
    "Question Text": "164.- Las líneas VoLTE no son compatibles con los siguientes servicios:",
    "Option 1": "Mensajería de texto y navegación web",
    "Option 2": "Llamadas de larga distancia y correo de voz",
    "Option 3": "Navegación web y transferencia de datos",
    "Correct Answer": "Transferencia de llamadas y videoconferencia"
  },
  {
    "Question Text": "165.- ¿Cuál es el ancho de banda del canal ARFCN?",
    "Option 1": "400 kHz",
    "Option 2": "100 kHz",
    "Option 3": "800 kHz",
    "Correct Answer": "200 kHz"
  },
  {
    "Question Text": "166.- Menciona dos de los objetivos y los resultados previstos del sistema de gestión de la SST.",
    "Option 1": "Aumentar la productividad y reducir los costos operativos",
    "Option 2": "Incrementar la rotación de personal y mejorar la satisfacción del cliente",
    "Option 3": "Disminuir la calidad de los servicios y aumentar la complejidad de los procesos",
    "Correct Answer": "Prevenir lesiones y deterioro de la salud relacionados con el trabajo y mantener áreas de trabajo seguras y saludables"
  },
  {
    "Question Text": "167.- ¿Cuál es el procedimiento para garantías de cargadores Apple de 20W y AirPods?",
    "Option 1": "Se reemplaza automáticamente por un cargador nuevo",
    "Option 2": "Se solicita al cliente que compre un nuevo cargador",
    "Option 3": "Se envía a reparación interna sin importar el estado",
    "Correct Answer": "AET realiza revisión básica, validación de falla y asesora al cliente para que pueda tramitar garantía mediante las líneas de soporte Apple."
  },
  {
    "Question Text": "168.- ¿En qué lugares se aplica el alcance de seguridad y salud en el trabajo?",
    "Option 1": "Únicamente en las oficinas corporativas",
    "Option 2": "Solo en las áreas de alto riesgo",
    "Option 3": "En las instalaciones de los proveedores",
    "Correct Answer": "En los centros y lugares de trabajo de Telcel a nivel nacional"
  },
  {
    "Question Text": "169.- ¿Cuándo sucede el soft handoff?",
    "Option 1": "Es cuando se pierde la señal por completo",
    "Option 2": "Es cuando el teléfono se apaga",
    "Option 3": "Es cuando el móvil cambia de celda",
    "Correct Answer": "Es cuando dos radiobases tienen enganchado momentáneamente al móvil."
  },
  {
    "Question Text": "170.- ¿Cuál es el código de la política de SST?",
    "Option 1": "SS-00-00-00-00-00-001",
    "Option 2": "OHS-00-00-00-00-00-123",
    "Option 3": "HSE-00-00-00-00-00-456",
    "Correct Answer": "PL-00-00-00-00-00-039"
  },
  {
    "Question Text": "171.- ¿Cuál es el proceso de garantía para un dispositivo IoT de la marca Huawei adquirido con Telcel?",
    "Option 1": "Se repara en el taller de la marca, sin importar la existencia",
    "Option 2": "Se devuelve al cliente sin ningún proceso",
    "Option 3": "Se recicla sin posibilidad de reemplazo",
    "Correct Answer": "Procede cambio por seed stock, se valida con JST existencia y si se cuenta con existencia en el CAC AP solicita a AV que lo facture, imprime diagnóstico y se entrega al cliente."
  },
  {
    "Question Text": "172.- En qué documento se describen las actividades para realizar la consulta y participación de los trabajadores",
    "Option 1": "Código de ética",
    "Option 2": "Manual de usuario",
    "Option 3": "Reporte de actividades",
    "Correct Answer": "PR-00.00.00.00.00-012"
  },
  {
    "Question Text": "173.- En la codificación de canales, ¿cuál es el canal para solicitar acceso al sistema?",
    "Option 1": "RRC (Radio Resource Control)",
    "Option 2": "BCCH (Broadcast Control Channel)",
    "Option 3": "AGCH (Access Grant Channel)",
    "Correct Answer": "RACH (Random Access Channel)"
  },
  {
    "Question Text": "174.- ¿Qué es GPRS?",
    "Option 1": "Es una red social para gamers",
    "Option 2": "Es un sistema de navegación por satélite",
    "Option 3": "Es una tecnología de carga inalámbrica",
    "Correct Answer": "Es un servicio de la comunicación de datos por medio de paquetes, es considerada la generación 2.5 entre la generación GSM y la tercera UMTS"
  },
  {
    "Question Text": "175.- ¿Qué es VoLTE?",
    "Option 1": "Es una tarjeta de video",
    "Option 2": "Es una marca de auriculares",
    "Option 3": "Es un sistema operativo",
    "Correct Answer": "Es la siguiente generación de llamadas de voz HD y Video mejorado, considerado como evolución de 4G LTE"
  },
  {
    "Question Text": "176.- ¿Cómo se denomina el canal físico de bajada?",
    "Option 1": "Uplink",
    "Option 2": "UARFCN",
    "Option 3": "ULTF",
    "Correct Answer": "Downlink"
  },
  {
    "Question Text": "177.- ¿Qué equipo deberá ingresar el asesor personalizado a servicio técnico para habilitación?",
    "Option 1": "Cualquier equipo sin importar su estado",
    "Option 2": "Solo equipos de la marca Samsung",
    "Option 3": "Equipos que tengan menos de 1 mes de uso",
    "Correct Answer": "Solo los equipos que se encuentren ligados a una línea en proceso de portabilidad o que esta ya se encuentre portada"
  },
  {
    "Question Text": "178.- ¿Qué propiedad de la información implica que no debe ser revelada ni puesta a disposición de individuos u organismos no autorizados?",
    "Option 1": "Integridad",
    "Option 2": "Disponibilidad",
    "Option 3": "Privacidad",
    "Correct Answer": "Confidencialidad"
  },
  {
    "Question Text": "179.- ¿Qué término se refiere a la preservación de la confidencialidad, integridad y disponibilidad de la información?",
    "Option 1": "Confidencialidad de la información",
    "Option 2": "Integridad de la información",
    "Option 3": "Privacidad de la información",
    "Correct Answer": "Seguridad de la información"
  },
  {
    "Question Text": "180.- ¿Qué derechos permiten controlar los datos personales?",
    "Option 1": "Derechos DRM (Digital Rights Management)",
    "Option 2": "Derechos HDCP (High-bandwidth Digital Content Protection)",
    "Option 3": "Derechos DMR (Digital Media Rights)",
    "Correct Answer": "Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)"
  },
  {
    "Question Text": "181.- ¿Qué es LTE?",
    "Option 1": "Línea de Tiempo Extendida, una técnica de planificación",
    "Option 2": "Logística y Transporte Eficiente, un servicio de mensajería",
    "Option 3": "Latencia y Transferencia Eficiente, un sistema de seguridad",
    "Correct Answer": "Long Term Evolution, una tecnología de comunicación móvil de alta velocidad"
  },
  {
    "Question Text": "182.- ¿Quién es la única persona que puede emitir un diagnóstico de servicio técnico?",
    "Option 1": "AV (Asesor de Venta)",
    "Option 2": "CAC (Centro de Atención a Clientes)",
    "Option 3": "JST (Jefe de Servicio Técnico)",
    "Correct Answer": "AET (Asesor de Servicio Técnico)"
  },
  {
    "Question Text": "183.- ¿Son los responsables de autorizar el inicio de acciones correctivas y de mejora, aprobar al lider y la integración de un equipo de trabajo para acciones en el sistema de mejora continua?",
    "Option 1": "Gerencia del cumplimiento de datos personales",
    "Option 2": "La Dirección del cumplimiento",
    "Option 3": "Gerencia del cumplimiento del SGI",
    "Correct Answer": "Alta Dirección"
  },
  {
    "Question Text": "184.- ¿El responsable del Departamento de Datos personales?",
    "Option 1": "Alta Dirección",
    "Option 2": "La Dirección del cumplimiento",
    "Option 3": "Gerencia del cumplimiento del SGI",
    "Correct Answer": "Gerencia del cumplimiento de datos personales"
  },
  {
    "Question Text": "185.- Son aquellos sucesos que surgen del trabajo o en el transcurso del trabajo, en el que se han producido lesiones",
    "Option 1": "Accidentes laborales",
    "Option 2": "Incidentes",
    "Option 3": "Accidentes e incidentes",
    "Correct Answer": "Incidentes Laborales"
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
