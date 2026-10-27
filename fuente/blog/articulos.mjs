// Los 5 artículos del blog. Cada uno se inspira en un artículo del sitio anterior (campo "original")
// y se reescribió con estructura SEO: palabra clave, respuesta directa, índice, preguntas y llamado a la acción.
// El cuerpo es HTML; cada <h2> necesita un id para el índice.
// audiencia: "org" lleva al formulario de propuesta; "fam" lleva a WhatsApp.
// Los artículos que publica el Estudio editorial viven en articulos-estudio.json (no se editan a mano aquí);
// van primero, del más reciente al más antiguo. Si un slug existe en los dos, gana el del Estudio.
// imagen: prefijo de las portadas en img/blog/ (por defecto el slug; "generica" si el artículo aún no tiene portada propia).
import fs from 'node:fs';

const MANUALES = [
{
  slug: 'neurodivergencia-en-el-trabajo',
  original: 'neurodivergencia-en-el-trabajo-cuando-la-barrera-no-es-el-talento-sino-el-entorno',
  categoria: 'Empresas',
  audiencia: 'org',
  tipo: 'Empresa',
  palabraClave: 'neurodivergencia en el trabajo',
  tituloSeo: 'Neurodivergencia en el trabajo: la barrera es el entorno',
  h1: 'Neurodivergencia en el trabajo: cuando la barrera no es el talento, sino el entorno',
  descripcion: 'Qué barreras enfrentan las personas neurodivergentes en el trabajo y cómo quitarlas sin bajar estándares. Guía práctica para líderes y RR. HH.',
  bajada: 'Muchas personas autistas, con TDAH o dislexia tienen el talento que su empresa necesita. Lo que las frena suele estar en la forma de seleccionar, comunicar y organizar el trabajo.',
  publicado: '2026-09-16',
  portada: { fondo: 'noche', eyebrow: 'Neuroinclusión laboral', titulo: 'La barrera no es el <em>talento</em>', etiqueta: 'es el entorno', recorte: 'trabajo' },
  resumen: [
    'La neurodivergencia es una forma distinta de procesar la información, no una falta de capacidad.',
    'Muchas barreras están en procesos comunes: entrevistas, instrucciones ambiguas, reuniones sin objetivo y cambios sin aviso.',
    'Los apoyos universales ayudan a todo el equipo y no obligan a nadie a revelar un diagnóstico.',
    'Neuroinclusión no es bajar estándares: es quitar obstáculos que no tienen que ver con el desempeño.'
  ],
  cuerpo: `
<p>Cuando se habla de neurodivergencia en el trabajo, la conversación suele girar en torno a lo que la persona debería mejorar: comunicarse distinto, adaptarse más rápido, organizarse mejor. Pero hay una pregunta más útil para cualquier empresa: <strong>¿qué barreras está creando nuestra propia forma de trabajar?</strong></p>
<p>Esta guía resume qué es la neurodivergencia en el contexto laboral, dónde aparecen las barreras más comunes y qué puede hacer su organización para que el talento se vea y se aproveche.</p>

<h2 id="que-es">Qué significa neurodivergencia en el trabajo</h2>
<p>Neurodivergencia describe las formas de pensar, aprender y procesar la información que difieren de lo que se considera típico. Incluye, entre otros, el autismo, el TDAH, la dislexia, la dispraxia y otras diferencias del aprendizaje.</p>
<p>En el trabajo, estas diferencias suelen venir acompañadas de fortalezas muy valiosas: atención al detalle, pensamiento sistemático, creatividad, capacidad de concentración profunda en temas de interés o una mirada distinta para resolver problemas. El reto aparece cuando el entorno está diseñado para un solo estilo de trabajo.</p>

<h2 id="barreras">Barreras que pueden parecer pequeñas</h2>
<p>La mayoría de las barreras no son intencionales. Son costumbres que nadie revisó. Estas son algunas de las más frecuentes:</p>
<ul>
  <li><strong>Entrevistas centradas casi solo en habilidades sociales</strong>, en lugar de en la capacidad real para hacer el trabajo.</li>
  <li><strong>Instrucciones ambiguas</strong> o que solo se dan de palabra.</li>
  <li><strong>Reuniones sin objetivo claro</strong> ni agenda previa.</li>
  <li><strong>Cambios constantes sin anticipación</strong> en tareas, horarios o prioridades.</li>
  <li><strong>Ambientes con muchos estímulos</strong>: ruido, luces intensas, interrupciones continuas.</li>
  <li><strong>Medir el compromiso por cuánto socializa una persona</strong>, y no por sus resultados.</li>
  <li><strong>Esperar un diagnóstico</strong> para recién ofrecer apoyo.</li>
</ul>
<p>Cada una por separado parece menor. Juntas, pueden hacer que una persona capaz se agote, rinda por debajo de su potencial o termine dejando la empresa.</p>

<h2 id="diagnostico">¿Es necesario que la persona revele un diagnóstico?</h2>
<p>No necesariamente. Muchas personas prefieren no compartirlo por temor al estigma, y otras ni siquiera tienen un diagnóstico formal.</p>
<p>Por eso cada vez más organizaciones apuestan por <strong>apoyos universales</strong>: prácticas que benefician a todo el equipo y que cualquiera puede usar sin dar explicaciones. Por ejemplo:</p>
<ul>
  <li>Instrucciones claras y por escrito, con fechas y prioridades visibles.</li>
  <li>Opciones de trabajo flexible cuando el puesto lo permite.</li>
  <li>Espacios tranquilos o la posibilidad de usar audífonos.</li>
  <li>Distintas formas de participar en reuniones: hablar, escribir en el chat o enviar aportes después.</li>
  <li>Procesos de selección que permitan demostrar capacidades de varias maneras, como una prueba práctica.</li>
</ul>

<h2 id="estandares">Neuroinclusión no significa bajar estándares</h2>
<p>Es una duda frecuente entre líderes. La respuesta está en distinguir entre <strong>el estándar de desempeño</strong> y <strong>las barreras innecesarias para alcanzarlo</strong>.</p>
<p>Si un puesto requiere entregar un informe preciso cada semana, ese es el estándar. Que la instrucción llegue en una conversación de pasillo, sin fecha ni formato, es una barrera. Quitarla no baja la exigencia: hace más probable que se cumpla.</p>

<h2 id="por-donde-empezar">Por dónde empezar en su empresa</h2>
<ol>
  <li><strong>Revise el proceso de selección.</strong> ¿Evalúa lo que el puesto realmente necesita?</li>
  <li><strong>Ordene la comunicación.</strong> Acuerdos por escrito, reuniones con agenda y cambios anunciados con tiempo.</li>
  <li><strong>Capacite a quienes lideran equipos.</strong> Son quienes más influyen en el día a día.</li>
  <li><strong>Pregunte al equipo.</strong> Una encuesta anónima sobre qué dificulta el trabajo suele revelar ajustes simples.</li>
  <li><strong>Busque acompañamiento especializado</strong> para diseñar un plan a la medida de su organización.</li>
</ol>
<p>La neuroinclusión empieza cuando dejamos de preguntarnos solo cómo adaptar a la persona y empezamos a revisar <strong>cómo está diseñado el entorno donde esperamos que rinda</strong>.</p>
`,
  faq: [
    { q: '¿Qué es la neurodivergencia en el trabajo?', a: 'Es la presencia en los equipos de personas que piensan y procesan la información de forma distinta a lo típico, como personas autistas, con TDAH o con dislexia. Hablar de neurodivergencia en el trabajo es revisar si los procesos de la empresa les permiten rendir y crecer.' },
    { q: '¿Una persona neurodivergente debe informar su diagnóstico a la empresa?', a: 'No está obligada. Por eso conviene ofrecer apoyos universales, como instrucciones por escrito o espacios tranquilos, que cualquiera puede usar sin revelar un diagnóstico.' },
    { q: '¿La neuroinclusión implica bajar las exigencias?', a: 'No. Se mantiene el estándar de desempeño y se quitan los obstáculos que no tienen relación con él, como instrucciones ambiguas o reuniones sin objetivo.' },
    { q: '¿Cómo ayuda NeuroInsight a las empresas?', a: 'Con capacitación para líderes y equipos, coaching y consultoría para revisar procesos y construir entornos laborales neuroinclusivos. Las sesiones son presenciales, con acompañamiento digital cuando hace falta.' }
  ]
},
{
  slug: 'ajustes-razonables-en-el-trabajo',
  original: 'ajustes-razonables-de-bajo-costo-y-alto-impacto-en-equipos-neurodiversos',
  categoria: 'Empresas',
  audiencia: 'org',
  tipo: 'Empresa',
  palabraClave: 'ajustes razonables en el trabajo',
  tituloSeo: 'Ajustes razonables en el trabajo: 10 ideas de bajo costo',
  h1: 'Ajustes razonables en el trabajo: 10 ideas de bajo costo y alto impacto para equipos neurodiversos',
  descripcion: 'Diez ajustes razonables simples y económicos que mejoran la claridad, el bienestar y el desempeño de equipos neurodiversos. Ejemplos listos para aplicar.',
  bajada: 'Hacer más inclusivo un equipo no siempre exige grandes inversiones. Muchas veces bastan cambios pequeños en la forma de comunicar, organizar y usar los espacios.',
  publicado: '2026-04-08',
  portada: { fondo: 'papel', eyebrow: 'Equipos neurodiversos', titulo: 'Ajustes que <em>suman</em>', lista: ['Instrucciones por escrito.', 'Reuniones con objetivo claro.', 'Espacios con menos ruido.', 'Pausas breves para regularse.'], recorte: 'cuaderno' },
  resumen: [
    'Un ajuste razonable es un cambio en la forma de trabajar que quita una barrera sin cambiar lo que se espera del puesto.',
    'Los más útiles suelen ser baratos: claridad, previsibilidad, menos estímulos y flexibilidad.',
    'Benefician a todo el equipo: menos errores, mejor comunicación y menos desgaste.',
    'Funcionan mejor cuando se acuerdan con la persona y se revisan con el tiempo.'
  ],
  cuerpo: `
<p>Cuando se habla de neuroinclusión, muchas empresas imaginan cambios complejos o costosos. En la práctica, gran parte de los <strong>ajustes razonables en el trabajo</strong> son simples, accesibles y tienen un impacto real en el desempeño y el bienestar.</p>
<p>Si una persona enfrenta barreras relacionadas con el ruido, la ambigüedad, la sobrecarga o la comunicación, lo que necesita no siempre es "más esfuerzo", sino un entorno más claro.</p>

<h2 id="que-son">Qué son los ajustes razonables</h2>
<p>Un ajuste razonable es un cambio en la forma, el lugar o las herramientas de trabajo que permite a una persona desempeñarse en igualdad de condiciones. Se llaman razonables porque son proporcionados: no alteran lo esencial del puesto ni suponen una carga excesiva para la organización.</p>
<p>En equipos neurodiversos, los ajustes suelen tocar cuatro áreas: <strong>comunicación, organización, entorno sensorial y flexibilidad</strong>.</p>

<h2 id="ideas">10 ajustes razonables de bajo costo</h2>
<h3>Comunicación</h3>
<ol>
  <li><strong>Instrucciones claras y por escrito</strong>, con el resultado esperado, la fecha y la prioridad.</li>
  <li><strong>Reuniones con objetivo y agenda</strong> enviados con anticipación, y un resumen con acuerdos al final.</li>
  <li><strong>Retroalimentación concreta</strong>: qué se hizo bien, qué cambiar y cómo, con ejemplos.</li>
</ol>
<h3>Organización</h3>
<ol start="4">
  <li><strong>Más previsibilidad</strong>: avisar los cambios de tareas u horarios con tiempo y explicar el motivo.</li>
  <li><strong>Tareas divididas en pasos</strong> con listas de verificación o tableros visibles.</li>
  <li><strong>Bloques de concentración</strong> protegidos, sin reuniones ni interrupciones.</li>
</ol>
<h3>Entorno sensorial</h3>
<ol start="7">
  <li><strong>Espacios con menos distractores</strong> o un puesto lejos de zonas de paso.</li>
  <li><strong>Permiso para usar audífonos</strong> o protectores auditivos, y luz menos intensa cuando sea posible.</li>
</ol>
<h3>Flexibilidad</h3>
<ol start="9">
  <li><strong>Pausas breves para regularse</strong> durante la jornada, sin tener que justificarlas.</li>
  <li><strong>Varias formas de reportar avances</strong>: por escrito, en una llamada corta o en una herramienta compartida.</li>
</ol>

<h2 id="por-que-importan">Por qué benefician a todo el equipo</h2>
<p>Estos ajustes no ayudan solo a una persona. Las instrucciones claras reducen errores, las reuniones con agenda ahorran tiempo y los espacios con menos ruido favorecen la concentración de cualquiera. Lo que se diseña para la diversidad termina mejorando la organización completa.</p>

<h2 id="como-implementarlos">Cómo implementarlos bien</h2>
<ul>
  <li><strong>Pregunte antes de suponer.</strong> La persona suele saber qué le ayuda.</li>
  <li><strong>Póngalo por escrito.</strong> Un acuerdo simple evita malentendidos cuando cambia la jefatura.</li>
  <li><strong>Revise cada cierto tiempo.</strong> Las necesidades y los puestos cambian.</li>
  <li><strong>Forme a quienes lideran.</strong> Un ajuste funciona si el equipo entiende para qué sirve.</li>
</ul>
<p>Promover ajustes razonables no es bajar estándares. Es crear condiciones más equitativas para que cada persona trabaje con claridad, bienestar y efectividad.</p>
`,
  faq: [
    { q: '¿Qué es un ajuste razonable en el trabajo?', a: 'Es un cambio en la forma, el lugar o las herramientas de trabajo que quita una barrera para que la persona se desempeñe en igualdad de condiciones, sin cambiar lo esencial del puesto.' },
    { q: '¿Los ajustes razonables son caros?', a: 'La mayoría no. Instrucciones por escrito, reuniones con agenda, pausas breves o permiso para usar audífonos tienen un costo mínimo o nulo.' },
    { q: '¿Hace falta un diagnóstico para pedir un ajuste?', a: 'Muchos ajustes pueden ofrecerse a todo el equipo sin pedir diagnóstico. Así nadie tiene que revelar información personal para trabajar en mejores condiciones.' },
    { q: '¿Pueden ayudarnos a definir los ajustes de nuestro equipo?', a: 'Sí. En NeuroInsight acompañamos a empresas con capacitación y consultoría para identificar barreras y diseñar ajustes a la medida de cada equipo.' }
  ]
},
{
  slug: 'escuelas-neuroincluyentes',
  original: 'escuelas-neuroincluyentes-estrategias-practicas-para-apoyar-a-estudiantes-neurodivergentes',
  categoria: 'Escuelas',
  audiencia: 'org',
  tipo: 'Centro educativo',
  palabraClave: 'escuelas neuroincluyentes',
  tituloSeo: 'Escuelas neuroincluyentes: 6 estrategias para el aula',
  h1: 'Escuelas neuroincluyentes: 6 estrategias prácticas para apoyar a estudiantes neurodivergentes',
  descripcion: 'Seis estrategias simples para docentes: claridad visual, previsibilidad, regulación y evaluación flexible para estudiantes con TEA, TDAH y más.',
  bajada: 'Una escuela neuroincluyente no "baja el nivel": diseña un aula donde más estudiantes pueden aprender y participar con dignidad.',
  publicado: '2024-05-08',
  portada: { fondo: 'cielo', eyebrow: 'Para centros educativos', titulo: 'Escuelas <em>neuro­incluyentes</em>', etiqueta: '6 estrategias para el aula', recorte: 'escuela' },
  resumen: [
    'Un aula neuroincluyente es más predecible, clara y segura para todo el grupo.',
    'Muchas conductas difíciles son comunicación de estrés, miedo o sobrecarga.',
    'Seis estrategias simples: claridad visual, previsibilidad, regulación, evaluación flexible, apoyos sensoriales y lenguaje respetuoso.',
    'La clave es diferenciar entre "no quiere" y "todavía no puede".'
  ],
  cuerpo: `
<p>Construir una <strong>escuela neuroincluyente</strong> no significa bajar el nivel académico. Significa diseñar entornos donde más estudiantes puedan aprender, participar y sentirse seguros. Cuando el equipo docente comprende la neurodivergencia (autismo, TDAH, diferencias de aprendizaje, perfiles sensoriales), el aula se vuelve más predecible y efectiva para todo el grupo.</p>

<h2 id="senales">Señales de que el aula necesita ajustes</h2>
<p>Estas situaciones no hablan de culpas, ni del estudiante ni del docente. Indican que algo del entorno podría ajustarse:</p>
<ul>
  <li>Dificultad frecuente para iniciar tareas o sostener la atención.</li>
  <li>Crisis ante cambios de rutina o transiciones entre actividades.</li>
  <li>Sobrecarga sensorial por ruido, luces, contacto físico o filas.</li>
  <li>Conflictos sociales repetidos o aislamiento.</li>
  <li>Cansancio emocional y conductas de escape: evitar, oponerse o faltar a clases.</li>
</ul>

<h2 id="estrategias">6 estrategias neuroinclusivas para el aula</h2>
<h3>1. Claridad visual</h3>
<p>Instrucciones divididas en pasos, ejemplos del resultado esperado, listas de verificación y relojes o temporizadores visibles. Lo que se ve se recuerda mejor que lo que solo se escucha.</p>
<h3>2. Previsibilidad</h3>
<p>Una agenda del día a la vista, avisos antes de cada cambio y rutinas consistentes. Saber qué viene reduce la ansiedad y libera energía para aprender.</p>
<h3>3. Espacios y tiempos para regularse</h3>
<p>Pausas cortas planificadas, un rincón de calma y una señal acordada para pedir un momento. Regularse a tiempo previene crisis.</p>
<h3>4. Evaluación flexible</h3>
<p>Ofrecer varias formas de demostrar lo aprendido: oral, escrita, con un proyecto o una presentación. Se evalúa el aprendizaje, no la habilidad para un único formato.</p>
<h3>5. Apoyos sensoriales</h3>
<p>Audífonos o protectores auditivos, un asiento preferencial lejos de puertas y ventanas, y materiales alternativos para manipular.</p>
<h3>6. Lenguaje respetuoso</h3>
<p>Describir necesidades y habilidades en lugar de hablar de "mala conducta". Las palabras del docente moldean cómo el grupo ve a cada estudiante.</p>

<h2 id="no-quiere-no-puede">Lo más importante: "no quiere" o "todavía no puede"</h2>
<p>Muchas conductas que parecen desafiantes son, en realidad, una forma de comunicar estrés, miedo o sobrecarga. Cuando el equipo docente aprende a leerlas así, puede responder con un ajuste oportuno en lugar de una sanción. El resultado suele ser menos crisis, mejor convivencia y más aprendizaje.</p>

<h2 id="programa">Cómo acompañamos a los centros educativos</h2>
<p>En NeuroInsight trabajamos con escuelas y colegios mediante talleres, charlas y consultoría para equipos docentes y de orientación. También desarrollamos el programa <strong>Escuelas Neuroincluyentes</strong>, que fortalece prácticas basadas en evidencia y cuida el bienestar del personal docente.</p>
<p class="nota">Este artículo es informativo y no reemplaza una valoración individual de cada estudiante.</p>
`,
  faq: [
    { q: '¿Qué es una escuela neuroincluyente?', a: 'Es un centro educativo que diseña sus aulas, rutinas y evaluaciones para que estudiantes con distintos perfiles neurológicos, como TEA, TDAH o dificultades de aprendizaje, puedan aprender y participar con dignidad.' },
    { q: '¿La neuroinclusión baja el nivel académico?', a: 'No. Mantiene los objetivos de aprendizaje y ofrece distintos caminos para alcanzarlos y demostrarlos.' },
    { q: '¿Qué estrategias funcionan con estudiantes neurodivergentes?', a: 'La claridad visual, la previsibilidad, las pausas para regularse, la evaluación flexible, los apoyos sensoriales y el lenguaje respetuoso son estrategias simples que benefician a todo el grupo.' },
    { q: '¿Qué es el programa Escuelas Neuroincluyentes?', a: 'Es el programa de NeuroInsight para centros educativos: talleres, charlas y consultoría para equipos docentes y de orientación, con prácticas basadas en evidencia y atención al bienestar docente.' }
  ]
},
{
  slug: 'senales-tempranas-tea-tdah',
  original: 'senales-tempranas-de-tea-y-tdah-que-observar-y-cuando-buscar-apoyo',
  categoria: 'Familias',
  audiencia: 'fam',
  palabraClave: 'señales de TEA y TDAH',
  tituloSeo: 'Señales tempranas de TEA y TDAH: guía para familias',
  h1: 'Señales tempranas de TEA y TDAH: qué observar y cuándo buscar apoyo',
  descripcion: 'Guía clara para familias: señales comunes de autismo (TEA) y TDAH, mitos frecuentes y cuándo conviene buscar una evaluación profesional.',
  bajada: 'Cuando en casa aparecen dudas sobre el desarrollo, la atención o las emociones, es normal preguntarse si hace falta una evaluación. Esta guía le ayuda a observar con calma.',
  publicado: '2026-02-23',
  portada: { fondo: 'papel', eyebrow: 'Guía para familias', titulo: 'Señales <em>tempranas</em>', etiqueta: 'TEA y TDAH: qué observar', recorte: 'lupa' },
  resumen: [
    'Las señales no son un diagnóstico: indican que vale la pena observar con atención.',
    'En TEA suelen verse diferencias en la comunicación social, preferencia por rutinas e intereses intensos.',
    'En TDAH, dificultad para regular la atención, impulsividad e inquietud.',
    'Conviene consultar si las señales se mantienen en el tiempo y afectan el bienestar, el aprendizaje o la convivencia.'
  ],
  cuerpo: `
<p>La neurodivergencia no es una falla: es una forma distinta de procesar el mundo. Aun así, cuando en casa aparecen dudas sobre el desarrollo, la atención, el lenguaje o la regulación emocional, es normal preguntarse: ¿será TEA? ¿será TDAH? ¿necesitamos una evaluación?</p>
<p>En NeuroInsight creemos que la claridad trae calma. Conocer las <strong>señales de TEA y TDAH</strong> y actuar a tiempo puede marcar una gran diferencia.</p>

<h2 id="tea">Señales que pueden aparecer en el TEA</h2>
<p>El Trastorno del Espectro Autista (TEA) se expresa de formas muy distintas en cada persona. Según la edad, pueden observarse:</p>
<ul>
  <li>Dificultad para interpretar gestos, turnos de conversación o reglas sociales implícitas.</li>
  <li>Preferencia marcada por las rutinas y malestar intenso ante los cambios.</li>
  <li>Intereses muy intensos o específicos.</li>
  <li>Sensibilidad a ruidos, texturas, luces o etiquetas de la ropa.</li>
  <li>Formas particulares de comunicarse: lenguaje literal, repetir frases (ecolalia) o menos contacto visual en algunos casos.</li>
</ul>

<h2 id="tdah">Señales que pueden aparecer en el TDAH</h2>
<p>En el Trastorno por Déficit de Atención e Hiperactividad (TDAH) es frecuente observar:</p>
<ul>
  <li>Dificultad para sostener la atención en tareas poco motivadoras.</li>
  <li>Impulsividad: interrumpir o actuar sin medir las consecuencias.</li>
  <li>Inquietud motora o sensación de "mente acelerada".</li>
  <li>Olvidos frecuentes, pérdida de objetos y desorganización.</li>
  <li>Emociones intensas que cambian rápido: frustración o irritabilidad.</li>
</ul>
<p><strong>Importante:</strong> muchas de estas señales también aparecen con estrés, falta de sueño, ansiedad, cambios familiares o exigencias escolares. Por eso la clave no es etiquetar, sino comprender el contexto.</p>

<h2 id="mitos">Mitos que generan más confusión</h2>
<ul>
  <li><strong>"Si habla bien, no puede ser TEA."</strong> Falso: hay perfiles muy diversos, y muchas personas autistas tienen un lenguaje muy desarrollado.</li>
  <li><strong>"Si se concentra horas en los videojuegos, no tiene TDAH."</strong> El TDAH no es falta de atención, sino dificultad para regularla. Ante lo que motiva mucho, la atención puede sostenerse.</li>
  <li><strong>"Es solo mala conducta."</strong> A veces lo que parece conducta es una necesidad que todavía no se ha comprendido.</li>
</ul>

<h2 id="cuando-consultar">¿Cuándo conviene buscar una evaluación?</h2>
<p>Considere buscar apoyo profesional si:</p>
<ul>
  <li>Las señales son frecuentes y se mantienen durante semanas o meses.</li>
  <li>Afectan el bienestar, la convivencia, el aprendizaje o la autoestima.</li>
  <li>La familia o la escuela ya probaron estrategias y no han sido suficientes.</li>
  <li>Hay crisis emocionales, rechazo a ir a la escuela, ansiedad marcada o agotamiento familiar.</li>
</ul>

<h2 id="evaluacion">Cómo es una evaluación en NeuroInsight</h2>
<p>Trabajamos con un enfoque humano y basado en evidencia, en sesiones presenciales:</p>
<ol>
  <li><strong>Escucha:</strong> conversamos con la familia y recogemos la historia y el contexto.</li>
  <li><strong>Evaluación integral</strong> según lo que se necesite: desarrollo, aprendizaje, funciones ejecutivas y perfil socioemocional, con instrumentos estandarizados como ADOS-2, ADI-R y las escalas Wechsler.</li>
  <li><strong>Devolución clara</strong> y un plan de acompañamiento con estrategias prácticas para la casa y la escuela.</li>
</ol>
<p class="nota">Este artículo es informativo y no reemplaza una evaluación profesional.</p>
`,
  faq: [
    { q: '¿Cuáles son las primeras señales del autismo (TEA)?', a: 'Pueden incluir diferencias en la comunicación social, preferencia marcada por las rutinas, intereses intensos y sensibilidad sensorial. Varían mucho entre personas y edades, por lo que solo una evaluación profesional puede confirmar un diagnóstico.' },
    { q: '¿Cuáles son las señales del TDAH en niños?', a: 'Dificultad para sostener la atención en tareas poco motivadoras, impulsividad, inquietud, olvidos y desorganización frecuentes, y emociones intensas que cambian rápido.' },
    { q: '¿A qué edad se puede evaluar TEA o TDAH?', a: 'Se puede evaluar a personas de todas las edades, desde la niñez hasta la adultez. Lo importante es consultar cuando las señales se mantienen en el tiempo y afectan la vida diaria.' },
    { q: '¿Cómo agendo una evaluación con NeuroInsight?', a: 'Escríbanos por WhatsApp al +506 7102 4989. Las sesiones son presenciales en San Rafael de Oreamuno, Cartago, con acompañamiento digital cuando hace falta.' }
  ]
},
{
  slug: 'burnout-autista-y-camuflaje',
  original: 'camuflaje-agotamiento-y-burnout-autista-cuando-verse-bien-tambien-cansa',
  categoria: 'Neurodivergencia',
  audiencia: 'fam',
  palabraClave: 'burnout autista',
  tituloSeo: 'Burnout autista y camuflaje: cuando verse bien cansa',
  h1: 'Camuflaje y burnout autista: cuando "verse bien" también cansa',
  descripcion: 'Qué es el camuflaje (masking), cómo se relaciona con el burnout autista, qué señales observar y qué ayuda a reducir el desgaste.',
  bajada: 'Algunas personas autistas pasan años ocultando o compensando sus diferencias para encajar. Desde afuera parece buena adaptación; por dentro, puede ser un esfuerzo agotador.',
  publicado: '2026-06-10',
  portada: { fondo: 'noche', eyebrow: 'Neurodivergencia', titulo: 'Burnout <em>autista</em>', etiqueta: 'Cuando verse bien también cansa', fantasma: 'burnout', recorte: 'mascara' },
  resumen: [
    'Camuflar es ocultar o compensar rasgos autistas para encajar, con un gran gasto de energía.',
    'Sostenerlo por mucho tiempo se asocia con estrés, agotamiento y burnout autista.',
    'El burnout autista es un cansancio profundo que puede reducir capacidades que antes eran posibles.',
    'Ayuda más cambiar el entorno que exigir más esfuerzo a la persona.'
  ],
  cuerpo: `
<p>Hay personas que pasan años esforzándose para parecer "bien" frente a los demás. Observan, imitan, ensayan respuestas, controlan sus gestos y sostienen conversaciones que les consumen muchísima energía. A esto se le llama <strong>camuflaje</strong> o <em>masking</em>, y hoy es uno de los temas más importantes en la conversación sobre autismo y salud mental.</p>
<p>El camuflaje puede ayudar a evitar el rechazo o a cumplir ciertas expectativas, pero tiene un costo. La investigación lo relaciona con más estrés, desgaste emocional y riesgo de <strong>burnout autista</strong>, sobre todo cuando se sostiene por mucho tiempo y en entornos poco comprensivos.</p>

<h2 id="que-es-camuflar">Qué es el camuflaje o masking</h2>
<p>Camuflar no es simplemente "portarse bien". Puede incluir:</p>
<ul>
  <li>Ocultar la incomodidad ante ruidos, luces o texturas.</li>
  <li>Forzarse a mantener el contacto visual.</li>
  <li>Copiar expresiones, gestos o formas de hablar de otras personas.</li>
  <li>Reprimir movimientos que ayudan a regularse.</li>
  <li>Ensayar de antemano cómo actuar para no ser juzgado.</li>
</ul>

<h2 id="esfuerzo-invisible">Cuando el esfuerzo no se nota</h2>
<p>Uno de los mayores problemas es que, desde afuera, la persona parece funcional, sociable o adaptada. Por dentro, puede estar usando una enorme cantidad de energía solo para sostener el día a día. Ese esfuerzo invisible deja poco margen para estudiar, trabajar, compartir o recuperarse. Por eso el camuflaje también es una de las razones por las que algunas personas, en especial muchas mujeres, reciben su diagnóstico en la adultez.</p>

<h2 id="burnout-autista">Qué es el burnout autista</h2>
<p>El burnout autista se describe como un estado de agotamiento profundo asociado a la presión constante de adaptarse, cumplir demandas y enfrentar barreras del entorno. Puede expresarse como cansancio extremo, mayor sensibilidad sensorial, irritabilidad, dificultad para sostener tareas habituales, necesidad de aislarse o la sensación de que cosas que antes eran posibles ahora cuestan mucho más.</p>

<h2 id="senales">Señales que vale la pena observar</h2>
<ul>
  <li>Agotamiento intenso después de socializar, estudiar o trabajar.</li>
  <li>Sensación de estar actuando o interpretando un papel.</li>
  <li>Menor tolerancia al ruido, los cambios o las demandas.</li>
  <li>Necesidad creciente de aislarse para recuperarse.</li>
  <li>Irritabilidad, saturación o "niebla mental".</li>
  <li>Sensación de no saber cuánto de lo que se muestra es auténtico.</li>
</ul>

<h2 id="dejar-de-camuflar">No siempre es seguro dejar de camuflar</h2>
<p>Hay que decirlo con claridad: no todas las personas pueden dejar de enmascarar de forma simple o inmediata. En muchos contextos, el camuflaje ha sido una forma de protegerse del rechazo, los conflictos o la exclusión. Por eso este tema se aborda desde la comprensión, nunca desde la culpa.</p>

<h2 id="que-ayuda">Qué puede ayudar</h2>
<p>Muchas veces ayuda más revisar el entorno que exigirle más a la persona:</p>
<ul>
  <li><strong>Espacios más claros y previsibles</strong>, con menos ambigüedad.</li>
  <li><strong>Pausas reales</strong> para recuperarse, sin tener que justificarlas.</li>
  <li><strong>Menos carga sensorial</strong> en casa, en el aula o en la oficina.</li>
  <li><strong>Expectativas comprensibles</strong> y acordadas.</li>
  <li><strong>Acompañamiento profesional</strong> para entender el propio perfil y construir estrategias sostenibles.</li>
</ul>
<p>Hablar de camuflaje y burnout autista nos recuerda algo central: <strong>verse bien no siempre significa estar bien</strong>. A veces, detrás de una aparente adaptación hay una persona profundamente cansada de sostener un esfuerzo que casi nadie ve.</p>
<p class="nota">Este artículo es informativo y no reemplaza una evaluación profesional.</p>
`,
  faq: [
    { q: '¿Qué es el masking o camuflaje autista?', a: 'Es el esfuerzo, consciente o no, por ocultar o compensar rasgos autistas para encajar: forzar el contacto visual, imitar gestos, reprimir movimientos de regulación o ensayar conversaciones.' },
    { q: '¿Qué es el burnout autista?', a: 'Es un estado de agotamiento profundo asociado a la presión prolongada de adaptarse a entornos poco comprensivos. Puede reducir la tolerancia sensorial y la capacidad para tareas que antes eran posibles.' },
    { q: '¿Cómo se recupera una persona del burnout autista?', a: 'Suele ayudar reducir las demandas y la carga sensorial, tener pausas reales, entornos más previsibles y acompañamiento profesional para entender el propio perfil y construir estrategias sostenibles.' },
    { q: '¿NeuroInsight atiende a personas adultas?', a: 'Sí. Acompañamos a personas de todas las edades, incluidas personas adultas que buscan una evaluación o comprender mejor su perfil.' }
  ]
}
];

const ESTUDIO = JSON.parse(fs.readFileSync(new URL('./articulos-estudio.json', import.meta.url), 'utf8'))
  .sort((a, b) => b.publicado.localeCompare(a.publicado));
export const ARTICULOS = [...ESTUDIO, ...MANUALES.filter((m) => !ESTUDIO.some((e) => e.slug === m.slug))];
