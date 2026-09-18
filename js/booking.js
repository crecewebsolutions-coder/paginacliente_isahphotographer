/* ==========================================================================
   ISA HERNANDEZ PHOTO & MAKEUP LLC
   Interactive Booking & Reservation System (Bilingual ES / EN Support)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const wizard = document.querySelector('.booking-wizard-wrapper');
  if (!wizard) return;

  const steps = document.querySelectorAll('.booking-step-pane');
  const progressItems = document.querySelectorAll('.progress-step-item');
  const btnNext = document.querySelector('.btn-wizard-next');
  const btnPrev = document.querySelector('.btn-wizard-prev');
  const btnSubmit = document.querySelector('.btn-wizard-submit');
  const modal = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.btn-modal-close');
  const whatsappSendBtn = document.querySelector('.btn-whatsapp-send');
  const emailSendBtn = document.getElementById('btnBookingEmail');
  const dynamicContainer = document.getElementById('dynamicSessionContainer');

  let currentStep = 1;
  const totalSteps = steps.length;

  // Selected Booking Data Object
  const bookingData = {
    sessionKey: 'couples',
    sessionType: 'Parejas / Couple',
    selectedPackage: 'Sesión Romántica Casual',
    extraOption: 'Atardecer en el Desierto (Sedona / Saguaro)',
    customDetails: {
      category: 'Maternidad / Embarazo (Maternity)',
      duration: '1 a 2 Horas',
      people: '2 personas',
      services: ['Fotografía Profesional en Alta Resolución'],
      budget: 'Estándar ($300 - $600 USD)',
      visionText: ''
    },
    location: 'Estudio Phoenix (1825 E Northern Ave)',
    desiredDate: '',
    backupDate: '',
    peopleCount: '2 personas (Pareja)',
    addons: [],
    fullName: '',
    email: '',
    phone: '',
    referral: '',
    visionNotes: '',
    retainerAmount: '$50 USD'
  };

  // Helper for current language
  function isEnglish() {
    return (typeof currentLang !== 'undefined' && currentLang === 'en');
  }

  // Session type configs with packages and contextual questions
  const sessionConfigs = {
    couples: {
      icon: 'fa-user-group',
      titleEs: 'Opciones Personalizadas para Sesión de Parejas',
      titleEn: 'Custom Options for Couples Session',
      descEs: 'Selecciona la temática de su historia de amor para planear la sesión ideal:',
      descEn: 'Select the theme of your love story to plan the perfect session:',
      packages: [
        {
          id: 'c-casual',
          titleEs: 'Sesión Romántica Casual',
          titleEn: 'Casual Romantic Session',
          descEs: '1 hora · 2 cambios de vestuario · Estudio o Exterior al atardecer',
          descEn: '1 hour · 2 outfit changes · Studio or Outdoor golden hour'
        },
        {
          id: 'c-proposal',
          titleEs: 'Pedida de Mano Sorpresa (Proposal)',
          titleEn: 'Surprise Proposal & Engagement',
          descEs: 'Complicidad y coordinación secreta del momento + Fotos de compromiso',
          descEn: 'Secret coordination of the big moment + Engagement photoshoot'
        },
        {
          id: 'c-anniversary',
          titleEs: 'Aniversario de Bodas / Votos',
          titleEn: 'Wedding Anniversary / Vows',
          descEs: 'Celebración de hitos de pareja con estilo editorial y champaña',
          descEn: 'Milestone couple celebration with editorial aesthetic and champagne'
        }
      ],
      extraQuestionEs: 'Preferencia de ambiente y estilo:',
      extraQuestionEn: 'Atmosphere and style preference:',
      options: [
        { es: 'Atardecer en el Desierto (Sedona / Saguaro)', en: 'Desert Sunset (Sedona / Saguaro)' },
        { es: 'Estudio Privado Editorial (Phoenix)', en: 'Minimalist Editorial Studio (Phoenix)' },
        { es: 'Urbano y Elegante (Old Town Scottsdale)', en: 'Urban & Chic (Old Town Scottsdale)' }
      ]
    },
    families: {
      icon: 'fa-people-roof',
      titleEs: 'Opciones Personalizadas para Familia & Hitos',
      titleEn: 'Custom Options for Family & Milestones',
      descEs: 'Selecciona el tamaño de tu familia para adaptar las dinámicas y locación:',
      descEn: 'Select your family size to tailor session dynamics and location:',
      packages: [
        {
          id: 'f-nuclear',
          titleEs: 'Familia Nuclear (Hasta 5 personas)',
          titleEn: 'Immediate Family (Up to 5 people)',
          descEs: '1.5 hrs · Poses guiadas naturales y espontáneas · Mini-video Reels',
          descEn: '1.5 hrs · Guided natural & candid poses · Mini-video Reels'
        },
        {
          id: 'f-extended',
          titleEs: 'Familia Extendida (6 a 12 personas)',
          titleEn: 'Extended Family (6 to 12 people)',
          descEs: 'Abuelos, tíos, primos · Combinaciones de grupos grandes e individuales',
          descEn: 'Grandparents, aunts/uncles, cousins · Full group & sub-group photos'
        },
        {
          id: 'f-milestone',
          titleEs: 'Hito Familiar o Anual',
          titleEn: 'Family Milestone / Annual Memory',
          descEs: 'Celebración de crecimiento, primer añito o tradición anual',
          descEn: 'Celebrating growth, 1st birthday milestone or annual tradition'
        }
      ],
      extraQuestionEs: '¿Asistirán niños pequeños o mascotas?',
      extraQuestionEn: 'Will small children or pets attend?',
      options: [
        { es: 'Niños pequeños (traeremos juguetes favoritos)', en: 'Toddlers/Children (bringing favorite toys)' },
        { es: 'Mascotas bienvenidas (Pet-Friendly)', en: 'Pets joining us (Pet-Friendly)' },
        { es: 'Solo adultos / Jóvenes', en: 'Adults / Teens only' }
      ]
    },
    birthdays: {
      icon: 'fa-cake-candles',
      titleEs: 'Opciones de Celebración de Cumpleaños',
      titleEn: 'Birthday Celebration Options',
      descEs: 'Personaliza los props, temática y estilo de tu cumpleaños:',
      descEn: 'Customize your birthday props, theme and aesthetic:',
      packages: [
        {
          id: 'b-glam',
          titleEs: 'Glam Birthday Studio Edition',
          titleEn: 'Glam Birthday Studio Edition',
          descEs: '1.5 hrs · Fondo editorial, números LED/globos, look de fiesta',
          descEn: '1.5 hrs · Studio backdrop, LED numbers/balloons, party glam look'
        },
        {
          id: 'b-cakesmash',
          titleEs: 'Sesión con Pastel (Cake Smash / Adult Cake)',
          titleEn: 'Cake Session (Smash Cake / Adult Cake)',
          descEs: 'Fotos divertidas y elegantes con pastel temático y velas',
          descEn: 'Fun & elegant photos with custom aesthetic cake & candles'
        },
        {
          id: 'b-champagne',
          titleEs: 'Champagne & Party Celebration',
          titleEn: 'Champagne & Party Celebration',
          descEs: 'Botella con bengala/copas de vino + Mini-clip en video para Instagram',
          descEn: 'Sparkler champagne bottle/wine glasses + Instagram video clip'
        }
      ],
      extraQuestionEs: '¿Qué edad celebras y qué estilo buscas?',
      extraQuestionEn: 'What age are you celebrating and desired style?',
      options: [
        { es: 'Cumpleaños 18 o 21 (Juventud & Estilo)', en: '18th or 21st Birthday (Youth & Style)' },
        { es: 'Cumpleaños 30, 40 o 50 (Madurez & Elegancia)', en: '30th, 40th or 50th (Elegance & Confidence)' },
        { es: 'Cumpleaños Infantil / Bebé', en: 'Kids / Baby Birthday Celebration' }
      ]
    },
    graduations: {
      icon: 'fa-graduation-cap',
      titleEs: 'Opciones para Graduados & Seniors',
      titleEn: 'Senior & Graduation Options',
      descEs: 'Elige tu nivel de graduación para preparar los fondos y accesorios:',
      descEn: 'Select your graduation level to prepare backdrops & accessories:',
      packages: [
        {
          id: 'g-college',
          titleEs: 'Graduación Universitaria (College Senior)',
          titleEn: 'College / University Senior',
          descEs: '1 hr · Toga, estola, birrete + Outfit casual o profesional',
          descEn: '1 hr · Cap, gown, stole + Casual or professional business look'
        },
        {
          id: 'g-highschool',
          titleEs: 'High School Senior',
          titleEn: 'High School Senior',
          descEs: 'Retrato de fin de ciclo escolar · Estilo juvenil, deportes o hobbies',
          descEn: 'High school graduation portrait · Youthful style, sports/hobbies'
        },
        {
          id: 'g-postgrad',
          titleEs: 'Posgrado / Maestría / Doctorado',
          titleEn: 'Postgrad / Master / Ph.D.',
          descEs: 'Headshot académico y formal de alto nivel profesional',
          descEn: 'High-level professional and academic formal portrait'
        }
      ],
      extraQuestionEs: 'Institución / Universidad:',
      extraQuestionEn: 'Institution / University:',
      options: [
        { es: 'Arizona State University (ASU)', en: 'Arizona State University (ASU)' },
        { es: 'Grand Canyon University (GCU)', en: 'Grand Canyon University (GCU)' },
        { es: 'Otra Universidad / High School en AZ', en: 'Other University / High School in AZ' }
      ]
    },
    weddings: {
      icon: 'fa-ring',
      titleEs: 'Paquetes de Cobertura para Bodas',
      titleEn: 'Wedding Coverage Packages',
      descEs: 'Desde bodas íntimas hasta celebraciones de gala de día completo:',
      descEn: 'From intimate elopements to full-day luxury wedding celebrations:',
      packages: [
        {
          id: 'w-elopement',
          titleEs: 'Elopement / Boda Civil Íntima (2 Horas)',
          titleEn: 'Elopement / Intimate Civil Wedding (2 Hours)',
          descEs: 'Ceremonia civil/votos + Sesión de recién casados en locación romántica',
          descEn: 'Civil ceremony/vows + Romantic newlywed portraits on location'
        },
        {
          id: 'w-halfday',
          titleEs: 'Boda Media Jornada (5 Horas)',
          titleEn: 'Half-Day Wedding (5 Hours)',
          descEs: 'Preparativos finales, ceremonia religiosa/civil, sesión de novios y brindis',
          descEn: 'Final getting ready, ceremony, bride & groom session, and initial toasts'
        },
        {
          id: 'w-fullday',
          titleEs: 'Gran Gala Cobertura Total (8 a 10 Horas)',
          titleEn: 'Full-Day Luxury Coverage (8 to 10 Hours)',
          descEs: 'Día completo con segundo fotógrafo, desde el maquillaje hasta el baile final',
          descEn: 'Full day with second shooter, from bridal makeup to the final dance'
        }
      ],
      extraQuestionEs: '¿Tienes definidos los recintos de ceremonia y fiesta?',
      extraQuestionEn: 'Have you finalized ceremony & reception venues?',
      options: [
        { es: 'Sí, ceremonia y salón en el mismo recinto', en: 'Yes, ceremony & reception at the same venue' },
        { es: 'Sí, en dos lugares distintos en Phoenix Metro', en: 'Yes, two different locations in Phoenix Metro' },
        { es: 'Boda de destino en Sedona / Norte de AZ', en: 'Destination wedding in Sedona / Northern AZ' }
      ]
    },
    quinceaneras: {
      icon: 'fa-crown',
      titleEs: 'Opciones para Quinceañeras & Sweet 16',
      titleEn: 'Quinceañera & Sweet 16 Options',
      descEs: 'Celebra este gran hito con fotografía de ensueño y maquillaje de estudio:',
      descEn: 'Celebrate this milestone with dream photography & studio makeup:',
      packages: [
        {
          id: 'q-pre',
          titleEs: 'Sesión de Gala Pre-Quince (Estudio & Exterior)',
          titleEn: 'Pre-Quince Gala Session (Studio & Outdoor)',
          descEs: 'Sesión exclusiva con vestido de gala, tiara, ramos y fotos casuales',
          descEn: 'Exclusive session with ballgown, tiara, bouquet & casual look'
        },
        {
          id: 'q-event',
          titleEs: 'Misa + Sesión de Gala (4 Horas)',
          titleEn: 'Church Mass + Gala Session (4 Hours)',
          descEs: 'Cobertura solemne de la bendición/misa y sesión de fotos con damas y chambelanes',
          descEn: 'Blessing/mass coverage plus portraits with court of honor'
        },
        {
          id: 'q-complete',
          titleEs: 'Cobertura Completa Quinceañera (Hasta 8 Horas)',
          titleEn: 'Full Quinceañera Experience (Up to 8 Hours)',
          descEs: 'Preparativos, sesión solemne, vals familiar, brindis y fiesta',
          descEn: 'Getting ready, portraits, family waltz, toast and party celebration'
        }
      ],
      extraQuestionEs: 'Estilo del vestido de quinceañera:',
      extraQuestionEn: 'Quinceañera dress style/color:',
      options: [
        { es: 'Vestido Tradicional de Gran Volumen (Princesa)', en: 'Traditional Ballgown Princess Dress' },
        { es: 'Vestido Moderno / Sweet 16 Chic', en: 'Modern Chic / Sweet 16 Style' },
        { es: 'Varios vestidos / Cambio para baile sorpresa', en: 'Multiple dresses / Surprise dance outfit' }
      ]
    },
    branding: {
      icon: 'fa-briefcase',
      titleEs: 'Opciones de Personal Branding & Headshots',
      titleEn: 'Personal Branding & Headshots Options',
      descEs: 'Fotografía profesional de alto impacto para emprendedores, ejecutivos y creativos:',
      descEn: 'High-impact professional photography for entrepreneurs, executives & creatives:',
      packages: [
        {
          id: 'br-headshots',
          titleEs: 'Headshots Ejecutivos (1 Hora · 2 Outfits)',
          titleEn: 'Executive Headshots (1 Hour · 2 Outfits)',
          descEs: 'Fondo de estudio neutro/editorial, iluminación de revista para LinkedIn & CV',
          descEn: 'Neutral studio backdrop, magazine lighting for LinkedIn & web'
        },
        {
          id: 'br-lifestyle',
          titleEs: 'Lifestyle de Marca & Creador de Contenido (2 Horas)',
          titleEn: 'Brand Lifestyle & Content Creator (2 Hours)',
          descEs: 'Fotos en acción trabajando, detalles de producto, oficina o cafetería',
          descEn: 'In-action working photos, product details, office or aesthetic cafe'
        },
        {
          id: 'br-team',
          titleEs: 'Sesión para Equipo / Corporativo',
          titleEn: 'Corporate Team / Group Session',
          descEs: 'Headshots homogéneos para todo tu personal o socios comerciales',
          descEn: 'Consistent headshots for all staff members and business partners'
        }
      ],
      extraQuestionEs: 'Giro profesional o industria:',
      extraQuestionEn: 'Professional field or industry:',
      options: [
        { es: 'Bienes Raíces / Finanzas / Legal / Medicina', en: 'Real Estate / Finance / Law / Healthcare' },
        { es: 'Belleza / Moda / Fitness / Creador Digital', en: 'Beauty / Fashion / Fitness / Digital Creator' },
        { es: 'Artes / Gastronomía / Negocio Local', en: 'Arts / Culinary / Local Business' }
      ]
    },
    makeup: {
      icon: 'fa-paintbrush',
      titleEs: 'Opciones de Solo Maquillaje & Peinado Profesional',
      titleEn: 'Professional Makeup & Hair Styling Options',
      descEs: 'Maquillaje de alta durabilidad con acabado HD a prueba de luz y cámara:',
      descEn: 'Long-lasting HD makeup perfected for camera lighting & events:',
      packages: [
        {
          id: 'm-social',
          titleEs: 'Maquillaje Social de Gala',
          titleEn: 'Social Glam Event Makeup',
          descEs: 'Piel blindada, técnica de ojos según tu fisonomía y pestañas de visón 3D',
          descEn: 'Flawless longwear complexion, custom eye technique & 3D lashes'
        },
        {
          id: 'm-bridal',
          titleEs: 'Maquillaje de Novia con Prueba Previa',
          titleEn: 'Bridal Makeup with Consultation & Trial',
          descEs: 'Diseño integral del look nupcial, fijación extrema y prueba personalizada',
          descEn: 'Full bridal look design, extreme durability & personalized trial run'
        },
        {
          id: 'm-combo',
          titleEs: 'Combo Completo: Maquillaje + Peinado',
          titleEn: 'Full Combo: Makeup + Hair Styling',
          descEs: 'Maquillaje glam completo + Ondas Hollywood o Recogido editorial',
          descEn: 'Complete glam makeup + Hollywood waves or editorial updo'
        }
      ],
      extraQuestionEs: '¿Dónde prefieres recibir tu servicio?',
      extraQuestionEn: 'Where do you prefer to receive the service?',
      options: [
        { es: 'En Estudio de Isa (Phoenix, AZ)', en: 'At Isa\'s Studio (Phoenix, AZ)' },
        { es: 'A Domicilio / Hotel (Travel fee según zona)', en: 'On-Location / Hotel (Travel fee applies)' }
      ]
    },
    custom: {
      icon: 'fa-sliders',
      titleEs: 'Configuración Exhaustiva: Sesión Personalizada / Otro Tipo',
      titleEn: 'Bespoke Configuration: Custom Session / Other Type',
      descEs: 'Cuéntanos cada detalle de tu proyecto especial para preparar una propuesta a tu medida exacta:',
      descEn: 'Tell us every detail of your unique project to craft a fully tailored proposal:'
    }
  };

  // Helper to map card index to sessionKey
  function getSessionKeyByIndex(index) {
    const keys = ['couples', 'families', 'birthdays', 'graduations', 'weddings', 'quinceaneras', 'branding', 'makeup', 'custom'];
    return keys[index] || 'couples';
  }

  // 1. Render Dynamic Session Panel
  function renderDynamicSession(key) {
    if (!dynamicContainer) return;
    const en = isEnglish();
    const cfg = sessionConfigs[key] || sessionConfigs.couples;

    bookingData.sessionKey = key;

    if (key === 'custom') {
      // ULTRA-DETAILED "OTRO TIPO" FORM
      dynamicContainer.innerHTML = `
        <div class="dynamic-session-header">
          <i class="fa-solid fa-sliders"></i>
          <div>
            <h4>${en ? cfg.titleEn : cfg.titleEs}</h4>
            <p>${en ? cfg.descEn : cfg.descEs}</p>
          </div>
        </div>

        <div class="custom-detail-box">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-tag" style="margin-right: 0.4rem;"></i>
                ${en ? 'Specific Category / Theme *' : 'Temática o Categoría Específica *'}
              </label>
              <select id="customCategory" class="form-control">
                <option value="Maternidad / Embarazo (Maternity)">${en ? 'Maternity / Pregnancy Glow' : 'Maternidad / Embarazo (Maternity Glow)'}</option>
                <option value="Newborn / Recién Nacido / Bebé">${en ? 'Newborn / Baby / First Days' : 'Newborn / Recién Nacido / Bebé'}</option>
                <option value="Baby Shower / Gender Reveal">${en ? 'Baby Shower / Gender Reveal' : 'Baby Shower / Revelación de Sexo'}</option>
                <option value="Bautizo / Primera Comunión">${en ? 'Baptism / First Communion' : 'Bautizo / Primera Comunión'}</option>
                <option value="Evento Corporativo / Conferencia">${en ? 'Corporate Event / Conference' : 'Evento Corporativo / Conferencia'}</option>
                <option value="Fotografía de Producto / Moda / Lookbook">${en ? 'Product / Fashion / Lookbook' : 'Fotografía de Producto / Moda / Lookbook'}</option>
                <option value="Fiesta Privada / Celebración Familiar">${en ? 'Private Party / Family Celebration' : 'Fiesta Privada / Celebración Especial'}</option>
                <option value="Proyecto Artístico Único">${en ? 'Unique Artistic / Creative Project' : 'Proyecto Artístico Único / Conceptual'}</option>
                <option value="Otro tipo">${en ? 'Other (Describe below)' : 'Otro tipo (describir abajo)'}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-clock" style="margin-right: 0.4rem;"></i>
                ${en ? 'Estimated Duration Needed *' : 'Duración Estimada Requerida *'}
              </label>
              <select id="customDuration" class="form-control">
                <option value="1 Hora (Sesión express)">${en ? '1 Hour (Express session)' : '1 Hora (Sesión express)'}</option>
                <option value="1.5 a 2 Horas (Sesión completa)" selected>${en ? '1.5 to 2 Hours (Standard full session)' : '1.5 a 2 Horas (Sesión completa)'}</option>
                <option value="Media Jornada (4 Horas)">${en ? 'Half Day (4 Hours)' : 'Media Jornada (4 Horas)'}</option>
                <option value="Jornada Completa (8+ Horas)">${en ? 'Full Day (8+ Hours)' : 'Jornada Completa (8+ Horas)'}</option>
                <option value="Múltiples Días">${en ? 'Multi-Day Coverage' : 'Múltiples Días'}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-users" style="margin-right: 0.4rem;"></i>
                ${en ? 'Estimated Number of People *' : 'Número Estimado de Personas *'}
              </label>
              <input type="text" id="customPeople" class="form-control" value="${bookingData.customDetails.people || '1 a 3 personas'}" placeholder="${en ? 'e.g., 2 adults + 1 baby' : 'Ej. 2 adultos y 1 bebé'}">
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-hand-holding-dollar" style="margin-right: 0.4rem;"></i>
                ${en ? 'Estimated Budget Range' : 'Rango de Presupuesto Estimado'}
              </label>
              <select id="customBudget" class="form-control">
                <option value="Menos de $300 USD">${en ? 'Under $300 USD' : 'Menos de $300 USD'}</option>
                <option value="$300 - $600 USD" selected>${en ? '$300 - $600 USD (Standard Studio/Outdoor)' : '$300 - $600 USD (Estándar Estudio/Exterior)'}</option>
                <option value="$600 - $1,200 USD">${en ? '$600 - $1,200 USD (Extended/Event)' : '$600 - $1,200 USD (Extendida/Evento)'}</option>
                <option value="Más de $1,200 USD">${en ? 'Over $1,200 USD (Full Event/Commercial)' : 'Más de $1,200 USD (Evento completo/Comercial)'}</option>
                <option value="Flexible según cotización">${en ? 'Flexible / Open to quote' : 'Flexible según cotización y visión'}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-layer-group" style="margin-right: 0.4rem;"></i>
              ${en ? 'Services Required (Select all that apply):' : 'Servicios Combinados Requeridos (Marca los que apliquen):'}
            </label>
            <div class="custom-services-checklist">
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" value="Fotografía en Alta Resolución" checked>
                <span>${en ? 'High-Res Photography' : 'Fotografía en Alta Resolución'}</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" value="Maquillaje Profesional por Isa">
                <span>${en ? 'Professional Makeup by Isa' : 'Maquillaje Profesional por Isa'}</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" value="Peinado Profesional">
                <span>${en ? 'Hair Styling' : 'Peinado Profesional'}</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" value="Mini-video en vertical para Reels">
                <span>${en ? 'Short Video Clips for Reels' : 'Mini-video en vertical para Reels'}</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" value="Client Closet / Asistencia Vestuario">
                <span>${en ? 'Client Closet / Wardrobe Help' : 'Client Closet / Asistencia Vestuario'}</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" class="custom-srv-chk" value="Entrega Prioritaria Exprés">
                <span>${en ? 'Rush Express Delivery' : 'Entrega Prioritaria Exprés'}</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fa-solid fa-pen-nib" style="margin-right: 0.4rem;"></i>
              ${en ? 'Tell us in detail about your project and vision:' : 'Cuéntanos a detalle sobre tu proyecto y visión:'}
            </label>
            <textarea id="customVisionText" class="form-control" rows="3" placeholder="${en ? 'Describe your theme, color palette, inspiration references or specific requirements...' : 'Describe la temática, paleta de colores, referencias de inspiración o cualquier requerimiento específico...'}">${bookingData.customDetails.visionText || ''}</textarea>
          </div>
        </div>
      `;

      // Attach event listeners for custom inputs
      attachCustomListeners();
      bookingData.selectedPackage = en ? 'Custom Project / Bespoke' : 'Proyecto Personalizado a Medida';
      bookingData.extraOption = '';
    } else {
      // STANDARD SESSIONS WITH DYNAMIC PACKAGES & CONTEXTUAL QUESTIONS
      let packagesHtml = '';
      cfg.packages.forEach((pkg, idx) => {
        const isSelected = idx === 0;
        if (isSelected) {
          bookingData.selectedPackage = en ? pkg.titleEn : pkg.titleEs;
        }
        packagesHtml += `
          <div class="dynamic-option-card ${isSelected ? 'active' : ''}" data-pkg-title="${en ? pkg.titleEn : pkg.titleEs}">
            <div class="dynamic-option-title">
              <span>${en ? pkg.titleEn : pkg.titleEs}</span>
              <i class="fa-solid fa-circle-check" style="color: ${isSelected ? 'var(--text-dark)' : '#CCC'};"></i>
            </div>
            <div class="dynamic-option-desc">
              ${en ? pkg.descEn : pkg.descEs}
            </div>
          </div>
        `;
      });

      let optionsSelectHtml = '';
      if (cfg.options && cfg.options.length > 0) {
        bookingData.extraOption = en ? cfg.options[0].en : cfg.options[0].es;
        optionsSelectHtml = `
          <div class="form-group" style="margin-top: 1.2rem;">
            <label class="form-label">
              <i class="fa-solid fa-circle-dot" style="margin-right: 0.4rem;"></i>
              ${en ? cfg.extraQuestionEn : cfg.extraQuestionEs}
            </label>
            <select id="dynamicExtraOption" class="form-control">
              ${cfg.options.map(opt => `<option value="${en ? opt.en : opt.es}">${en ? opt.en : opt.es}</option>`).join('')}
            </select>
          </div>
        `;
      }

      dynamicContainer.innerHTML = `
        <div class="dynamic-session-header">
          <i class="fa-solid ${cfg.icon}"></i>
          <div>
            <h4>${en ? cfg.titleEn : cfg.titleEs}</h4>
            <p>${en ? cfg.descEn : cfg.descEs}</p>
          </div>
        </div>

        <label class="form-label" style="margin-bottom: 0.8rem; display: block;">
          <i class="fa-solid fa-sparkles" style="margin-right: 0.4rem;"></i>
          ${en ? 'Select Package or Variation:' : 'Selecciona el Paquete o Variante:'}
        </label>
        <div class="dynamic-options-grid">
          ${packagesHtml}
        </div>

        ${optionsSelectHtml}
      `;

      attachStandardListeners();
    }

    updateSummary();
  }

  function attachStandardListeners() {
    const pkgCards = dynamicContainer.querySelectorAll('.dynamic-option-card');
    pkgCards.forEach(card => {
      card.addEventListener('click', () => {
        pkgCards.forEach(c => {
          c.classList.remove('active');
          const icon = c.querySelector('.dynamic-option-title i');
          if (icon) icon.style.color = '#CCC';
        });
        card.classList.add('active');
        const icon = card.querySelector('.dynamic-option-title i');
        if (icon) icon.style.color = 'var(--text-dark)';

        bookingData.selectedPackage = card.getAttribute('data-pkg-title');
        updateSummary();
      });
    });

    const extraSelect = document.getElementById('dynamicExtraOption');
    if (extraSelect) {
      extraSelect.addEventListener('change', () => {
        bookingData.extraOption = extraSelect.value;
        updateSummary();
      });
    }
  }

  function attachCustomListeners() {
    const catSelect = document.getElementById('customCategory');
    const durSelect = document.getElementById('customDuration');
    const peopleInput = document.getElementById('customPeople');
    const budgetSelect = document.getElementById('customBudget');
    const visionArea = document.getElementById('customVisionText');
    const srvCheckboxes = dynamicContainer.querySelectorAll('.custom-srv-chk');

    function syncCustom() {
      bookingData.customDetails.category = catSelect ? catSelect.value : '';
      bookingData.customDetails.duration = durSelect ? durSelect.value : '';
      bookingData.customDetails.people = peopleInput ? peopleInput.value : '';
      bookingData.customDetails.budget = budgetSelect ? budgetSelect.value : '';
      bookingData.customDetails.visionText = visionArea ? visionArea.value : '';
      bookingData.customDetails.services = Array.from(srvCheckboxes)
        .filter(c => c.checked)
        .map(c => c.value);

      bookingData.selectedPackage = `${bookingData.customDetails.category} (${bookingData.customDetails.duration})`;
      bookingData.peopleCount = bookingData.customDetails.people;
      updateSummary();
    }

    if (catSelect) catSelect.addEventListener('change', syncCustom);
    if (durSelect) durSelect.addEventListener('change', syncCustom);
    if (peopleInput) peopleInput.addEventListener('input', syncCustom);
    if (budgetSelect) budgetSelect.addEventListener('change', syncCustom);
    if (visionArea) visionArea.addEventListener('input', syncCustom);
    srvCheckboxes.forEach(chk => chk.addEventListener('change', syncCustom));

    syncCustom();
  }

  // 2. Session Type selection cards (Step 1)
  const sessionCards = document.querySelectorAll('.session-choice-card');
  sessionCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      sessionCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const titleEl = card.querySelector('.choice-title');
      bookingData.sessionType = titleEl ? titleEl.textContent.trim() : (card.getAttribute('data-service') || 'Personalizada');
      
      const key = getSessionKeyByIndex(idx);
      renderDynamicSession(key);
    });
  });

  // 2. Add-ons change
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
  addonCheckboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      bookingData.addons = Array.from(addonCheckboxes)
        .filter(c => c.checked)
        .map(c => c.value);
      updateSummary();
    });
  });

  // 3. Wizard Step Navigation
  function showStep(stepNumber) {
    steps.forEach((step, idx) => {
      step.classList.toggle('active', idx + 1 === stepNumber);
    });

    progressItems.forEach((item, idx) => {
      if (idx + 1 < stepNumber) {
        item.classList.add('completed');
        item.classList.remove('active');
      } else if (idx + 1 === stepNumber) {
        item.classList.add('active');
        item.classList.remove('completed');
      } else {
        item.classList.remove('active', 'completed');
      }
    });

    if (btnPrev) btnPrev.style.display = stepNumber === 1 ? 'none' : 'inline-flex';
    if (btnNext) btnNext.style.display = stepNumber === totalSteps ? 'none' : 'inline-flex';
    if (btnSubmit) btnSubmit.style.display = stepNumber === totalSteps ? 'inline-flex' : 'none';

    window.scrollTo({
      top: wizard.offsetTop - 110,
      behavior: 'smooth'
    });
  }

  function validateCurrentStep() {
    const en = isEnglish();

    if (currentStep === 1) {
      if (!bookingData.sessionType) {
        alert(en ? 'Please select a session type to proceed.' : 'Por favor selecciona un tipo de sesión.');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      const dateInput = document.getElementById('bookingDesiredDate');
      const locationInput = document.querySelector('input[name="locationRadio"]:checked');
      if (!dateInput || !dateInput.value) {
        alert(en ? 'Please indicate your preferred session date.' : 'Por favor indica una fecha deseada.');
        return false;
      }
      bookingData.desiredDate = dateInput.value;
      const backupInput = document.getElementById('bookingBackupDate');
      bookingData.backupDate = backupInput ? backupInput.value : '';
      if (locationInput) {
        bookingData.location = locationInput.value;
      }
      const peopleInput = document.getElementById('bookingPeople');
      if (peopleInput) {
        bookingData.peopleCount = peopleInput.value;
      }
      return true;
    }

    if (currentStep === 3) {
      // Add-ons are optional, always valid
      return true;
    }

    if (currentStep === 4) {
      const nameInput = document.getElementById('clientName');
      const emailInput = document.getElementById('clientEmail');
      const phoneInput = document.getElementById('clientPhone');
      const termsChk = document.getElementById('agreeTerms');

      if (!nameInput || !nameInput.value.trim()) {
        alert(en ? 'Please enter your full name.' : 'Por favor introduce tu nombre completo.');
        nameInput.focus();
        return false;
      }
      if (!emailInput || !emailInput.value.trim()) {
        alert(en ? 'Please enter your email address.' : 'Por favor introduce tu correo electrónico.');
        emailInput.focus();
        return false;
      }
      if (!phoneInput || !phoneInput.value.trim()) {
        alert(en ? 'Please enter your phone number or WhatsApp.' : 'Por favor introduce tu teléfono o WhatsApp.');
        phoneInput.focus();
        return false;
      }
      if (termsChk && !termsChk.checked) {
        alert(en 
          ? 'Please accept the Official Terms & Cancellation Policy ($50 non-refundable retainer).' 
          : 'Por favor acepta las políticas oficiales y términos del servicio (anticipo de $50 USD).');
        return false;
      }

      bookingData.fullName = nameInput.value.trim();
      bookingData.email = emailInput.value.trim();
      bookingData.phone = phoneInput.value.trim();
      const refInput = document.getElementById('clientReferral');
      if (refInput) bookingData.referral = refInput.value;
      const notesInput = document.getElementById('clientNotes');
      if (notesInput) bookingData.visionNotes = notesInput.value;

      return true;
    }

    return true;
  }

  function updateSummary() {
    const summarySession = document.getElementById('summarySessionType');
    const summaryRetainer = document.getElementById('summaryRetainer');
    const summaryAddons = document.getElementById('summaryAddons');
    const en = isEnglish();

    if (summarySession) {
      if (bookingData.sessionKey === 'other') {
        summarySession.innerHTML = `<strong>${bookingData.sessionType}</strong><br><small style="color:var(--text-light); font-size:0.85rem;">${bookingData.customDetails.category} · ${bookingData.customDetails.duration}</small>`;
      } else if (bookingData.selectedPackage) {
        summarySession.innerHTML = `<strong>${bookingData.sessionType}</strong><br><small style="color:var(--text-light); font-size:0.85rem;">${bookingData.selectedPackage}</small>`;
      } else {
        summarySession.textContent = bookingData.sessionType;
      }
    }
    if (summaryRetainer) summaryRetainer.textContent = bookingData.retainerAmount;
    if (summaryAddons) {
      summaryAddons.textContent = bookingData.addons.length > 0 
        ? bookingData.addons.join(', ') 
        : (en ? 'None / To be decided' : 'Ninguno / Por definir');
    }
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateCurrentStep()) {
        currentStep++;
        updateSummary();
        showStep(currentStep);
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  }

  if (btnSubmit) {
    btnSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      if (validateCurrentStep()) {
        const en = isEnglish();

        // Show success modal with enriched bilingual details
        if (modal) {
          const modalText = document.getElementById('modalSummaryText');
          if (modalText) {
            let detailsHtml = '';
            if (bookingData.sessionKey === 'other') {
              detailsHtml = `
                <strong>${en ? 'Custom Category' : 'Categoría personalizada'}:</strong> ${bookingData.customDetails.category}<br>
                <strong>${en ? 'Estimated Duration' : 'Duración estimada'}:</strong> ${bookingData.customDetails.duration}<br>
                <strong>${en ? 'Participants' : 'Asistentes'}:</strong> ${bookingData.customDetails.people}<br>
                <strong>${en ? 'Services requested' : 'Servicios combinados'}:</strong> ${bookingData.customDetails.services.join(', ') || (en ? 'Custom photo' : 'Fotografía a medida')}<br>
                <strong>${en ? 'Budget range' : 'Presupuesto estimado'}:</strong> ${bookingData.customDetails.budget}<br>
              `;
            } else {
              detailsHtml = `
                <strong>${en ? 'Selected Package' : 'Paquete seleccionado'}:</strong> ${bookingData.selectedPackage || (en ? 'Standard' : 'Estándar')}<br>
                ${bookingData.extraOption ? `<strong>${en ? 'Style / Preference' : 'Preferencia / Estilo'}:</strong> ${bookingData.extraOption}<br>` : ''}
              `;
            }

            modalText.innerHTML = `
              <strong>${en ? 'Session' : 'Sesión'}:</strong> ${bookingData.sessionType}<br>
              ${detailsHtml}
              <strong>${en ? 'Preferred Date' : 'Fecha preferida'}:</strong> ${bookingData.desiredDate} ${bookingData.backupDate ? `(${en ? 'Backup' : 'Respaldo'}: ${bookingData.backupDate})` : ''}<br>
              <strong>${en ? 'Location' : 'Locación'}:</strong> ${bookingData.location}<br>
              <strong>${en ? 'Client' : 'Cliente'}:</strong> ${bookingData.fullName} (${bookingData.phone})<br>
              <strong>${en ? 'Email' : 'Correo'}:</strong> ${bookingData.email}<br>
              <strong>${en ? 'Booking Retainer' : 'Depósito de reserva'}:</strong> $50 USD ${en ? 'via Zelle or Cash to confirm date.' : 'vía Zelle o Efectivo para asegurar tu fecha.'}
            `;
          }
          modal.classList.add('active');
        }

        // Build enriched plain text message for WhatsApp and Email
        let messageText = '';
        let emailSubject = '';

        if (en) {
          emailSubject = `Reservation Request - ${bookingData.sessionType} - ${bookingData.fullName}`;
          let specificSection = '';
          if (bookingData.sessionKey === 'other') {
            specificSection = 
              `• Custom Category: ${bookingData.customDetails.category}\n` +
              `• Estimated Duration: ${bookingData.customDetails.duration}\n` +
              `• Participants: ${bookingData.customDetails.people}\n` +
              `• Requested Services: ${bookingData.customDetails.services.join(', ') || 'Custom photo'}\n` +
              `• Estimated Budget: ${bookingData.customDetails.budget}\n` +
              `• Vision & Concepts: ${bookingData.customDetails.visionText || 'Bespoke project'}\n`;
          } else {
            specificSection = 
              `• Package / Variation: ${bookingData.selectedPackage || 'Standard'}\n` +
              (bookingData.extraOption ? `• Atmosphere & Style: ${bookingData.extraOption}\n` : '');
          }

          messageText = 
            `Hello Isa! I would like to reserve a session with Isa Hernandez Photo & Makeup LLC:\n\n` +
            `• Session Type: ${bookingData.sessionType}\n` +
            specificSection +
            `• Preferred Date: ${bookingData.desiredDate}\n` +
            `• Backup Date: ${bookingData.backupDate || 'N/A'}\n` +
            `• Location: ${bookingData.location}\n` +
            `• People Count: ${bookingData.peopleCount}\n` +
            `• Add-ons / Extras: ${bookingData.addons.join(', ') || 'None'}\n` +
            `• Full Name: ${bookingData.fullName}\n` +
            `• Email: ${bookingData.email}\n` +
            `• Phone: ${bookingData.phone}\n` +
            `• Retainer Deposit: Ready to send $50 USD via Zelle to lock date\n\n` +
            `Additional Notes: ${bookingData.visionNotes || 'Looking forward to our photoshoot!'}`;
        } else {
          emailSubject = `Solicitud de Reserva - ${bookingData.sessionType} - ${bookingData.fullName}`;
          let specificSection = '';
          if (bookingData.sessionKey === 'other') {
            specificSection = 
              `• Categoría personalizada: ${bookingData.customDetails.category}\n` +
              `• Duración estimada: ${bookingData.customDetails.duration}\n` +
              `• Asistentes / Personas: ${bookingData.customDetails.people}\n` +
              `• Servicios combinados: ${bookingData.customDetails.services.join(', ') || 'Fotografía a medida'}\n` +
              `• Rango de presupuesto: ${bookingData.customDetails.budget}\n` +
              `• Visión del proyecto: ${bookingData.customDetails.visionText || 'Proyecto especial'}\n`;
          } else {
            specificSection = 
              `• Paquete / Variante: ${bookingData.selectedPackage || 'Estándar'}\n` +
              (bookingData.extraOption ? `• Estilo / Preferencia: ${bookingData.extraOption}\n` : '');
          }

          messageText = 
            `¡Hola Isa! Quiero reservar una sesión con Isa Hernandez Photo & Makeup LLC:\n\n` +
            `• Tipo de sesión: ${bookingData.sessionType}\n` +
            specificSection +
            `• Fecha preferida: ${bookingData.desiredDate}\n` +
            `• Fecha de respaldo: ${bookingData.backupDate || 'N/A'}\n` +
            `• Locación: ${bookingData.location}\n` +
            `• Personas: ${bookingData.peopleCount}\n` +
            `• Extras / Maquillaje: ${bookingData.addons.join(', ') || 'Sin extras'}\n` +
            `• Nombre: ${bookingData.fullName}\n` +
            `• Correo: ${bookingData.email}\n` +
            `• Teléfono: ${bookingData.phone}\n` +
            `• Depósito $50 USD retainer: Listo para transferir vía Zelle para apartar fecha\n\n` +
            `Notas adicionales: ${bookingData.visionNotes || 'Quedo atenta para coordinar detalles.'}`;
        }

        // Setup WhatsApp link
        if (whatsappSendBtn) {
          whatsappSendBtn.href = `https://wa.me/16025823407?text=${encodeURIComponent(messageText)}`;
        }

        // Setup Email link
        if (emailSendBtn) {
          emailSendBtn.href = `mailto:Isavision21@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(messageText)}`;
        }
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Re-render dynamic options and update summary when language switches
  window.addEventListener('languageChanged', () => {
    if (bookingData.sessionKey) {
      renderDynamicSession(bookingData.sessionKey);
    }
    updateSummary();
  });

  // Initial step setup & render couples dynamic options by default
  renderDynamicSession('couples');
  showStep(1);
  updateSummary();
});
