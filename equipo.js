const equipmentData = {
    hiab: {
        name: 'Grúas Articuladas HIAB', image: 'assets/fleet_hiab.jpg',
        intro: 'Soluciones con brazo hidráulico articulado para cargar, descargar, elevar y posicionar materiales en espacios de trabajo diversos.',
        services: [
            ['Carga y descarga de maquinaria', 'Manipulación controlada de equipos y componentes desde la plataforma del camión.'],
            ['Posicionamiento de materiales', 'Elevación y ubicación de estructuras, equipos y suministros en el punto requerido.'],
            ['Apoyo en montaje', 'Asistencia operativa para trabajos de instalación y ensamblaje en obra.']
        ]
    },
    telescopica: {
        name: 'Grúas Telescópicas', image: 'assets/fleet_telescopica.jpg',
        intro: 'Equipos móviles para maniobras de izaje que requieren alcance vertical, estabilidad y posicionamiento preciso.',
        services: [
            ['Izaje de maquinaria pesada', 'Elevación controlada para montaje, retiro o reubicación de equipos.'],
            ['Montaje de estructuras', 'Apoyo en instalación de componentes metálicos y elementos industriales.'],
            ['Maniobras en obra', 'Operaciones planificadas según accesos, terreno y condiciones del entorno.']
        ]
    },
    trailer: {
        name: 'Camiones Tráiler y Cama Baja', image: 'assets/fleet_trailer.jpg',
        intro: 'Transporte terrestre de maquinaria pesada, estructuras y cargas especiales con planificación de ruta y aseguramiento de carga.',
        services: [
            ['Traslado de maquinaria', 'Transporte de excavadoras, cargadores y otros equipos para construcción e industria.'],
            ['Transporte en cama baja', 'Movilización de cargas que requieren una plataforma de menor altura.'],
            ['Logística de carga especial', 'Coordinación de accesos, ruta, carga, sujeción y descarga en destino.']
        ]
    },
    hidroelevador: {
        name: 'Camiones Hidroelevadores', image: 'assets/fleet_hidroelevador.png',
        intro: 'Equipos con brazo articulado y canastilla para elevar personal de forma planificada en trabajos de mantenimiento e intervención en altura.',
        services: [
            ['Mantenimiento en altura', 'Acceso elevado para inspección y trabajos sobre infraestructura.'],
            ['Intervenciones técnicas', 'Apoyo para instalaciones, reparaciones y revisión de componentes elevados.'],
            ['Trabajos con canastilla', 'Elevación de personal mediante brazo articulado según las condiciones de la operación.']
        ]
    }
};

const key = new URLSearchParams(window.location.search).get('tipo') || 'hiab';
const equipment = equipmentData[key] || equipmentData.hiab;
document.title = `Servicios con ${equipment.name} | Grúas Zamora`;
document.getElementById('equipmentTitle').textContent = `Servicios realizados con ${equipment.name}`;
document.getElementById('servicesTitle').textContent = `Trabajos con ${equipment.name}`;
document.getElementById('equipmentIntro').textContent = equipment.intro;
document.getElementById('equipmentHero').style.backgroundImage = `linear-gradient(90deg, rgba(10,10,10,.96), rgba(10,10,10,.58)), url('${equipment.image}')`;

const services = document.getElementById('equipmentServices');
equipment.services.forEach(([title, description], index) => {
    const card = document.createElement('article');
    card.className = 'equipment-service-card';
    const number = document.createElement('span'); number.textContent = String(index + 1).padStart(2, '0');
    const heading = document.createElement('h3'); heading.textContent = title;
    const copy = document.createElement('p'); copy.textContent = description;
    card.append(number, heading, copy); services.appendChild(card);
});
