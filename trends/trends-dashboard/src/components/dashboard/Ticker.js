import React from 'react';
import styled, { keyframes } from 'styled-components';
import { COLORS } from '../../constants/terminal-theme';

const scroll = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-200%);
  }
`;

const TickerContainer = styled.div`
  height: 24px;
  background-color: ${COLORS.tickerBg};
  border-bottom: 1px solid ${COLORS.border};
  overflow: hidden;
  position: relative;
`;

const TickerContent = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  animation: ${scroll} 20s linear infinite;
  white-space: nowrap;
`;

const TickerItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;
  gap: 6px;
  cursor: pointer;
`;

const TickerSymbol = styled.span`
  font-size: 10px;
  color: ${COLORS.textSecondary};
`;

const TickerValue = styled.span`
  font-size: 10px;
  color: ${props => props.$isPositive ? COLORS.success : COLORS.error};
`;

const Ticker = ({ items }) => {
  const handleTickerClick = (symbol) => {
    const query = `${symbol} stock price`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <TickerContainer>
      <TickerContent>
        {items.concat(items).map((item, index) => (
          <TickerItem key={index} onClick={() => handleTickerClick(item.symbol)}>
            <TickerSymbol>{item.symbol}</TickerSymbol>
            <TickerValue $isPositive={item.change > 0}>
              {item.value} ({item.change > 0 ? '+' : ''}{item.change}%)
            </TickerValue>
          </TickerItem>
        ))}
      </TickerContent>
    </TickerContainer>
  );
};

export default Ticker;