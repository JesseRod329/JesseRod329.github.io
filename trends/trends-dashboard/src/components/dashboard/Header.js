import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Command } from '../Icons';
import { COLORS, FONTS } from '../../constants/terminal-theme';

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid ${COLORS.border};
  background-color: ${COLORS.panel};
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SystemText = styled.span`
  font-size: 12px;
  color: ${COLORS.primary};
  font-weight: bold;
`;

const LiveIndicator = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${COLORS.success};
  animation: ${pulse} 1s infinite;
`;

const LiveText = styled.span`
  font-size: 10px;
  color: ${COLORS.success};
`;

const TimeText = styled.span`
  font-size: 14px;
  color: ${COLORS.primary};
  font-weight: bold;
`;

const DateText = styled.span`
  font-size: 10px;
  color: ${COLORS.textSecondary};
`;

const HelpButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: ${COLORS.primary};
  font-family: ${FONTS.mono};
  font-size: 10px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Header = ({ time, onHelp }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).toUpperCase();
  };

  return (
    <HeaderContainer>
      <HeaderSection>
        <SystemText>GTRENDS</SystemText>
        <LiveIndicator />
        <LiveText>LIVE</LiveText>
      </HeaderSection>
      <HeaderSection style={{ flexDirection: 'column', alignItems: 'center' }}>
        <TimeText>{formatTime(time)}</TimeText>
        <DateText>{formatDate(time)}</DateText>
      </HeaderSection>
      <HelpButton onClick={onHelp}>
        <Command size={16} color={COLORS.primary} />
        HELP
      </HelpButton>
    </HeaderContainer>
  );
};

export default Header;