import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Box,
  Button,
  ContextContainer,
  createStyles,
  HtmlText,
  Stack,
  Text,
  TextInput,
} from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
import { TextEditorInput } from '@bubbles-ui/editors';
import { htmlToText, useStore } from '@common';
import { DeleteBinIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import _ from 'lodash';
import { TagRelation } from '@curriculum/components/FormTheme/TagRelation';

const useStyle = createStyles((theme) => ({
  card: {
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: '8px',
    overflow: 'hidden',
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    right: theme.spacing[2],
    top: theme.spacing[2],
  },
}));

function CurriculumListItem({
  isEditMode = true,
  label,
  defaultValues,
  schema,
  blockData,
  onSave,
  onCancel,
  onRemove,
  onEdit,
  preview,
  curriculum,
  id,
  t,
}) {
  const { classes } = useStyle();
  const [store, render] = useStore();
  const form = useForm({ defaultValues });

  function _onSave() {
    form.handleSubmit((formValues) => {
      onSave(formValues);
    })();
  }

  React.useEffect(() => {
    if (_.isArray(blockData.contentRelations)) {
      /*
      const parent = _.find(blockData.contentRelations, {
        typeOfRelation: 'parent',
      });
      if (parent) {
        const ids = parent.relatedTo.split('|');
        const nodeLevelId = ids[0];
        const formValueId = ids[1];
        const node = _.find(parentNodes, { nodeLevel: nodeLevelId });
        const nodeValue = node.formValues[formValueId];
        if (nodeValue) {
          const nodeLevel = _.find(curriculum.nodeLevels, { id: nodeLevelId });
          store.parentNodeValue = nodeValue;
          store.selectParentName = `${nodeLevel.name} - ${node.name}`;
          if (_.isArray(nodeValue)) {
            store.type = 'select';
            store.selectData = _.map(nodeValue, (v) => ({ label: v.value, value: v.id }));
          } else {
            store.type = 'input';
            onChangeParent(nodeValue.id);
          }
          render();
        }
      }

       */
    }
  }, []);

  const valueRules = {
    required: t('fieldRequired'),
  };

  if (blockData.max)
    valueRules.validate = (e) => {
      const text = htmlToText(e);
      if (text.length > blockData.max) {
        return t('maxLength', { max: blockData.max });
      }
    };

  if (preview) {
    const tags = (
      <Controller
        control={form.control}
        name="metadata.tagRelated"
        render={({ field }) => (
          <TagRelation
            {...field}
            curriculum={curriculum}
            blockData={blockData}
            isShow={(e) => {
              store.showSaveButton = e;
              render();
            }}
            readonly
            id={id}
            t={t}
          />
        )}
      />
    );
    return (
      <Box className={classes.card}>
        <Box sx={(theme) => ({ marginBottom: theme.spacing[3] })}>
          {label ? (
            <Text color="primary" role="productive" size="md" strong>
              {label}
            </Text>
          ) : null}
          {isEditMode ? (
            <Box className={classes.editButton}>
              <ActionButton tooltip={t('edit')} icon={<EditWriteIcon />} onClick={onEdit} />
              <ActionButton tooltip={t('remove')} icon={<DeleteBinIcon />} onClick={onRemove} />
            </Box>
          ) : null}
        </Box>
        {!isEditMode ? (
          <Box sx={(theme) => ({ marginBottom: theme.spacing[3] })}>{tags}</Box>
        ) : null}
        <Box sx={() => ({ maxHeight: 200, overflow: 'auto' })}>
          {blockData.listType === 'field' ? (
            <Text color="primary" role="productive">
              {defaultValues.value}
            </Text>
          ) : null}
          {blockData.listType === 'textarea' ? <HtmlText>{defaultValues.value}</HtmlText> : null}
        </Box>
        {isEditMode ? <Box sx={(theme) => ({ marginTop: theme.spacing[3] })}>{tags}</Box> : null}
      </Box>
    );
  }

  return (
    <ContextContainer className={classes.card}>
      <Controller
        control={form.control}
        name="value"
        rules={valueRules}
        render={({ field }) => {
          if (blockData.listType === 'field') {
            return <TextInput {...field} error={form.formState.errors.value} label={label} />;
          }
          if (blockData.listType === 'textarea') {
            return <TextEditorInput {...field} error={form.formState.errors.value} label={label} />;
          }
        }}
      />
      <Controller
        control={form.control}
        name="metadata.tagRelated"
        render={({ field }) => (
          <TagRelation
            {...field}
            curriculum={curriculum}
            blockData={blockData}
            isShow={(e) => {
              store.showSaveButton = e;
              render();
            }}
            id={id}
            t={t}
          />
        )}
      />
      <Stack justifyContent="space-between" fullWidth>
        <Button variant="link" onClick={onCancel} loading={store.loading}>
          {t('cancel')}
        </Button>
        <Button variant="outline" onClick={_onSave} loading={store.loading}>
          {defaultValues?.value ? t('update') : t('add')}
        </Button>
      </Stack>
    </ContextContainer>
  );
}

CurriculumListItem.defaultProps = {
  defaultValues: {},
};

CurriculumListItem.propTypes = {
  t: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  isEditMode: PropTypes.bool,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func,
  schema: PropTypes.any,
  preview: PropTypes.bool,
  blockData: PropTypes.any,
  defaultValues: PropTypes.any,
  curriculum: PropTypes.any,
  id: PropTypes.any,
};

export default CurriculumListItem;