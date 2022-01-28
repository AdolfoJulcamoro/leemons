import PropTypes from 'prop-types';
import { get } from 'lodash';
import React from 'react';
import { Box, Col, ContextContainer, Grid, TextInput } from '@bubbles-ui/components';
import prefixPN from '@calendar/helpers/prefixPN';
import { MeetingCameraIcon, PluginKimIcon, PluginRedactorIcon } from '@bubbles-ui/icons/outline';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';

export default function Event({ isEditing, event, form, data, allFormData, classes, disabled }) {
  const [t] = useTranslateLoader(prefixPN('event_mode_event_type'));
  const { t: tCommon } = useCommonTranslate('forms');

  const {
    Controller,
    control,
    formState: { errors },
  } = form;

  return (
    <ContextContainer>
      <Box>
        <Grid columns={100} gutter={0}>
          <Col span={10} className={classes.icon}>
            <MeetingCameraIcon />
          </Col>
          <Col span={90}>
            <Controller
              name="videoLink"
              control={control}
              render={({ field }) => (
                <TextInput
                  size="xs"
                  disabled={disabled}
                  label={t('video_link')}
                  error={get(errors, 'videoLink')}
                  required
                  {...field}
                />
              )}
            />
          </Col>
        </Grid>
      </Box>
      <Box>
        <Grid columns={100} gutter={0}>
          <Col span={10} className={classes.icon}>
            <PluginKimIcon />
          </Col>
          <Col span={90}>
            <Controller
              name="place"
              control={control}
              render={({ field }) => (
                <TextInput
                  size="xs"
                  disabled={disabled}
                  label={t('add_place')}
                  error={get(errors, 'place')}
                  required
                  {...field}
                />
              )}
            />
          </Col>
        </Grid>
      </Box>
      <Box>
        <Grid columns={100} gutter={0}>
          <Col span={10} className={classes.icon}>
            <PluginRedactorIcon />
          </Col>
          <Col span={90}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextInput
                  size="xs"
                  disabled={disabled}
                  label={t('add_description')}
                  error={get(errors, 'description')}
                  required
                  {...field}
                />
              )}
            />
          </Col>
        </Grid>
      </Box>
    </ContextContainer>
  );
}

Event.propTypes = {
  isEditing: PropTypes.bool,
  event: PropTypes.object,
  form: PropTypes.object,
  data: PropTypes.object,
  allFormData: PropTypes.object,
  tCommon: PropTypes.func,
};