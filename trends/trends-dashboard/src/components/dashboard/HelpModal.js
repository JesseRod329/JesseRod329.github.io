import React from 'react';
import styled from 'styled-components';
import { Command } from '../Icons';
import { COLORS, FONTS } from '../../constants/terminal-theme';
import trendsService from '../../services/trendsService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${COLORS.panel};
  border: 1px solid ${COLORS.border};
  border-radius: 2px;
  padding: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${COLORS.border};
`;

const ModalTitle = styled.h2`
  font-size: 14px;
  color: ${COLORS.primary};
  font-family: ${FONTS.mono};
  margin: 0;
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${COLORS.textSecondary};
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: ${COLORS.text};
  }
`;

const ShortcutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
  margin-bottom: 15px;
`;

const ShortcutKey = styled.div`
  background: ${COLORS.background};
  border: 1px solid ${COLORS.border};
  border-radius: 2px;
  padding: 6px 10px;
  font-family: ${FONTS.mono};
  font-size: 10px;
  color: ${COLORS.warning};
  text-align: center;
`;

const ShortcutDesc = styled.div`
  font-family: ${FONTS.mono};
  font-size: 10px;
  color: ${COLORS.textSecondary};
  display: flex;
  align-items: center;
`;

const HelpModal = ({ onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <Command size={16} color={COLORS.primary} />
          <ModalTitle>KEYBOARD SHORTCUTS & HELP</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <ShortcutGrid>
          <ShortcutKey>↑ / ↓</ShortcutKey>
          <ShortcutDesc>Navigate trends list</ShortcutDesc>
          
          <ShortcutKey>1-9</ShortcutKey>
          <ShortcutDesc>Quick select trend by number</ShortcutDesc>
          
          <ShortcutKey>ENTER</ShortcutKey>
          <ShortcutDesc>Open trend details</ShortcutDesc>
          
          <ShortcutKey>/</ShortcutKey>
          <ShortcutDesc>Open search & filter</ShortcutDesc>
          
          <ShortcutKey>H</ShortcutKey>
          <ShortcutDesc>Show this help dialog</ShortcutDesc>
          
          <ShortcutKey>CTRL+R</ShortcutKey>
          <ShortcutDesc>Refresh data</ShortcutDesc>
          
          <ShortcutKey>ESC</ShortcutKey>
          <ShortcutDesc>Close dialogs / Clear search</ShortcutDesc>
        </ShortcutGrid>
        
        <div style={{ marginTop: '20px', padding: '10px', background: COLORS.background, border: `1px solid ${COLORS.border}`, borderRadius: '2px' }}>
          <div style={{ fontSize: '11px', color: COLORS.primary, fontFamily: FONTS.mono, marginBottom: '8px' }}>
            INTERACTIVE FEATURES:
          </div>
          <div style={{ fontSize: '10px', color: COLORS.textSecondary, fontFamily: FONTS.mono, lineHeight: '1.4' }}>
            • Click trends to select them<br/>
            • Double-click trends for detailed view<br/>
            • Click ticker symbols to search prices<br/>
            • Click related queries to search Google<br/>
            • Use category filters to narrow results
          </div>
        </div>
        
        <div style={{ marginTop: '15px', fontSize: '10px', color: COLORS.textSecondary, fontFamily: FONTS.mono }}>
          Data Source: {trendsService.getStatus().mode.toUpperCase()} | 
          {trendsService.getStatus().source || 'Backend API'}
        </div>
      </Modal>
    </ModalOverlay>
  );
};

export default HelpModal;