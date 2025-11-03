import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, borderRadius, Fonts } from '../styles/globalStyles';
import { Dimensions } from 'react-native';
import { BottomArrowIcon } from './icons';
import { GradientButton } from './GradientButton';

const { width: screenWidth } = Dimensions.get('window');

interface DatePickerProps {
  label: string;
  value: string;
  onSelect: (date: string) => void;
  error?: string;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onSelect,
  error,
  placeholder = 'DD/MM/YYYY',
  maximumDate,
  minimumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  
  const getInitialDate = () => {
    if (value) {
      return parseDateString(value);
    }
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 18); // Default to 18 years ago
    return defaultDate;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate());

  // Update state when value prop changes
  useEffect(() => {
    if (value) {
      const date = parseDateString(value);
      setSelectedDate(date);
    }
  }, [value]);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      
      // On iOS, we keep the picker open and update the date
      // On Android, the picker closes automatically
      if (Platform.OS === 'android') {
        const formattedDate = formatDate(date);
        onSelect(formattedDate);
      }
    }
  };

  const handleConfirm = () => {
    const formattedDate = formatDate(selectedDate);
    onSelect(formattedDate);
    setShowPicker(false);
  };

  function parseDateString(dateString: string): Date {
    // Handle DD/MM/YYYY format
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    // Try standard date format
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  }

  function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.dateInput, error && styles.dateInputError]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.dateText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <BottomArrowIcon size={20} color={colors.gray} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={maximumDate || new Date()}
          minimumDate={minimumDate}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowPicker(false)}
          >
            <View
              style={styles.modalContainer}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Date of Birth</Text>
                <View style={styles.divider} />

                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={maximumDate || new Date()}
                  minimumDate={minimumDate}
                  style={styles.dateTimePicker}
                />

                <View style={styles.divider} />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => setShowPicker(false)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <GradientButton
                    title="Confirm"
                    onPress={handleConfirm}
                    style={styles.confirmButton}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
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
  dateInput: {
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
  dateInputError: {
    borderColor: colors.red,
  },
  dateText: {
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: screenWidth * 0.9,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalContent: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.md,
    width: '100%',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: spacing.md,
    width: '100%',
  },
  dateTimePicker: {
    width: '100%',
    height: 200,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGray,
  },
  cancelButtonText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.black,
  },
  confirmButton: {
    flex: 1,
  },
});

export default DatePicker;
