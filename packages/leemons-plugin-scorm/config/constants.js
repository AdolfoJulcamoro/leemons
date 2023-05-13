const permissionsPrefix = 'plugins.scorm';

const permissionNames = {
  creator: `${permissionsPrefix}.creator`,
};

const permissions = [
  {
    permissionName: permissionNames.creator,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: {
      es: 'Creador de SCORM',
      en: 'SCORM creator',
    },
  },
];

const menuItems = [
  // Main
  {
    item: {
      key: 'scorm',
      order: 404,
      iconSvg: '/public/scorm/menu-icon.svg',
      activeIconSvg: '/public/scorm/menu-icon-active.svg',
      label: {
        en: 'SCORM manager',
        es: 'Gestor de SCORM',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.creator,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // List
  {
    item: {
      key: 'scorm-library',
      order: 2,
      parentKey: 'scorm',
      url: '/private/scorm',
      label: {
        en: 'SCORM library',
        es: 'Librería de SCORM',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.creator,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  // New
  {
    item: {
      key: 'scorm-new',
      order: 3,
      parentKey: 'scorm',
      url: '/private/scorm/new',
      label: {
        en: 'Add SCORM',
        es: 'Añadir SCORM',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.creator,
        actionNames: ['create', 'admin'],
      },
    ],
  },
];

const assignableRoles = [
  {
    role: 'scorm',
    options: {
      teacherDetailUrl: '/private/scorm/detail/:id',
      studentDetailUrl: '/private/scorm/view/:id',
      evaluationDetailUrl: '/private/scorm/result/:id/:user',
      dashboardUrl: '/private/scorm/result/:id',
      creatable: true,
      createUrl: '/private/scorm/new',
      canUse: [], // Assignables le calza 'calledFrom ('plugins.tasks')' y 'plugins.assignables'
      pluralName: { en: 'SCORM contents', es: 'contenidos SCORM' },
      singularName: { en: 'SCORM content', es: 'contenido SCORM' },
      menu: {
        item: {
          iconSvg: '/public/scorm/menu-icon.svg',
          activeIconSvg: '/public/scorm/menu-icon.svg',
          label: {
            en: 'SCORM content',
            es: 'Contenido SCORM',
          },
        },
        permissions: [
          {
            permissionName: permissionNames.creator,
            actionNames: ['view', 'admin'],
          },
        ],
      },

      componentOwner: 'plugins.scorm',
      listCardComponent: 'ScormListCard',
      detailComponent: 'ScormDetail',
    },
  },
];

const supportedVersions = {
  AICC: {
    label: 'AICC',
    value: 'aicc',
  },
  SCORM12: {
    label: 'SCORM 1.2',
    value: 'scorm12',
  },
  SCORM2004: { label: 'SCORM 2004', value: 'scorm2004' },
};

module.exports = {
  pluginName: permissionsPrefix,
  permissions: {
    permissions,
    names: permissionNames,
  },
  menuItems,
  assignableRoles,
  supportedVersions,
};
