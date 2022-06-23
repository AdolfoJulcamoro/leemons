import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  Button,
  ContextContainer,
  Paragraph,
  Anchor,
  TableInput,
  Select,
} from '@bubbles-ui/components';
import { isEmpty } from 'lodash';
import LocalePicker from '@admin/components/LocalePicker';
import { getLanguagesRequest, setLanguagesRequest } from '@admin/request/settings';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';

const Locales = ({ onNextLabel, onNext = () => {} }) => {
  const [localesData, setLocalesData] = React.useState([]);
  const [locales, setLocales] = React.useState([]);
  const [defaultLocale, setDefaultLocale] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [t] = useTranslateLoader(prefixPN('setup'));

  const mounted = React.useRef(true);

  // ····················································
  // INITIAL DATA PROCESSING

  const loadLanguages = async () => {
    setLoading(true);
    try {
      const response = await getLanguagesRequest();

      if (response.langs && mounted.current) {
        const serverLocales = response.langs.locales.map(({ code }) => ({ code }));
        setLocales(serverLocales);
        setDefaultLocale(response.langs.defaultLocale);
      }

      if (mounted.current) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const saveLanguages = async () => {
    setLoading(true);
    try {
      await setLanguagesRequest(locales, defaultLocale);

      if (mounted.current) {
        onNext();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadLanguages();
    return () => {
      mounted.current = false;
    };
  }, []);

  // ····················································
  // HANDLERS

  const handleOnChange = (data) => {
    setLocales(data);
    if (data.length === 1) {
      setDefaultLocale(data[0].code);
    }
  };

  const handleOnNext = () => {
    saveLanguages();
  };

  // ····················································
  // RENDER

  return (
    <Box>
      <ContextContainer
        title={t('languages.title')}
        description={t('languages.description')}
        divided
      >
        <ContextContainer>
          <Box>
            <Paragraph>{t('languages.intro')}</Paragraph>
          </Box>
          <Box style={{ maxWidth: 400 }}>
            <TableInput
              showHeaders={false}
              sortable={false}
              columns={[
                {
                  Header: 'Select language',
                  accessor: 'code',
                  input: {
                    node: <LocalePicker onLoadData={setLocalesData} />,
                    rules: { required: 'Required field' },
                  },
                  editable: false,
                  valueRender: (value) => {
                    const locale = localesData.find((l) => l.value === value);
                    return locale?.label;
                  },
                },
              ]}
              labels={{
                add: 'Add',
                remove: 'Remove',
              }}
              data={locales}
              onBeforeRemove={() => locales.length > 1}
              onBeforeAdd={(e) => !locales.find((item) => item.code === e.code)}
              onChange={handleOnChange}
            />
          </Box>
          <Paragraph>
            {t('languages.collaborate')}
            <Anchor href="https://github.io" target="_blank" external>
              Github
            </Anchor>
          </Paragraph>
          {!isEmpty(locales) && (
            <Select
              label="Default language"
              description="Select the default language that will be used by the platform."
              data={localesData.filter((item) => locales.find((l) => l.code === item.value))}
              value={defaultLocale}
              onChange={setDefaultLocale}
            />
          )}
        </ContextContainer>
        <Stack justifyContent="end">
          <Button onClick={handleOnNext} loading={loading}>
            {onNextLabel}
          </Button>
        </Stack>
      </ContextContainer>
    </Box>
  );
};

Locales.defaultProps = {
  onNextLabel: 'Save and continue',
};
Locales.propTypes = {
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
};

export { Locales };
export default Locales;