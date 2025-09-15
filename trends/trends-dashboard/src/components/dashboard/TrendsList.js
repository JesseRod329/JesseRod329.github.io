import React from 'react';
import styled from 'styled-components';
import {
  TrendingUp,
  TrendingDown,
  ChevronUp,
  ChevronDown,
} from '../Icons';
import { COLORS } from '../../constants/terminal-theme';

const TrendsListContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const TrendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-bottom: 1px solid ${COLORS.border};
  cursor: pointer;
  background-color: ${props => props.$isSelected ? COLORS.selected : 'transparent'};
  
  &:hover {
    background-color: ${props => props.$isSelected ? COLORS.selected : 'rgba(0, 255, 0, 0.05)'};
  }
`;

const TrendRank = styled.div`
  width: 30px;
  font-size: 10px;
  color: ${COLORS.textSecondary};
`;

const TrendContent = styled.div`
  flex: 1;
  margin-right: 8px;
`;

const TrendTitle = styled.div`
  font-size: 11px;
  color: ${COLORS.text};
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrendStats = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const VolumeText = styled.span`
  font-size: 9px;
  color: ${COLORS.textSecondary};
`;

const ChangeText = styled.span`
  font-size: 9px;
  color: ${props => props.$isPositive ? COLORS.success : COLORS.error};
`;

const TrendIndicator = styled.div`
  width: 20px;
  display: flex;
  justify-content: center;
`;

const TrendsList = ({ trends, selectedTrend, onTrendClick, onTrendDoubleClick }) => {
  return (
    <TrendsListContainer>
      {trends.map((item, index) => (
        <TrendItem
          key={item.id}
          $isSelected={index === selectedTrend}
          onClick={() => onTrendClick(index)}
          onDoubleClick={() => onTrendDoubleClick(item)}
        >
          <TrendRank>#{index + 1}</TrendRank>
          <TrendContent>
            <TrendTitle>{item.title}</TrendTitle>
            <TrendStats>
              <VolumeText>VOL: {item.volume}</VolumeText>
              {item.change > 0 ? (
                <ChevronUp size={12} color={COLORS.success} />
              ) : (
                <ChevronDown size={12} color={COLORS.error} />
              )}
              <ChangeText $isPositive={item.change > 0}>
                {item.change > 0 ? '+' : ''}{item.change}%
              </ChangeText>
            </TrendStats>
          </TrendContent>
          <TrendIndicator>
            {item.change > 0 ? (
              <TrendingUp size={16} color={COLORS.success} />
            ) : (
              <TrendingDown size={16} color={COLORS.error} />
            )}
          </TrendIndicator>
        </TrendItem>
      ))}
    </TrendsListContainer>
  );
};

export default TrendsList;