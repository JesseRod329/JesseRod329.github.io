import React from 'react';
import styled from 'styled-components';
import { Activity } from '../Icons';
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

const AnalysisContent = styled.div`
  padding: 8px;
`;

const AnalysisTitle = styled.div`
  font-size: 12px;
  color: ${COLORS.primary};
  margin-bottom: 8px;
  font-weight: bold;
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
`;

const AnalysisItem = styled.div``;

const AnalysisLabel = styled.div`
  font-size: 9px;
  color: ${COLORS.textSecondary};
  margin-bottom: 2px;
`;

const AnalysisValue = styled.div`
  font-size: 11px;
  color: ${props => 
    props.sentiment === 'POSITIVE' ? COLORS.success :
    props.sentiment === 'NEGATIVE' ? COLORS.error :
    props.sentiment === 'NEUTRAL' ? COLORS.warning :
    COLORS.text
  };
`;

const MiniChart = styled.div`
  margin-top: 8px;
`;

const ChartLabel = styled.div`
  font-size: 9px;
  color: ${COLORS.textSecondary};
  margin-bottom: 4px;
`;

const ChartBars = styled.div`
  display: flex;
  height: 40px;
  align-items: flex-end;
  gap: 2px;
`;

const ChartBar = styled.div`
  flex: 1;
  background-color: ${COLORS.primary};
  min-height: 2px;
  height: ${props => props.height}%;
`;

const TrendDetails = ({ trend, rank }) => {
  if (!trend) return null;

  return (
    <Panel>
      <PanelHeader>
        <Activity size={14} color={COLORS.info} />
        <PanelTitle>ANALYSIS</PanelTitle>
        <PanelSubtitle>#{rank + 1}</PanelSubtitle>
      </PanelHeader>
      <AnalysisContent>
        <AnalysisTitle>{trend.title}</AnalysisTitle>
        <AnalysisGrid>
          <AnalysisItem>
            <AnalysisLabel>CATEGORY</AnalysisLabel>
            <AnalysisValue>{trend.category}</AnalysisValue>
          </AnalysisItem>
          <AnalysisItem>
            <AnalysisLabel>PEAK TIME</AnalysisLabel>
            <AnalysisValue>{trend.peakTime}</AnalysisValue>
          </AnalysisItem>
          <AnalysisItem>
            <AnalysisLabel>SENTIMENT</AnalysisLabel>
            <AnalysisValue sentiment={trend.sentiment}>
              {trend.sentiment}
            </AnalysisValue>
          </AnalysisItem>
          <AnalysisItem>
            <AnalysisLabel>VELOCITY</AnalysisLabel>
            <AnalysisValue>{trend.velocity}</AnalysisValue>
          </AnalysisItem>
        </AnalysisGrid>
        
        <MiniChart>
          <ChartLabel>24H TREND</ChartLabel>
          <ChartBars>
            {trend.sparkline.map((value, index) => (
              <ChartBar key={index} height={value} />
            ))}
          </ChartBars>
        </MiniChart>
      </AnalysisContent>
    </Panel>
  );
};

export default TrendDetails;