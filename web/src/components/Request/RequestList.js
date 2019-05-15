import React from 'react';
import styled from '@emotion/styled';
import { Table } from 'semantic-ui-react';
import { TEST_IDS } from '../../constants/ui';

const StyledList = styled.div`
  font-size: 1rem;
`;

export const RequestList = ({ requests }) => {
  const onRowClick = (id, e) => {
    // TODO: redirect on click
    console.log('click on row with id:', e);
  };

  const content = requests.map(request => {
    return (
      <Table.Row key={request.number} onClick={onRowClick}>
        <Table.Cell>{request.realm.displayName}</Table.Cell>
        <Table.Cell>{request.fileName}</Table.Cell>
        <Table.Cell>{request.state}</Table.Cell>
      </Table.Row>
    );
  });
  return (
    <StyledList>
      <Table striped selectable padded data-testid={TEST_IDS.REQUEST.FORM_LIST}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Realm Display Name</Table.HeaderCell>
            <Table.HeaderCell>Realm ID</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{content}</Table.Body>
      </Table>
    </StyledList>
  );
};
