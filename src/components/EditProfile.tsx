import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GradientButton } from './GradientButton';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../styles/globalStyles';
import { Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export interface EditProfileFormValues {
  affiliation: string;
  address: string;
}

export interface EditProfileProps {
  initialValues?: EditProfileFormValues;
  onSubmit: (values: EditProfileFormValues) => void | Promise<void>;
  isLoading?: boolean;
  errors?: {
    affiliation?: string;
    address?: string;
  };
  showLabels?: boolean;
  containerStyle?: any;
}

const EditProfile: React.FC<EditProfileProps> = ({
  initialValues = { affiliation: '', address: '' },
  onSubmit,
  isLoading = false,
  errors = {},
  showLabels = true,
  containerStyle,
}) => {
  const [affiliation, setAffiliation] = useState(initialValues.affiliation || '');
  const [address, setAddress] = useState(initialValues.address || '');
  const [touched, setTouched] = useState({
    affiliation: false,
    address: false,
  });

  const handleSubmit = () => {
    setTouched({
      affiliation: true,
      address: true,
    });

    const values: EditProfileFormValues = {
      affiliation: affiliation.trim(),
      address: address.trim(),
    };

    onSubmit(values);
  };

  const handleAffiliationBlur = () => {
    setTouched(prev => ({ ...prev, affiliation: true }));
  };

  const handleAddressBlur = () => {
    setTouched(prev => ({ ...prev, address: true }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <ScrollView
        style={[styles.scrollView, containerStyle]}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Affiliation Field */}
        <View style={globalStyles.fieldContainer}>
          {showLabels && (
            <Text style={globalStyles.fieldLabel}>Affiliation</Text>
          )}
          <TextInput
            style={[
              globalStyles.fieldInput,
              styles.textArea,
              touched.affiliation && errors.affiliation
                ? globalStyles.fieldInputError
                : null,
            ]}
            placeholder="Enter your affiliation"
            placeholderTextColor={colors.gray}
            value={affiliation}
            onChangeText={setAffiliation}
            onBlur={handleAffiliationBlur}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {touched.affiliation && errors.affiliation && (
            <Text style={globalStyles.fieldErrorText}>
              {errors.affiliation}
            </Text>
          )}
        </View>

        {/* Address Field */}
        <View style={globalStyles.fieldContainer}>
          {showLabels && (
            <Text style={globalStyles.fieldLabel}>Address</Text>
          )}
          <TextInput
            style={[
              globalStyles.fieldInput,
              styles.textArea,
              touched.address && errors.address
                ? globalStyles.fieldInputError
                : null,
            ]}
            placeholder="Enter your address"
            placeholderTextColor={colors.gray}
            value={address}
            onChangeText={setAddress}
            onBlur={handleAddressBlur}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          {touched.address && errors.address && (
            <Text style={globalStyles.fieldErrorText}>
              {errors.address}
            </Text>
          )}
        </View>

        {/* Submit Button */}
        <View style={styles.submitButtonContainer}>
          <GradientButton
            title={isLoading ? 'SUBMITTING...' : 'SUBMIT'}
            onPress={handleSubmit}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  submitButtonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});

export default EditProfile;

