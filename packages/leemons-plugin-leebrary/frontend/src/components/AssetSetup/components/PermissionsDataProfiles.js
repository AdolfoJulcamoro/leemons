import {
  Box,
  ContextContainer,
  Paragraph,
  Select,
  TableInput,
  Title,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import { SelectProfile } from '@users/components';
import _, { find, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const PermissionsDataProfiles = ({
  roles,
  value: _value,
  onChange,
  t,
  centers,
  editMode = false,
}) => {
  const [store, render] = useStore();

  let value = [];
  if (editMode) {
    value = _.filter(_value, (val) => val.center !== '*' && !val.program && !!val.profile);
  } else {
    value = _value;
  }

  function preOnChange(e) {
    onChange(_.map(e, (v) => ({ ...v, center: v.center || centers[0].id })));
  }

  React.useEffect(() => {
    if (editMode) {
      store.canAddProfiles = false;
      _.forEach(value, (val) => {
        if (val.profile) store.canAddProfiles = true;
      });
      render();
    }
  }, [editMode, JSON.stringify(value)]);

  const USER_LABELS = useMemo(
    () => ({
      add: t('permissionsData.labels.addUserButton', 'Add'),
      remove: t('permissionsData.labels.removeUserButton', 'Remove'),
      edit: t('permissionsData.labels.editUserButton', 'Edit'),
      accept: t('permissionsData.labels.acceptButton', 'Accept'),
      cancel: t('permissionsData.labels.cancelButton', 'Cancel'),
    }),
    [t]
  );

  const COLUMNS = useMemo(() => {
    const result = [];
    result.push({
      Header: t('permissionsData.labels.shareProfiles'),
      accessor: 'profile',
      input: {
        node: <SelectProfile />,
      },
      editable: false,
      valueRender: (values) => <SelectProfile readOnly value={values} />,
    });

    result.push({
      Header: t('permissionsData.labels.sharePermissions'),
      accessor: 'role',
      input: {
        node: <Select />,
        rules: { required: 'Required field' },
        data: roles?.filter((role) => ['viewer', 'editor'].includes(role.value)),
      },
      valueRender: (val) => find(roles, { value: val })?.label,
    });

    return result;
  }, [roles, store.canAddProfiles, store.canAddPrograms]);

  if (editMode && !value?.length) return null;

  return (
    <ContextContainer spacing={editMode ? 0 : 5}>
      {!editMode ? (
        <>
          <Box>
            <Title order={5}>{t('permissionsData.labels.addProfiles')}</Title>
            <Paragraph>{t('permissionsData.labels.addProfilesDescription')}</Paragraph>
          </Box>
        </>
      ) : (
        <Title order={5}>{t('permissionsData.labels.addProfilesEdit')}</Title>
      )}
      {!isEmpty(COLUMNS) && !isEmpty(USER_LABELS) && (
        <TableInput
          data={value}
          onChange={preOnChange}
          columns={COLUMNS}
          labels={USER_LABELS}
          showHeaders={false}
          forceShowInputs={!editMode}
          sortable={false}
          editable={editMode}
          unique
        />
      )}
    </ContextContainer>
  );
};

PermissionsDataProfiles.propTypes = {
  roles: PropTypes.any,
  t: PropTypes.func,
  value: PropTypes.any,
  onChange: PropTypes.func,
  profiles: PropTypes.array,
  centers: PropTypes.array,
  editMode: PropTypes.bool,
};

export default PermissionsDataProfiles;
export { PermissionsDataProfiles };
