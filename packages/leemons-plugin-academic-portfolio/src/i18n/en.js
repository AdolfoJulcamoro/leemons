module.exports = {
  welcome_page: {
    page_title: 'Academic Portfolio',
    page_description:
      'Portfolio allow you to create programs or educational stages and add subjects with course, group, professors… within this information, we create a visual tree in order to manage the portfolio, assign students, create clusters, edit rules and much more.',
    hide_info_label: `Ok, I've got it. When the configuration is complete, don't show this info anymore`,
    step_profiles: {
      title: 'Match profiles',
      description:
        'Academic portfolio needs to clarify which are the key profiles to work on. You will only need to do this once.',
      btn: 'Match profiles',
    },
    step_programs: {
      title: 'Create programs',
      description:
        'Elementary, High School, Bachelor, Masters… define the programs and courses offered in your organization.',
      btn: 'Create programs',
    },
    step_subjects: {
      title: 'Add subjects',
      description:
        'With bulk upload or manually, create your subjects portfolio related with an specific program and course.',
      btn: 'Add subjects',
    },
    step_tree: {
      title: 'Manage your academic portfolio',
      description:
        'Define the kind of tree for your specific education system and asssing students, create clusters or edit information.',
      btn: 'Create your tree',
    },
  },
  programs_page: {
    page_title: 'Learning programs',
    page_description:
      'Elementary, High School, Bachelor, Masters… define the programs and courses offered in your organization. If you do not have traditional stages, you can create simple programs or courses instead.',
    errorNoEvaluationSystems:
      'There are no evaluation systems defined. Please, create one or more evaluation systems.',
    errorNoEvaluationSystemsGoTo: 'Go to evaluation systems',
    common: {
      select_center: 'Select center',
      add_program: 'Add new program',
      create_done: 'Program created',
      update_done: 'Program updated',
    },
    setup: {
      title: 'Setup new program',
      editTitle: 'Edit program',
      basicData: {
        step_label: 'Basic Data',
        labels: {
          title: 'Basic Data',
          name: 'Program name',
          abbreviation: 'Program abbreviation',
          evaluationSystem: 'Evaluation system',
          creditSystem: 'No need for credit system',
          credits: 'Total credits',
          oneStudentGroup: 'This program has only one group of students',
          groupsIDAbbrev: 'Groups ID Abbreviation',
          maxGroupAbbreviation: 'Max abbreviation length for groups',
          maxGroupAbbreviationIsOnlyNumbers: 'Only numbers',
          buttonNext: 'Next',
        },
        descriptions: {
          maxGroupAbbreviation:
            'If you need to create more than one group of students (classrooms) per subject, this configuration allow you to define the alphanumeric ID format.',
        },
        placeholders: {
          name: 'My awesome program',
          abbreviation: 'HIGSxxxx',
        },
        helps: {
          abbreviation: '(8 char. max)',
          maxGroupAbbreviation: '(i.e: G01, G02, G03…)',
        },
        errorMessages: {
          name: { required: 'Required field' },
          abbreviation: { required: 'Required field' },
          evaluationSystem: { required: 'Required field' },
          maxGroupAbbreviation: { required: 'Required field' },
        },
      },
      coursesData: {
        step_label: 'Courses',
        labels: {
          title: 'Courses',
          oneCourseOnly: 'This program takes one course only',
          hideCoursesInTree: 'Hidden courses in the tree (not nested subjects behind courses)',
          moreThanOneAcademicYear: 'The same subject may be offered in more than one academic year',
          maxNumberOfCourses: 'Number of courses',
          courseCredits: 'Credits per course',
          courseSubstage: 'Course substages',
          haveSubstagesPerCourse: 'No substages per course',
          substagesFrequency: 'Frecuency',
          numberOfSubstages: 'Number of substages',
          subtagesNames: 'Name the substages',
          useDefaultSubstagesName: 'Use the default name and abbreviation',
          abbreviation: 'Abbreviation',
          maxSubstageAbbreviation: 'Max abbrevation length',
          maxSubstageAbbreviationIsOnlyNumbers: 'Only numbers',
          buttonNext: 'Next',
          buttonPrev: 'Previous',
        },
        placeholders: {
          substagesFrequency: 'Select frequency',
        },
        errorMessages: {
          useDefaultSubstagesName: { required: 'Required field' },
          maxNumberOfCourses: { required: 'Required field' },
          courseCredits: { required: 'Required field' },
          substagesFrequency: { required: 'Required field' },
          numberOfSubstages: { required: 'Required field' },
          maxSubstageAbbreviation: { required: 'Required field' },
        },
      },
      subjectsData: {
        step_label: 'Subjects',
        labels: {
          title: 'Subjects',
          standardDuration: 'Standard duration of the subjects',
          allSubjectsSameDuration:
            'All subjects have the same duraction as the evaluation substage',
          numberOfSemesters: 'Number of semesters',
          periodName: 'Period name',
          numOfPeriods: 'N. periods',
          substagesFrequency: 'Frecuency',
          knowledgeAreas: 'Knowledge areas abbreviation',
          haveKnowledge: 'Program have Knowledge areas',
          maxKnowledgeAbbreviation: 'Max abbreviation length for areas:',
          maxKnowledgeAbbreviationIsOnlyNumbers: 'Only numbers',
          subjectsIDConfig: 'Subjects ID configuration',
          subjectsFirstDigit: 'First digit',
          subjectsDigits: 'Digits',
          buttonNext: 'Save Program',
          buttonPrev: 'Previous',
          buttonAdd: 'Add',
          buttonRemove: 'Remove',
        },
        helps: {
          maxKnowledgeAbbreviation: '(i.e: MKTG, MATH, HIST…)',
        },
        errorMessages: {
          periodName: { required: 'Required field' },
          numOfPeriods: { required: 'Required field' },
          substagesFrequency: { required: 'Required field' },
        },
      },
      frequencies: {
        year: 'Annual',
        semester: 'Half-yearly(Semester)',
        quarter: 'Four-month period',
        trimester: 'Quarterly(Trimester/Quarter)',
        month: 'Monthly',
        week: 'Weekly',
        day: 'Daily',
      },
      firstDigits: {
        course: 'Course Nº',
        none: 'None',
      },
    },
  },
  subject_page: {
    page_title: 'Subjects configuration',
    page_description:
      'Configure your knowledge areas/topics and type (core, electives…), then you can upload your subject database or add them manually. After this, you are ready to create your tree portfolio schema.',
    centerLabel: 'Center',
    centerPlaceholder: 'Select a center',
    programLabel: 'Program',
    programPlaceholder: 'Select a program',
    addKnowledgeDone: 'Knowledge saved',
    addSubjectTypeDone: 'Subject type saved',
    subjectCreated: 'Subject created',
    groupCreated: 'Group created',
    classCreated: 'Class created',
    classUpdated: 'Class updated',
    goTree: 'Go to tree',
    knowledge: {
      title: 'Knowledge areas',
      name: 'Name',
      nameRequired: 'Required field',
      abbreviation: 'Abbr.',
      abbreviationRequired: 'Required field',
      color: 'Color',
      colorRequired: 'Required field',
      icon: 'Icon',
      creditsCourse: 'Cr. Course',
      creditsProgram: 'Cr. Program',
      maxLength: 'Max length: {max}',
      onlyNumbers: 'Only numbers',
    },
    subjectTypes: {
      title: 'Types of subjects',
      name: 'Name',
      nameRequired: 'Required field',
      creditsCourse: 'Cr. Course',
      creditsProgram: 'Cr. Program',
      groupVisibility: 'Group visibility',
      groupVisibilityLabel: 'Avoid nested groups',
    },
    subjects: {
      newTitle: 'New subject',
      title: 'Subjects',
      course: 'Course',
      id: 'ID',
      idRequired: 'Required field',
      courseRequired: 'Required field',
      subject: 'Subject',
      noSubjectsFound: 'No subjects found',
      subjectRequired: 'Required field',
      knowledge: 'Knowledge',
      knowledgeRequired: 'Required field',
      subjectType: 'Type',
      subjectTypeRequired: 'Required field',
      credits: 'Credits',
      color: 'Color',
      colorRequired: 'Required field',
      group: 'Group',
      substage: 'Substage',
      seats: 'Seats',
      classroom: 'Classroom',
      schedule: 'Schedule',
      teacher: 'Teacher',
      description: 'Description',
      maxInternalIdLength: 'Must be {max} numbers',
      groupAny: 'Must be {max} characters',
      groupNumbers: 'Must be {max} numbers',
    },
    tableActions: {
      add: 'Add',
      remove: 'Remove',
      edit: 'Edit',
      accept: 'Accept',
      cancel: 'Cancel',
    },
    programTreeType: {
      title: 'Portfolio tree schema',
      description1:
        'Config your portfolio tree view in order to adapt them to your specific program characteristics. You can change this setting whenever you need to.',
      note: 'NOTE:',
      description2:
        'You only see the schemas that fit with your previous configuration. “Group visibility” (from Subject type configuration), will be respect independent of tree schema chosen.',
      opt1Label: 'Classroom first',
      opt1Description: 'Program > Course > Group > Type > Area > Subject',
      opt1DescriptionNoCourse: 'Program > Group > Type > Area > Subject',
      opt2Label: 'Classroom + Area first',
      opt2Description: 'Program > Course > Group > Area > Type > Subject',
      opt2DescriptionNoCourse: 'Program > Group > Area > Type > Subject',
      opt3Label: 'Subject first',
      opt3Description: 'Program > Course > Type > Area > Subject',
      opt3DescriptionNoCourse: 'Program > Type > Area > Subject',
      opt4Label: 'Free schema',
      opt4Description: 'Program > Type > Area > Subject',
    },
  },
  profiles_page: {
    page_title: 'Academic portfolio - Profiles setup',
    page_description:
      'First of all we need to match the system profiles with the custom profiles you have created on the platform (Please read carefully the characteristics of each profile. Once the profiles are linked, it cannot be undone.)',
    save: 'Save',
    profileSaved: 'Saved profiles',
    profiles: 'Profiles',
    teacher: 'Teacher',
    teacherDescription: 'Responsible for teaching the subjects of a program/course',
    teacherRequired: 'Field required',
    student: 'Student',
    studentDescription:
      'Assigned to a classroom, studies the subjects of his program/course with a specific teachers',
    studentRequired: 'Field required',
  },
  tree_page: {
    page_title: 'Academic Portofolio Tree',
    page_description:
      'This is your Portfolio Tree, you can edit, duplicate or create new elements for your program. You also can assign students at any level (all subjects under it will inherit this task).',
    centerLabel: 'Select center',
    programLabel: 'Select program',
    programUpdated: 'Program updated',
    courseUpdated: 'Course updated',
    groupUpdated: 'Group updated',
    groupDuplicated: 'Group duplicated',
    knowledgeUpdated: 'Area updated',
    subjectTypeUpdated: 'Subject type updated',
    subjectUpdated: 'Subject updated',
    classUpdated: 'Class updated',
    lassCreated: 'Class created',
    treeEdit: 'Edit',
    treeRemove: 'Remove',
    treeDuplicate: 'Duplicate',
    groupsRemoved: 'Group removed from classes',
    classRemoved: 'Class removed',
    groupCreated: 'Group created',
    subjectTypeCreated: 'Subject type created',
    knowledgeCreated: 'Area created',
    newgroups: 'New group',
    newsubjectType: 'New subject type',
    newclass: 'New class',
    newknowledges: 'New area',
    newsubject: 'New subject',
    addUsers: {
      title: 'Assign Students',
      description:
        'Assign students to all classrooms nested on this level from the students database.',
      note: 'NOTE:',
      noteDescription:
        'selected students will be added to the current student lists for each classroom. If you want to consult or edit a group of students, you must do it directly in each classroom.',
      byTag: 'Select by tag',
      byData: 'Search by user data',
      addTag: 'Add tag',
      emailHeader: 'Email',
      nameHeader: 'Name',
      surnameHeader: 'Surname',
      birthdayHeader: 'Birthday',
      studentsFound: 'We have found {{count}} Students',
      selected: '{{count}} Selected',
      studentsError:
        '{{count}} students are already included in all classes and you can not add them again',
      studentsWarning:
        '{{count}} students are already included in one of the classes and you can add them to the rest of the classes.',
      seatsError1: 'The following classes are already fully booked:',
      seatsError2:
        'Please access each class individually and add as many students as you need, or reduce the number of students.',
      seatsClassError: '- {{className}} ({{seats}} seats left)',
      addStudent: 'Add student',
      userAlreadySelected: 'User already selected',
      removeUser: 'Remove',
    },
    program: {
      title: 'Program configuration',
      nameLabel: 'Program name:',
      abbreviationLabel: 'Program abbreviation/acronym:',
      abbreviationHelper: '8 char. max',
      creditsLabel: 'Total credits:',
      nameRequired: 'Required field',
      abbreviationRequired: 'Required field',
      creditsRequired: 'Required field',
      visitProgramDescription: 'For further configuration you have to visit',
      visitProgramLabel: '“Educational Programs”',
      save: 'Save',
    },
    course: {
      title: 'Course configuration',
      numberLabel: 'Course number:',
      nameLabel: 'Course alias:',
      nameHelper: 'i.e. “1st Grade”',
      creditsLabel: 'Minimum credits:',
      visitProgramDescription: 'For further configuration you have to visit',
      visitProgramLabel: '“Educational Programs”',
      save: 'Save',
    },
    group: {
      titleNew: 'New group',
      duplicateTitle: 'Duplicate group',
      duplicateWarning:
        'Al duplicar un grupo se crean nuevas aulas que heredan la configuración básica de las asignaturas anidadas en el grupo actual (como el tipo, o el área de conocimiento), pero hay que especificar un nuevo conjunto de alumnos, profesores, plazas, etc... para estas nuevas aulas.',
      title: 'Group configuration',
      abbreviationLabel: 'Group abbreviation:',
      abbreviationHelper: '3 char. max',
      aliasLabel: 'Group alias:',
      aliasHelper: 'i.e. “Main Group”',
      aliasRequired: 'Required field',
      groupAny: 'Must be {max} characters',
      groupNumbers: 'Must be {max} numbers',
      save: 'Save',
      assignSubjects: {
        title: 'Assign subjects',
        description1:
          'We will create new classrooms for this group from the selected subjects, latter you could assign new students and modify its properties.',
        notes: 'NOTE:',
        description2:
          ' If you wish to create a new group keeping all settings except assigned students, please use the "duplicate" option instead.',
      },
    },
    subjectType: {
      titleNew: 'New subject type',
      title: 'Subject type configuratión',
      nameLabel: 'Name:',
      nameRequired: 'Required field',
      crCourse: 'Credits course:',
      crProgram: 'Credits program:',
      nested: 'Avoid nested groups',
      save: 'Save',
      assignSubjects: {
        title: 'Assign/Re-asssign subjects',
        description:
          'We will modify or add the new type to the selected subjects, keeping the remaining information. You can do this manually by dragging the existing subjects to this new type in the tree.',
      },
    },
    knowledge: {
      titleNew: 'New area',
      title: 'Area configuration',
      nameLabel: 'Name:',
      nameRequired: 'Required field',
      abbreviationLabel: 'Abbreviation:',
      abbreviationHelper: '{max} char',
      abbreviationRequired: 'Required field',
      colorLabel: 'Color:',
      colorRequired: 'Required field',
      crCourse: 'Credits course:',
      crProgram: 'Credits program:',
      maxLength: 'Max length: {max}',
      save: 'Save',
      assignSubjects: {
        title: 'Assign/Re-asssign subjects',
        description:
          'We will modify or add the new area to the selected subjects, keeping the remaining information. You can do this manually by dragging the existing subjects to this new area in the tree.',
      },
    },
    class: {
      title: 'Subject configuration',
      subjectNameLabel: 'Subject name:',
      subjectNameRequired: 'Required field',
      subjectTypeRequired: 'Required field',
      knowledgeRequired: 'Required field',
      subjectType: 'Type',
      knowledge: 'Knowledge',
      classrooms: 'Classrooms',
      newClassroom: 'New classroom',
      save: 'Save',
      courseLabel: 'Course:',
      groupLabel: 'Group:',
      substageLabel: 'Substage:',
      seatsLabel: 'Seats:',
      knowledgeLabel: 'Area:',
      colorLabel: 'Color:',
      scheduleLabel: 'Schedule:',
      teacherLabel: 'Main Teacher:',
      teacherDescription: 'Assign a main teacher for this classroom',
      studentsLabel: 'Students:',
      addStudents: 'Add students',
      addStudentsDescription: 'Add students to this classroom',
      cancelAddStudents: 'Cancel',
      studentsAddedSuccessfully: 'Students added successfully',
      noStudentsYet: 'No students yet',
      findStudents: 'Find',
      changeTeacherButtonLabel: 'Change',
      newClass: 'New classroom',
    },
  },
  selectSubjectsByTable: {
    subjectTypeLabel: 'Subject type:',
    knowledgeLabel: 'Knowledge:',
    subjectLabel: 'Find subject:',
    tableId: 'ID',
    tableName: 'Name',
    tableKnowledge: 'Knowledge',
    tableType: 'Type',
  },
  userClassesSwiperWidget: {
    multiCourse: 'Multi-course',
  },
  tabDetail: {
    label: 'Classroom',
  },
};
