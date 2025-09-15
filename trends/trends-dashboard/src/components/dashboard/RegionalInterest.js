import React from 'react';
import styled from 'styled-components';
import { Globe } from '../Icons';
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

const RegionalList = styled.div`
  padding: 8px;
`;

const RegionalItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

const RegionCode = styled.div`
  width: 30px;
  font-size: 10px;
  color: ${COLORS.text};
`;

const RegionBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: ${COLORS.background};
  margin: 0 8px;
  border: 1px solid ${COLORS.border};
  position: relative;
`;

const RegionBarFill = styled.div`
  height: 100%;
  background-color: ${COLORS.warning};
  width: ${props => props.width}%;
`;

const RegionPercent = styled.div`
  width: 35px;
  font-size: 10px;
  color: ${COLORS.textSecondary};
  text-align: right;
`;

const RegionalInterest = ({ regional }) => {
  return (
    <Panel>
      <PanelHeader>
        <Globe size={14} color={COLORS.warning} />
        <PanelTitle>REGIONAL INTEREST</PanelTitle>
        <PanelSubtitle>TOP 10</PanelSubtitle>
      </PanelHeader>
      <RegionalList>
        {regional.map((item) => (
          <RegionalItem key={item.code}>
            <RegionCode>{item.code}</RegionCode>
            <RegionBar>
              <RegionBarFill width={item.interest} />
            </RegionBar>
            <RegionPercent>{item.interest}%</RegionPercent>
          </RegionalItem>
        ))}
      </RegionalList>
    </Panel>
  );
};

export default RegionalInterest;