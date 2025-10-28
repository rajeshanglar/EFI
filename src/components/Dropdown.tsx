import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { colors, spacing, borderRadius, Fonts } from '../styles/globalStyles';
import { Dimensions } from 'react-native';
import { BottomArrowIcon } from './icons';

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
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  options,
  onSelect,
  error,
  placeholder = 'Select an option'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
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
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
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
    fontSize: screenWidth * 0.04,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  modalClose: {
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
});

export default Dropdown;

