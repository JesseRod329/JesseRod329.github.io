import React from 'react';
import styled from 'styled-components';
import { Search } from '../Icons';
import { COLORS, FONTS } from '../../constants/terminal-theme';

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

const SearchInput = styled.input`
  width: 100%;
  background: ${COLORS.background};
  border: 1px solid ${COLORS.border};
  border-radius: 2px;
  padding: 8px 12px;
  color: ${COLORS.text};
  font-family: ${FONTS.mono};
  font-size: 12px;
  margin-bottom: 15px;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
  }
  
  &::placeholder {
    color: ${COLORS.textSecondary};
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const CategoryTab = styled.button`
  background: ${props => props.$active ? COLORS.primary : COLORS.background};
  color: ${props => props.$active ? COLORS.background : COLORS.text};
  border: 1px solid ${COLORS.border};
  border-radius: 2px;
  padding: 6px 12px;
  font-family: ${FONTS.mono};
  font-size: 10px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.$active ? COLORS.primary : COLORS.selected};
  }
`;

const SearchModal = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  filteredTrendsCount, 
  onClose 
}) => {
  const categories = ['ALL', 'TECH', 'FINANCE', 'POLITICS', 'SCIENCE', 'BUSINESS', 'ENVIRONMENT'];

  return (
    <ModalOverlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <Search size={16} color={COLORS.primary} />
          <ModalTitle>SEARCH & FILTER</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <SearchInput
          type="text"
          placeholder="Search trends... (title, category)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        
        <CategoryTabs>
          {categories.map(category => (
            <CategoryTab
              key={category}
              $active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryTab>
          ))}
        </CategoryTabs>
        
        <div style={{ fontSize: '11px', color: COLORS.textSecondary, fontFamily: FONTS.mono }}>
          Found {filteredTrendsCount} trends matching your criteria
        </div>
      </Modal>
    </ModalOverlay>
  );
};

export default SearchModal;