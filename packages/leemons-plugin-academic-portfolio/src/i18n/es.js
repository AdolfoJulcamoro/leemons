module.exports = {
  welcome_page: {
    page_title: 'Portafolio Académico',
    page_description:
      'El portafolio permite crear programas o etapas educativas y añadir asignaturas con curso, grupo, profesores... dentro de esta información, creamos un árbol visual para poder gestionar el portafolio, asignar alumnos, crear clusters, editar reglas y mucho más',
    hide_info_label: `Ok, ya lo tengo. Cuando la configuración esté completa, no muestres más esta información`,
    step_profiles: {
      title: 'Vincular perfiles',
      description:
        'El portafolio académico debe aclarar cuáles son los perfiles clave a trabajar. Sólo tendrá que hacerlo una vez.',
      btn: 'Vincular perfiles',
    },
    step_programs: {
      title: `Crear programas`,
      description:
        'Primaria, Secundaria, Bachillerato, Máster... define los programas y cursos que se ofrecen en tu organización',
      btn: 'Crear programas',
    },
    step_subjects: {
      title: 'Añadir asignaturas',
      description:
        'Con carga masiva o manualmente, crea tu portafolio de asignaturas relacionadas con un programa y curso específico.',
      btn: 'Añadir asignaturas',
    },
    step_tree: {
      title: 'Gestiona tu portafolio académico',
      description:
        'Define el tipo de árbol para tu sistema educativo específico y asiste a los estudiantes, crea grupos o edita la información',
      btn: 'Crea tu árbol',
    },
  },
  programs_page: {
    page_title: 'Programas de aprendizaje',
    page_description:
      'Primaria, Secundaria, Bachillerato, Máster... define los programas y cursos que se ofrecen en tu organización. Si no tiene etapas tradicionales, puede crear programas o cursos simples en su lugar',
    common: {
      select_center: 'Selecciona centro',
      add_program: 'Añadir nuevo programa',
      create_done: 'Programa creado',
      update_done: 'Programa actualizado',
    },
    setup: {
      title: 'Configurar un nuevo programa',
      editTitle: 'Editar programa',
      basicData: {
        step_label: 'Datos básicos',
        labels: {
          title: 'Datos básicos',
          name: 'Nombre del programa',
          abbreviation: 'Abreviatura del programa:',
          creditSystem: 'No es necesario el sistema de créditos',
          credits: 'Total de créditos',
          oneStudentGroup: 'Este programa sólo tiene un grupo de estudiantes',
          groupsIDAbbrev: 'Abreviatura del ID del grupo',
          maxGroupAbbreviation: 'Longitud máxima de la abreviatura de los grupos:',
          maxGroupAbbreviationIsOnlyNumbers: 'Sólo números',
          buttonNext: 'Siguiente',
        },
        descriptions: {
          maxGroupAbbreviation:
            'Si necesita crear más de un grupo de estudiantes (aulas) por asignatura, esta configuración le permite definir el formato de ID alfanumérico.',
        },
        placeholders: {
          name: 'Mi impresionante programa',
          abbreviation: 'HIGSxxxx',
        },
        helps: {
          abbreviation: '(8 char. max)',
          maxGroupAbbreviation: '(i.e: G01, G02, G03...)',
        },
        errorMessages: {
          name: { required: 'Campo requerido' },
          abbreviation: { required: 'Campo requerido' },
          maxGroupAbbreviation: { required: 'Campo requerido' },
        },
      },
      coursesData: {
        step_label: 'Cursos',
        labels: {
          title: 'Cursos',
          oneCourseOnly: 'Este programa tiene un solo curso',
          hideCoursesInTree:
            'Cursos ocultos en el árbol (no asignaturas anidadas detrás de los cursos)',
          moreThanOneAcademicYear: 'La misma asignatura puede ofrecerse en más de un año académico',
          maxNumberOfCourses: 'Número de cursos',
          courseCredits: 'Créditos por curso',
          courseSubstage: 'Subetapas del curso',
          haveSubstagesPerCourse: 'No hay subetapas por curso',
          substagesFrequency: 'Frecuencia',
          numberOfSubstages: 'Número de subetapas',
          subtagesNames: 'Nombre de las subetapas',
          useDefaultSubstagesName: 'Utilizar el nombre y la abreviatura por defecto',
          abbreviation: 'Abreviatura',
          maxSubstageAbbreviation: 'Longitud máxima de la abreviatura',
          maxSubstageAbbreviationIsOnlyNumbers: 'Sólo números',
          buttonNext: 'Siguiente',
          buttonPrev: 'Anterior',
        },
        placeholders: {
          substagesFrequency: 'Selecciona la frecuencia',
        },
        errorMessages: {
          useDefaultSubstagesName: { required: 'Campo requerido' },
          maxNumberOfCourses: { required: 'Campo requerido' },
          courseCredits: { required: 'Campo requerido' },
          substagesFrequency: { required: 'Campo requerido' },
          numberOfSubstages: { required: 'Campo requerido' },
          maxSubstageAbbreviation: { required: 'Campo requerido' },
        },
      },
      subjectsData: {
        step_label: 'Asignaturas',
        labels: {
          title: 'Asignaturas',
          standardDuration: 'Duración estándar de las asignaturas',
          allSubjectsSameDuration:
            'Todas las asignaturas tienen la misma duración que la subetapa de evaluación',
          numberOfSemesters: 'Número de semestres',
          periodName: 'Nombre del periodo',
          numOfPeriods: 'N. períodos',
          substagesFrequency: 'Frecuencia',
          knowledgeAreas: 'Abreviatura de las áreas de conocimiento',
          haveKnowledge: 'El programa tiene áreas de conocimiento',
          maxKnowledgeAbbreviation: 'Longitud máxima de la abreviatura de las áreas:',
          maxKnowledgeAbbreviationIsOnlyNumbers: 'Sólo números',
          subjectsIDConfig: 'Configuración del ID de los sujetos',
          subjectsFirstDigit: 'Primer dígito',
          subjectsDigits: 'Dígitos',
          buttonNext: 'Guardar programa',
          buttonPrev: 'Anterior',
          buttonAdd: 'Añadir',
          buttonRemove: 'Quitar',
        },
        helps: {
          maxKnowledgeAbbreviation: '(i.e: MKTG, MATH, HIST...)',
        },
        errorMessages: {
          periodName: { required: 'Campo requerido' },
          numOfPeriods: { required: 'Campo requerido' },
          substagesFrequency: { required: 'Campo requerido' },
        },
      },
      frequencies: {
        year: 'Anual',
        semester: 'Medio-año(Semestre)',
        quarter: 'Cuatrimestral',
        trimester: 'Trimestral',
        month: 'Mensual',
        week: 'Semanal',
        day: 'Diario',
      },
      firstDigits: {
        course: 'Nº Curso',
        none: 'Ninguno',
      },
    },
  },
  subject_page: {
    page_title: 'Configuración de temas',
    page_description:
      'Configura tus áreas de conocimiento/temas y tipo (troncales, optativas...), después puedes subir tu base de datos de asignaturas o añadirlas manualmente. Después de esto, usted está listo para crear su esquema de portafolio de árbol.',
    centerLabel: 'Centro',
    centerPlaceholder: 'Seleccione un centro',
    programLabel: 'Programa',
    programPlaceholder: 'Selecciona un programa',
    addKnowledgeDone: 'Conocimientos guardados',
    addSubjectTypeDone: 'Tipo de materia guardada',
    subjectCreated: 'Asignatura creada',
    classCreated: 'Clase creada',
    classUpdated: 'Clase actualizada',
    knowledge: {
      title: 'Áreas de conocimiento',
      name: 'Nombre',
      nameRequired: 'Campo obligatorio',
      abbreviation: 'Abbr',
      abbreviationRequired: 'Campo obligatorio',
      color: 'Color',
      colorRequired: 'Campo obligatorio',
      icon: 'Icono',
      creditsCourse: 'Cr. Curso',
      creditsProgram: 'Cr. Program',
      maxLength: 'Longitud máxima: {max}',
      onlyNumbers: 'Sólo números',
    },
    subjectTypes: {
      title: 'Tipos de materias',
      name: 'Nombre',
      nameRequired: 'Campo obligatorio',
      creditsCourse: 'Cr. Curso',
      creditsProgram: 'Cr. Programa',
      groupVisibility: 'Visibilidad del grupo',
      groupVisibilityLabel: 'Evitar grupos anidados',
    },
    subjects: {
      title: 'Asignaturas',
      course: 'Curso',
      id: 'ID',
      idRequired: 'Campo obligatorio',
      courseRequired: 'Campo obligatorio',
      subject: 'Asignatura',
      noSubjectsFound: 'No se encuentran asignaturas',
      subjectRequired: 'Campo requerido',
      knowledge: 'Conocimiento',
      knowledgeRequired: 'Campo requerido',
      subjectType: 'Tipo',
      subjectTypeRequired: 'Campo requerido',
      credits: 'Créditos',
      color: 'Color',
      colorRequired: 'Campo requerido',
      group: 'Grupo',
      substage: 'Substage',
      seats: 'Asientos',
      classroom: 'Aula',
      schedule: 'Horario',
      teacher: 'Profesor',
      description: 'Descripción',
      maxInternalIdLength: 'Deben ser {max} numeros',
    },
    tableActions: {
      add: 'Añadir',
      remove: 'Quitar',
      edit: 'Editar',
      accept: 'Aceptar',
      cancel: 'Cancelar',
    },
  },
  profiles_page: {
    page_title: 'Perfiles de la cartera académica',
    page_description:
      'En primer lugar, debemos vincular los perfiles del sistema con los perfiles personalizados que has creado en la plataforma. (Por favor, lee atentamente las características de cada perfil. Una vez vinculados los perfiles, no se puede deshacer)',
    save: 'Guardar',
    profileSaved: 'Perfiles guardados',
    profiles: 'Perfiles',
    teacher: 'Profesor',
    teacherDescription: 'Responsable de impartir las asignaturas de un programa/curso',
    teacherRequired: 'Campo requerido',
    student: 'Estudiante',
    studentDescription:
      'Asignado a un aula, estudia las asignaturas de su programa/curso con un profesor concreto',
    studentRequired: 'Campo requerido',
  },
};
