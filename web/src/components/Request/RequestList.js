import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Table } from 'semantic-ui-react';
import { TEST_IDS } from '../../constants/ui';
import { getPrStatus } from '../../constants/form';

const StyledList = styled.div`
  font-size: 1rem;
  .hide {
    display: none;
  }
`;

export const RequestList = ({ requests, isAdmin, history }) => {
  const onClick = rowKey => {
    history.push(`/Request/${rowKey}`);
  };

  const content = requests.map(request => {
    return (
      <Table.Row
        key={request.number}
        onClick={() => {
          onClick(request.number);
          // onClick(request.prContent.id);
        }}
      >
        <Table.Cell>{request.realmName}</Table.Cell>
        <Table.Cell>{request.prContent.realmId}</Table.Cell>
        <Table.Cell>{getPrStatus(request.prState, request.prMerged)}</Table.Cell>
        <Table.Cell className={isAdmin ? null : 'hide'}>
          {request.prContent.requester.email}
        </Table.Cell>
      </Table.Row>
    );
  });
  return (
    <StyledList>
      <Table striped selectable data-testid={TEST_IDS.REQUEST.FORM_LIST}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Realm Display Name</Table.HeaderCell>
            <Table.HeaderCell>Realm ID</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell className={isAdmin ? null : 'hide'}>Requester</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{content}</Table.Body>
      </Table>
    </StyledList>
  );
};

RequestList.propTypes = {
  requests: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  history: PropTypes.object,
};
