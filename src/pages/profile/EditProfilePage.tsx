import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import globalStyles, { colors } from '../../styles/globalStyles';
import EditProfile, { EditProfileFormValues } from '../../components/EditProfile';
import { useAuth } from '../../contexts/AuthContext';
import { ToastService } from '../../utils/service-handlers';
import { editProfile } from '../../services/commonService';

interface EditProfilePageProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const { user, refreshAuthStatus, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    affiliation?: string;
    address?: string;
  }>({});

  const userId = user?.id || user?.user_id;

  // Get initial values from user data
  const initialValues: EditProfileFormValues = {
    affiliation: user?.title || user?.affiliation || '',
    address: user?.address || '',
  };

  const handleSubmit = async (values: EditProfileFormValues) => {
    // Clear previous errors
    setErrors({});

    // Basic validation
    const newErrors: { affiliation?: string; address?: string } = {};

    if (!values.affiliation.trim()) {
      newErrors.affiliation = 'Affiliation is required';
    }

    if (!values.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!userId) {
      ToastService.error('Error', 'User ID is required');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        user_id: userId,
        affiliation: values.affiliation.trim(),
        address: values.address.trim(),
      };

      console.log('EditProfilePage - Payload:', JSON.stringify(payload, null, 2));
      
      const response = await editProfile(payload);
      
      console.log('EditProfilePage - Response:', JSON.stringify(response, null, 2));

      if (response?.success) {
        // Update user data in AuthContext and AsyncStorage
        const updatedData = {
          affiliation: response?.data?.affiliation || values.affiliation.trim(),
          address: response?.data?.address || values.address.trim(),
          title: response?.data?.affiliation || values.affiliation.trim(), // Also update title field
        };
        
        // Update AuthContext immediately
        await updateUser(updatedData);
        
        // Also refresh to ensure everything is in sync
        await refreshAuthStatus();
        
        ToastService.success('Success', response?.message || 'Profile updated successfully');
        
        // Navigate back after successful update
        setTimeout(() => {
          onBack();
        }, 500);
      } else {
        ToastService.error('Error', response?.message || 'Failed to update profile');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update profile';
      ToastService.error('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Edit Profile"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: string) => {}}
      />

      <View style={styles.containerFullWidth}>
        <ImageBackground
          source={require('../../assets/images/ribbon-color-img.png')}
          style={globalStyles.bgBottomRibbon}
          imageStyle={globalStyles.bgBottomRibbonImage}
        />

        <EditProfile
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          errors={errors}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerFullWidth: {
    width: '100%',
    flex: 1,
    position: 'relative',
  },
});

export default EditProfilePage;

