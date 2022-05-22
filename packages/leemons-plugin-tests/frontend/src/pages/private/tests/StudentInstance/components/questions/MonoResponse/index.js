/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { isNumber } from 'lodash';
import { Box, Stack } from '@bubbles-ui/components';
import QuestionTitle from '../../QuestionTitle';
import QuestionNoteClues from '../../QuestionNoteClues';
import QuestionImage from '../../QuestionImage';
import Responses from './Responses';
import { ButtonNavigation } from '../../ButtonNavigation';
import QuestionNotResponsedWarning from '../../QuestionNotResponsedWarning';

export default function Index(props) {
  const { styles, saveQuestion, store, question, t, isLast } = props;

  const currentResponseIndex = store.questionResponses[question.id].properties?.response;

  function nextStep() {
    if (!store.viewMode) saveQuestion();
    props.nextStep();
  }

  let showNotResponsedWarning = false;
  if (store.viewMode) {
    showNotResponsedWarning = !isNumber(store.questionResponses[question.id]?.properties?.response);
  }

  return (
    <>
      {showNotResponsedWarning ? <QuestionNotResponsedWarning {...props} /> : null}

      <Box className={styles.questionCard}>
        <QuestionTitle {...props} />
        {!question.withImages && question.questionImage?.cover ? (
          <>
            <Stack fullWidth spacing={4}>
              <Box>
                <QuestionImage {...props} />
              </Box>
              <Box>
                <Responses {...props} />
              </Box>
            </Stack>
          </>
        ) : (
          <>
            <QuestionImage {...props} />
            <Responses {...props} />
          </>
        )}
      </Box>
      <QuestionNoteClues {...props} />
      <ButtonNavigation
        {...props}
        nextStep={nextStep}
        nextLabel={
          isLast
            ? t('finishButton')
            : isNumber(currentResponseIndex)
            ? t('nextButton')
            : t('skipButton')
        }
      />
    </>
  );
}

Index.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isLast: PropTypes.bool,
  isFirstStep: PropTypes.bool,
  saveQuestion: PropTypes.func,
};