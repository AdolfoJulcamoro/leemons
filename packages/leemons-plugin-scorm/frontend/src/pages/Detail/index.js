import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import {
  Box,
  PageHeader,
  LoadingOverlay,
  Stack,
  useDebouncedCallback,
  ContextContainer,
  FileUpload,
  Paragraph,
  Select,
} from '@bubbles-ui/components';
import JSZip from 'jszip';
import { useHistory, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { CloudUploadIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useStore, unflatten } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { AssetFormInput, UploadingFileModal } from '@leebrary/components';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { prefixPN } from '@scorm/helpers';
import { savePackageRequest, getPackageRequest, getSupportedVersionsRequest } from '@scorm/request';
import {
  xml2json,
  getVersionFromMetadata,
  getLaunchURL,
  getDefaultOrganization,
} from '@scorm/lib/utilities';
import { SetupContent, DocumentIcon } from '@scorm/components/icons';
import { PageContent } from './components/PageContent/PageContent';

export default function Index() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('scormSetup'));
  const [, translations] = useTranslateLoader('plugins.leebrary.assetSetup');

  // ----------------------------------------------------------------------
  // SETTINGS

  const debounce = useDebouncedCallback(1000);
  const [uploadingFileInfo, setUploadingFileInfo] = useState(null);
  const [store, render] = useStore({
    loading: true,
    isNew: false,
    package: {},
    supportedVersions: [],
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
          scorm: { deleted, deleted_at, created_at, updated_at, asset, ...props },
        } = await getPackageRequest(params.id);
        // eslint-disable-next-line react/prop-types
        store.titleValue = props.name;
        store.package = { ...props };
        form.reset({ ...asset, ...props });
      }

      const { versions: supportedVersions } = await getSupportedVersionsRequest();
      store.supportedVersions = supportedVersions;
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

  async function savePackage(published) {
    const fileId = await uploadFileAsMultipart(formValues.file, {
      onProgress: (info) => {
        setUploadingFileInfo(info);
      },
    });

    setUploadingFileInfo(null);

    const dataToSave = {
      ...formValues,
      id: store.isNew ? null : store.idLoaded,
      file: fileId,
      launchUrl: store.package.launchUrl,
      published,
    };

    const {
      package: { id },
    } = await savePackageRequest(dataToSave);

    store.package.id = id;
    store.idLoaded = id;
    store.isNew = false;

    if (fileId !== formValues.file.id) {
      form.setValue('file', {
        id: fileId,
        name: formValues.file.name,
        type: formValues.file.type,
      });
    }
  }

  async function saveAsDraft() {
    try {
      store.saving = 'duplicate';
      const updateRoute = store.isNew;
      render();
      await savePackage(false);
      addSuccessAlert(t('savedAsDraft'));
      if (updateRoute) {
        history.push(`/private/scorm/${store.package.id}`);
      }
    } catch (error) {
      addErrorAlert(error);
    } finally {
      store.saving = null;
      render();
    }
  }

  async function saveAsPublish() {
    try {
      store.saving = 'edit';
      render();
      await savePackage(true);
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

  async function loadFiles(file) {
    if (file instanceof File) {
      try {
        const zip = new JSZip();
        const files = (await zip.loadAsync(file)).folder('');

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
          const manifestObj = xml2json(manifest);
          const scormData = manifestObj?.manifest;

          if (!scormData) {
            throw new Error(null);
          }

          const organization = getDefaultOrganization(scormData);
          const launchUrl = getLaunchURL(scormData);

          store.package = { ...store.package, launchUrl };

          if (organization?.title && isEmpty(formValues.name)) {
            form.setValue('name', organization.title);
          }

          if (scormData.metadata) {
            const versionValue = getVersionFromMetadata(
              String(scormData.metadata.schemaversion),
              store.supportedVersions
            );
            if (versionValue) {
              form.setValue('version', versionValue.value);
            }
            /*
          const currentTags = isArray(formValues.tags) ? formValues.tags : [];
          form.setValue('tags', [
            ...currentTags,
            scormData.metadata.schema,
            `Version ${scormData.metadata.schemaversion}`,
          ]);
          */
          }
        }
      } catch (e) {
        form.setValue('file', null);
        addErrorAlert({
          message: t('fileFormatError'),
        });
      }
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
    program: { show: true, required: false },
    subjects: { show: true, required: false, showLevel: true, maxOne: false },
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
              >
                <Box>
                  <Controller
                    control={form.control}
                    name="version"
                    shouldUnregister
                    render={({ field }) => (
                      <Select
                        {...field}
                        label={t('schemaVersion')}
                        help={t('schemaVersionHelp')}
                        data={store.supportedVersions}
                      />
                    )}
                  />
                </Box>
              </AssetFormInput>
            </ContextContainer>
          </ContextContainer>
        </PageContent>
      </Stack>
      <UploadingFileModal opened={uploadingFileInfo !== null} info={uploadingFileInfo} />
    </Box>
  );
}
