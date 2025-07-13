const materias = document.querySelectorAll('.materia');
const aprobadas = new Set();

// Mapa de requisitos de cada materia
const requisitos = {
  // CPC
  "134": ["132"],
  "139": [["131", "133"]],
  "136": ["135"],
  "145": ["135"],
  "138": ["136"],
  "137": ["136"],
  "140": ["136"],
  "142": ["134"],
  "141": [["134", "136"]],
  "163": [["133", "134", "137"]],
  "167": [["137", "140"]],
  "162": [["137", "145"]],
  "168": [["141", "139", "162"]],
  "169": [["145", "167"]],
  "idioma": [["163", "167", "162", "168", "169", "MIN3"]],

  // CPO
  "cpo1": ["142"],
  "cpo2": ["163"],
  "cpo3": [["141", "163"]],
  "cpo4": ["139"],
  "cpo5": ["169"],
  "cpo6": ["169"],
  "cpo7": ["168"],
  "cpo8": ["168"],
};

// Verifica si se puede activar la materia
function puedeActivarse(id) {
  const reqs = requisitos[id];
  if (!reqs) return true;

  return reqs.every(cond => {
    if (Array.isArray(cond)) {
      if (cond.includes("MIN3")) {
        // Caso especial para el nivel de idioma
        const aprobadasRelevantes = cond.filter(id => aprobadas.has(id));
        return aprobadasRelevantes.length >= 3;
      } else {
        return cond.every(r => aprobadas.has(r));
      }
    } else {
      return aprobadas.has(cond);
    }
  });
}

// Refresca visualmente las materias
function actualizarMaterias() {
  materias.forEach(m => {
    const id = m.dataset.id;
    if (aprobadas.has(id)) {
      m.classList.add('activa');
    } else {
      m.classList.remove('activa');
    }

    if (puedeActivarse(id) || aprobadas.has(id)) {
      m.style.opacity = '1';
      m.style.cursor = 'pointer';
    } else {
      m.style.opacity = '0.5';
      m.style.cursor = 'not-allowed';
    }
  });
}

// Escuchador de clics
materias.forEach(m => {
  m.addEventListener('click', () => {
    const id = m.dataset.id;

    if (!puedeActivarse(id) && !aprobadas.has(id)) return;

    if (aprobadas.has(id)) {
      aprobadas.delete(id);
    } else {
      aprobadas.add(id);
    }

    actualizarMaterias();
  });
});

// Inicializar
actualizarMaterias();
