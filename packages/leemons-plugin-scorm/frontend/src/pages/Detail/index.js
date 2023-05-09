import React, { useEffect } from 'react';
import { isArray, isEmpty } from 'lodash';
import {
  Box,
  PageHeader,
  LoadingOverlay,
  Stack,
  useDebouncedCallback,
  ContextContainer,
  FileUpload,
  Paragraph,
} from '@bubbles-ui/components';
import { useHistory, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { CloudUploadIcon } from '@bubbles-ui/icons/outline';
import * as JSZip from 'jszip';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useStore, unflatten } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { AssetFormInput } from '@leebrary/components';
import { prefixPN } from '@scorm/helpers';
import { savePackageRequest, getPackageRequest } from '@scorm/request';
import { xml2json } from '@scorm/lib/utilities';
import { SetupContent, DocumentIcon } from '@scorm/components/icons';
import { PageContent } from './components/PageContent/PageContent';

export default function Index() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('scormSetup'));
  const [, translations] = useTranslateLoader('plugins.leebrary.assetSetup');

  // ----------------------------------------------------------------------
  // SETTINGS

  const debounce = useDebouncedCallback(1000);
  const [store, render] = useStore({
    loading: true,
    isNew: false,
    package: {},
    preparedAsset: {},
    openShareDrawer: false,
  });

  const history = useHistory();
  const params = useParams();

  const form = useForm();
  const formValues = form.watch();

  // ························································
  // LABELS & STATICS

  const formLabels = React.useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.plugins.leebrary.assetSetup.basicData;
      return data;
    }
    return null;
  }, [translations]);

  // ----------------------------------------------------------------------------
  // INIT DATA LOADING

  async function init() {
    try {
      store.loading = true;
      store.isNew = params.id === 'new';
      render();
      if (!store.isNew) {
        const {
          // eslint-disable-next-line camelcase
          scorm: { deleted, deleted_at, created_at, updated_at, ...props },
        } = await getPackageRequest(params.id);
        // eslint-disable-next-line react/prop-types
        store.titleValue = props.name;
        store.package = { ...props };
        form.reset(props);
      }
      store.idLoaded = params.id;
      store.loading = false;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  useEffect(() => {
    if (params?.id && store.idLoaded !== params?.id) init();
  }, [params]);

  // ----------------------------------------------------------------------------
  // METHODS

  async function saveAsDraft() {
    try {
      store.saving = 'duplicate';
      render();
      await savePackageRequest({ ...formValues, published: false });
      addSuccessAlert(t('savedAsDraft'));
      // history.push('/private/scorm/?fromDraft=1');
    } catch (error) {
      addErrorAlert(error);
    }
    store.saving = null;
    render();
  }

  async function saveAsPublish() {
    try {
      store.saving = 'edit';
      render();
      const { package: packageRequest } = await savePackageRequest({
        ...formValues,
        published: true,
      });
      store.package = packageRequest;
      addSuccessAlert(t('published'));
    } catch (error) {
      addErrorAlert(error);
    } finally {
      store.saving = null;
      render();
    }
  }

  async function onlyPublish() {
    await saveAsPublish();
    history.push('/private/scorm');
  }

  async function publishAndAssign() {
    await saveAsPublish();
    history.push(`/private/scorm/assign/${store.package.assignable}`);
  }

  async function downloadEntry(entry) {
    const { signal } = new AbortController();
    let entryContent = null;
    try {
      const blobURL = await ZipReader.getURL(entry, {
        signal,
      });

      if (blobURL) {
        const response = await fetch(blobURL);
        entryContent = new window.DOMParser().parseFromString(await response.text(), 'text/xml');
      }
    } catch (error) {
      if (!signal.reason || signal.reason.code !== error.code) {
        throw error;
      }
    }
    return entryContent;
  }

  async function loadFiles(file) {
    try {
      const zip = new JSZip();
      const files = await zip.loadAsync(file);

      if (files?.files) {
        let manifestFile = null;

        files.forEach(async (relativePath, zipFile) => {
          if (relativePath === 'imsmanifest.xml') {
            manifestFile = zipFile;
          }
        });

        if (!manifestFile) {
          throw new Error(null);
        }

        const manifest = await manifestFile.async('string');

        const manifestDoc = new window.DOMParser().parseFromString(manifest, 'text/xml');
        const manifestObj = xml2json(manifestDoc);
        const scormData = manifestObj?.manifest;

        if (!scormData) {
          throw new Error(null);
        }

        if (scormData.organizations?.organization?.title) {
          form.setValue('name', scormData.organizations.organization.title);
        }

        /*
        if (scormData.metadata) {
          const currentTags = isArray(formValues.tags) ? formValues.tags : [];
          form.setValue('tags', [
            ...currentTags,
            scormData.metadata.schema,
            `Version ${scormData.metadata.schemaversion}`,
          ]);
        }
        */
      }
    } catch (e) {
      form.setValue('file', null);
      addErrorAlert({
        message: t('fileFormatError'),
      });
    }
  }

  // ----------------------------------------------------------------------------
  // EFFECTS

  useEffect(() => {
    const subscription = form.watch(() => {
      debounce(async () => {
        store.isValid = await form.trigger();
        render();
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (formValues.file) {
      loadFiles(formValues.file);
    }
  }, [formValues.file]);

  // ----------------------------------------------------------------------------
  // COMPONENT

  if (store.loading || tLoading) return <LoadingOverlay visible />;

  const advancedConfig = {
    alwaysOpen: true,
    fileToRight: true,
    colorToRight: true,
    program: { show: true, required: true },
    subjects: { show: true, required: true, showLevel: true, maxOne: false },
  };

  return (
    <Box style={{ height: '100vh' }}>
      <Stack direction="column" fullHeight>
        <PageHeader
          values={{
            title: t('title'),
          }}
          buttons={{
            duplicate: form.formState.isValid && t('saveDraft'),
            edit: false,
            dropdown: form.formState.isValid && t('publishOptions'),
          }}
          buttonsIcons={{
            edit: <SetupContent size={16} />,
          }}
          isEditMode={true}
          icon={<DocumentIcon />}
          onDuplicate={() => saveAsDraft()}
          onDropdown={[
            { label: t('onlyPublish'), onClick: () => onlyPublish() },
            // { label: t('publishAndShare'), onClick: () => publishAndShare() },
            { label: t('publishAndAssign'), onClick: () => publishAndAssign() },
          ]}
          loading={store.saving}
          fullWidth
        />

        <PageContent title={t('pageTitle')}>
          <ContextContainer divided>
            <Box>
              <Paragraph dangerouslySetInnerHTML={{ __html: t('description') }} />
            </Box>
            <ContextContainer>
              <Box>
                <Controller
                  control={form.control}
                  name="file"
                  shouldUnregister
                  rules={{ required: formLabels?.errorMessages.file?.required || 'Field required' }}
                  render={({ field: { ref, value, ...field } }) => (
                    <FileUpload
                      icon={<CloudUploadIcon height={32} width={32} />}
                      title={t('addFile')}
                      subtitle={t('dropFile')}
                      errorMessage={{
                        title: 'Error',
                        message: formLabels?.errorMessages.file?.rejected || 'File was rejected',
                      }}
                      hideUploadButton
                      single
                      initialFiles={value ? [value] : []}
                      inputWrapperProps={{ error: form.formState.errors.file }}
                      accept={[
                        'application/octet-stream',
                        'application/zip',
                        'application/x-zip',
                        'application/x-zip-compressed',
                      ]}
                      {...field}
                    />
                  )}
                />
              </Box>
              <AssetFormInput
                preview
                form={form}
                category="assignables.scorm"
                previewVariant="document"
                advancedConfig={advancedConfig}
                tagsPluginName="scorm"
              />
            </ContextContainer>
          </ContextContainer>
        </PageContent>
      </Stack>
    </Box>
  );
}
