import React from 'react';
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
import styled from '@emotion/styled';
import { TEST_IDS } from '../../constants/ui';

const StyledForm = styled.div`
  text-align: left;

  .sv_body.form-body {
    border-top: 2px solid #003366;
  }

  .btn.sv_complete_btn.BC-Gov-PrimaryButton,
  .btn.sv_start_btn.BC-Gov-PrimaryButton {
    background-color: #003366;
    font-size: 1em;
    border-radius: 4px;
  }

  .btn.sv_prev_btn.BC-Gov-SecondaryButton,
  .btn.sv_next_btn.BC-Gov-SecondaryButton {
    font-size: 1em;
    background: none;
    border-radius: 4px;
    border: 1px solid #003366;
    color: #003366;
  }

  .sv_page_title.form-title {
    font-size: 1.5em !important;
  }

  .sv_progress_bar[role='progressbar'] {
    background-color: #003366;
  }

  input[type='text']:disabled {
    cursor: not-allowed;
  }
`;

// survey-react classes:
const formCss = {
  body: 'sv_body form-body',
  pageTitle: 'sv_page_title form-title',
  navigation: {
    complete: 'btn sv_complete_btn BC-Gov-PrimaryButton',
    prev: 'btn sv_prev_btn BC-Gov-SecondaryButton',
    next: 'btn sv_next_btn BC-Gov-SecondaryButton',
    start: 'btn sv_start_btn BC-Gov-PrimaryButton',
  },
};

export const RequestForm = ({ formModal, initialInfo, isDisplayMode, onComplete }) => {
  // setup survey form:
  const requestForm = new Survey.Model(formModal);
  requestForm.data = initialInfo;
  requestForm.mode = isDisplayMode ? 'display' : 'write';

  return (
    <StyledForm data-testid={TEST_IDS.REQUEST.FORM}>
      <Survey.Survey model={requestForm} css={formCss} onComplete={onComplete} />
    </StyledForm>
  );
};
