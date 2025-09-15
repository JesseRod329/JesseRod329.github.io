import React from 'react';
import styled from 'styled-components';
import {
  Zap,
  BarChart3,
  AlertCircle,
  Command,
} from '../Icons';
import { COLORS } from '../../constants/terminal-theme';

const StatusBarContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 6px 0;
  border-top: 1px solid ${COLORS.border};
  background-color: ${COLORS.panel};
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  &:hover {
    opacity: ${props => props.$clickable ? '0.8' : '1'};
  }
`;

const StatusText = styled.span`
  font-size: 9px;
  color: ${COLORS.textSecondary};
`;

const StatusBar = ({ trendsCount, onShortcuts }) => {
  return (
    <StatusBarContainer>
      <StatusItem>
        <Zap size={12} color={COLORS.success} />
        <StatusText>CONNECTED</StatusText>
      </StatusItem>
      <StatusItem>
        <BarChart3 size={12} color={COLORS.primary} />
        <StatusText>{trendsCount} TRENDS</StatusText>
      </StatusItem>
      <StatusItem>
        <AlertCircle size={12} color={COLORS.warning} />
        <StatusText>3 ALERTS</StatusText>
      </StatusItem>
      <StatusItem $clickable onClick={onShortcuts}>
        <Command size={12} color={COLORS.info} />
        <StatusText>SHORTCUTS</StatusText>
      </StatusItem>
    </StatusBarContainer>
  );
};

export default StatusBar;