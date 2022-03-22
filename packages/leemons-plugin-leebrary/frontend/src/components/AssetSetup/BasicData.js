import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { ContextContainer } from '@bubbles-ui/components';
import { LibraryForm } from '@bubbles-ui/leemons';
import { unflatten, TagsAutocomplete } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '../../helpers/prefixPN';
import { prepareAsset } from '../../helpers/prepareAsset';
import { newAssetRequest } from '../../request';

const BasicData = ({ file, categoryId, onSave = () => {}, onNext = () => {} }) => {
  const [, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  const handleOnTagsChange = (val) => {
    setTags(val);
  };

  const handleOnSubmit = async (data) => {
    setLoading(true);

    try {
      const { asset } = await newAssetRequest(data, categoryId);
      console.log(asset);
      onSave(prepareAsset(asset));
      onNext();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const formLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.plugins.leebrary.assetSetup.basicData;
      data.labels.title = data.header.titleNew;
      return data;
    }
    return {};
  }, [translations]);

  return (
    <LibraryForm {...formLabels} loading={loading} asset={{ file }} onSubmit={handleOnSubmit}>
      <ContextContainer subtitle="Tags" spacing={1}>
        <TagsAutocomplete
          pluginName="leebrary"
          labels={{ addButton: formLabels?.labels?.addTag }}
          placeholder={formLabels?.placeholders?.tagsInput}
          value={tags}
          onChange={handleOnTagsChange}
        />
      </ContextContainer>
    </LibraryForm>
  );
};

BasicData.propTypes = {
  categoryId: PropTypes.string.isRequired,
  file: PropTypes.instanceOf(Object),
  onSave: PropTypes.func,
  onNext: PropTypes.func,
};

export { BasicData };
export default BasicData;