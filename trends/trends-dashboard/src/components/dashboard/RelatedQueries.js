import React from 'react';
import styled from 'styled-components';
import { Search, Hash } from '../Icons';
import { COLORS } from '../../constants/terminal-theme';

const Panel = styled.div`
  background-color: ${COLORS.panel};
  border: 1px solid ${COLORS.border};
  border-radius: 2px;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-bottom: 1px solid ${COLORS.border};
  background-color: ${COLORS.panelHeader};
`;

const PanelTitle = styled.span`
  font-size: 11px;
  color: ${COLORS.text};
  font-weight: bold;
  flex: 1;
`;

const PanelSubtitle = styled.span`
  font-size: 9px;
  color: ${COLORS.textSecondary};
`;

const QueriesContent = styled.div`
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const QueryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: ${COLORS.background};
  padding: 3px 6px;
  border-radius: 2px;
  border: 1px solid ${COLORS.border};
  cursor: pointer;
`;

const QueryText = styled.span`
  font-size: 9px;
  color: ${COLORS.text};
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RelatedQueries = ({ queries }) => {
  return (
    <Panel>
      <PanelHeader>
        <Search size={14} color={COLORS.secondary} />
        <PanelTitle>RELATED QUERIES</PanelTitle>
        <PanelSubtitle>RISING</PanelSubtitle>
      </PanelHeader>
      <QueriesContent>
        {queries.map((query, index) => (
          <QueryItem 
            key={index} 
            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')}
          >
            <Hash size={10} color={COLORS.primary} />
            <QueryText>{query}</QueryText>
          </QueryItem>
        ))}
      </QueriesContent>
    </Panel>
  );
};

export default RelatedQueries;