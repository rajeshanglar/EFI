import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput } from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../styles/globalStyles';
import { Dimensions } from 'react-native';
import { BottomArrowIcon, SearchIcon,CloseIcon } from './icons';

const { width: screenWidth } = Dimensions.get('window');

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  error?: string;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  onSelect,
  error,
  placeholder = 'Select an option',
  searchable = false,
  searchPlaceholder = 'Search...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Ensure options is always an array to prevent undefined errors
  const safeOptions = options || [];
  const selectedOption = safeOptions.find(opt => opt.value === value);

  // Filter options based on search query
  const filteredOptions = searchable && searchQuery
    ? safeOptions.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : safeOptions;

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
    setSearchQuery(''); // Clear search when item is selected
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery(''); // Clear search when modal closes
  };

  // Check if label contains asterisk and split it
  const hasAsterisk = label.includes('*');
  const labelText = hasAsterisk ? label.replace(/\s*\*$/, '') : label;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.label}>{labelText}</Text>
        {hasAsterisk && (
          <Text style={[styles.label, { color: colors.red }]}>
            {' *'}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={[styles.dropdown, error && styles.dropdownError]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.dropdownText, !selectedOption && styles.placeholder]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <BottomArrowIcon size={20} color={colors.gray} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.modalClose}> <CloseIcon size={12} color={colors.primary} /> <Text style={styles.modalCloseText}>Close</Text></Text>
              </TouchableOpacity>
            </View>
            {searchable && (
              <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                  <SearchIcon size={20} color={colors.gray} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder={searchPlaceholder}
                    placeholderTextColor={colors.primary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={false}
                  />
                </View>
              </View>
            )}
            {filteredOptions.length > 0 ? (
              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      value === item.value && styles.optionItemActive
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      value === item.value && styles.optionTextActive
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No results found</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Medium,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    height: 48,
  },
  dropdownError: {
    borderColor: colors.red,
  },
  dropdownText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.black,
    flex: 1,
  },
  placeholder: {
    color: colors.gray,
  },
  errorText: {
    color: colors.red,
    fontSize: screenWidth * 0.03,
    fontFamily: Fonts.Regular,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.SemiBold,
    color: colors.black,
  },
  modalClose: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
    
  },
  modalCloseText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  optionItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  optionItemActive: {
    backgroundColor: colors.lightGray,
  },
  optionText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.black,
  },
  optionTextActive: {
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
  },
  searchContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E3F9',
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Regular,
    color: colors.black,
    backgroundColor: 'transparent',
  },
  noResultsContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Regular,
    color: colors.gray,
  },
});

export default Dropdown;

