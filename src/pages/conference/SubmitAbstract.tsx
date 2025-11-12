import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Formik, FieldArray, FormikErrors, FormikTouched } from 'formik';
import { pick, types } from '@react-native-documents/picker';

import type { KeyboardTypeOptions } from 'react-native';

import { Header } from '../../components/Header';
import { GradientButton } from '../../components/GradientButton';
import { RefreshIcon, WhiteMyCardsIcon } from '../../components/icons';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';
import {
  generateCaptcha,
  submitAbstractInitialValues,
  submitAbstractSchema,
  submitAbstractInitialAuthors,
} from '../../schemas/submitAbstractSchema';
import { SubmitAbstractAuthor, SubmitAbstractFormValues } from '../../types/submitAbstract';

interface SubmitAbstractProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onSubmitSuccess?: (values: SubmitAbstractFormValues) => void;
}
const { width: screenWidth } = Dimensions.get('window');
const SubmitAbstract: React.FC<SubmitAbstractProps> = ({
  onBack,
  onNavigateToHome,
  onSubmitSuccess,
}) => {
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [documentError, setDocumentError] = useState<string | null>(null);

  const initialValues = useMemo<SubmitAbstractFormValues>(() => {
    const clonedAuthors = submitAbstractInitialAuthors.map(author => ({ ...author }));
    return {
      ...submitAbstractInitialValues,
      authors: clonedAuthors,
    };
  }, []);

  const refreshCaptcha = useCallback(() => {
    setCaptchaCode(generateCaptcha());
  }, []);

  const handleFormSubmit = useCallback(
    (values: SubmitAbstractFormValues) => {
      onSubmitSuccess?.(values);
    },
    [onSubmitSuccess],
  );

  const renderTextField = (
    label: string,
    fieldKey: string,
    value: string,
    onChangeText: (text: string) => void,
    onBlur: () => void,
    error?: string,
    touched?: boolean,
    options?: {
      multiline?: boolean;
      numberOfLines?: number;
      placeholder?: string;
      keyboardType?: KeyboardTypeOptions;
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    },
  ) => (
    <View style={globalStyles.fieldContainer} key={fieldKey}>
      <Text style={globalStyles.fieldLabel}>
        {label}
        <Text style={styles.requiredAsterisk}> *</Text>
      </Text>
      <TextInput
        style={[
          globalStyles.fieldInput,
          options?.multiline && styles.multilineInput,
          touched && error ? globalStyles.fieldInputError : null,
        ]}
        placeholder={options?.placeholder}
        placeholderTextColor={colors.gray}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        multiline={options?.multiline}
        numberOfLines={options?.numberOfLines}
        keyboardType={options?.keyboardType}
        autoCapitalize={options?.autoCapitalize ?? 'sentences'}
      />
      {touched && error ? (
        <Text style={globalStyles.fieldErrorText}>{error}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Submit Abstract" onBack={onBack} onNavigateToHome={onNavigateToHome} />


      <Formik
        initialValues={initialValues}
        validationSchema={submitAbstractSchema(captchaCode)}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
          isValid,
        }) => {
          const handleSelectDocument = async () => {
            try {
              const [result] = await pick({
                type: [types.pdf, types.doc, types.docx],
              });

              if (!result) {
                return;
              }

              const fileName =
                result.name ??
                result.uri?.split('/').pop() ??
                'selected-file';

              await setFieldValue('abstractFileName', fileName);
              setFieldTouched('abstractFileName', true, false);
              setDocumentError(null);
            } catch (error) {
              const pickerError = error as { code?: string; message?: string };
              if (
                pickerError?.code === 'DOCUMENT_PICKER_CANCELED' ||
                pickerError?.code === 'PICKER_CANCELLED' ||
                pickerError?.message?.toLowerCase().includes('cancel')
              ) {
                return;
              }
              setDocumentError('Unable to select the document. Please try again.');
            }
          };

          const toggleDeclaration = () =>
            setFieldValue('acceptDeclaration', !values.acceptDeclaration);

          return (
            <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80} // adjust if you have header
          >
             <ScrollView contentContainerStyle={{ flexGrow: 1 }}
               keyboardShouldPersistTaps="handled"
              >
                <View style={styles.bottomContainer}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Basic Details</Text>
                  {renderTextField(
                    'Title',
                    'title',
                    values.title,
                    handleChange('title'),
                    () => handleBlur('title'),
                    errors.title,
                    touched.title,
                    { placeholder: 'Enter title', autoCapitalize: 'words' },
                  )}
                  {renderTextField(
                    'Full Name',
                    'fullName',
                    values.fullName,
                    handleChange('fullName'),
                    () => handleBlur('fullName'),
                    errors.fullName,
                    touched.fullName,
                    { placeholder: 'Enter your full name', autoCapitalize: 'words' },
                  )}
                  {renderTextField(
                    'Email Id',
                    'email',
                    values.email,
                    handleChange('email'),
                    () => handleBlur('email'),
                    errors.email,
                    touched.email,
                    { placeholder: 'Enter your email', keyboardType: 'email-address', autoCapitalize: 'none' },
                  )}
                  {renderTextField(
                    'Mobile Number',
                    'mobileNumber',
                    values.mobileNumber,
                    handleChange('mobileNumber'),
                    () => handleBlur('mobileNumber'),
                    errors.mobileNumber,
                    touched.mobileNumber,
                    { placeholder: 'Enter your mobile number', keyboardType: 'phone-pad', autoCapitalize: 'none' },
                  )}
                  {renderTextField(
                    'Registration Number',
                    'registrationNumber',
                    values.registrationNumber,
                    handleChange('registrationNumber'),
                    () => handleBlur('registrationNumber'),
                    errors.registrationNumber,
                    touched.registrationNumber,
                    { placeholder: 'Enter your registration number', autoCapitalize: 'characters' },
                  )}
                  {renderTextField(
                    'Institute / Hospital / Organization',
                    'institute',
                    values.institute,
                    handleChange('institute'),
                    () => handleBlur('institute'),
                    errors.institute,
                    touched.institute,
                    { placeholder: 'Enter institute / hospital / organization', autoCapitalize: 'words' },
                  )}
                </View>

                <View style={styles.secondSection}>
                  <Text style={styles.sectionTitle}>Author Details</Text>
                  <FieldArray name="authors">
                    {({ push, remove }) => {
                      const authorErrors =
                        errors.authors as FormikErrors<SubmitAbstractAuthor>[] | undefined;
                      const authorTouched =
                        touched.authors as FormikTouched<SubmitAbstractAuthor>[] | undefined;

                      return (
                      <>
                        {values.authors.map((author, index) => {
                          const namePath = `authors[${index}].name` as const;
                          const affiliationPath = `authors[${index}].affiliation` as const;
                          const currentAuthorError = authorErrors?.[index];
                          const currentAuthorTouched = authorTouched?.[index];

                          return (
                            <View key={`author-${index}`} style={styles.authorCard}>
                              <View style={styles.authorHeader}>
                                <Text style={styles.authorTitle}>{`Author ${index + 1}`}</Text>
                                {index > 0 ? (
                                  <TouchableOpacity
                                    onPress={() => remove(index)}
                                    style={styles.removeAuthorButton}
                                  >
                                    <Text style={styles.removeAuthorText}>Remove</Text>
                                  </TouchableOpacity>
                                ) : null}
                              </View>
                              {renderTextField(
                                'Author Name',
                                namePath,
                                author.name,
                                handleChange(namePath),
                                () => handleBlur(namePath),
                                currentAuthorError?.name,
                                currentAuthorTouched?.name,
                                { placeholder: 'Enter author name', autoCapitalize: 'words' },
                              )}
                              {renderTextField(
                                'Affiliation / Institute',
                                affiliationPath,
                                author.affiliation,
                                handleChange(affiliationPath),
                                () => handleBlur(affiliationPath),
                                currentAuthorError?.affiliation,
                                currentAuthorTouched?.affiliation,
                                { placeholder: 'Enter affiliation / institute', autoCapitalize: 'words' },
                              )}
                            </View>
                          );
                        })}
                        <TouchableOpacity
                          onPress={() => push({ name: '', affiliation: '' })}
                          style={styles.addAuthorButton}
                        >
                          <Text style={styles.addAuthorText}>+ Add</Text>
                        </TouchableOpacity>
                        {typeof errors.authors === 'string' && (
                          <Text style={globalStyles.fieldErrorText}>{errors.authors}</Text>
                        )}
                      </>);
                    }}
                  </FieldArray>
                </View>

                <View style={styles.secondSection}>
                  <Text style={styles.sectionTitle}>Abstract Details</Text>
                  {renderTextField(
                    'Abstract Type',
                    'abstractType',
                    values.abstractType,
                    handleChange('abstractType'),
                    () => handleBlur('abstractType'),
                    errors.abstractType,
                    touched.abstractType,
                    { placeholder: 'Enter abstract type', autoCapitalize: 'words' },
                  )}
                  {renderTextField(
                    'Abstract Topics',
                    'abstractTopics',
                    values.abstractTopics,
                    handleChange('abstractTopics'),
                    () => handleBlur('abstractTopics'),
                    errors.abstractTopics,
                    touched.abstractTopics,
                    { placeholder: 'Enter abstract topics', autoCapitalize: 'sentences' },
                  )}
                  {renderTextField(
                    'Title',
                    'abstractTitle',
                    values.abstractTitle,
                    handleChange('abstractTitle'),
                    () => handleBlur('abstractTitle'),
                    errors.abstractTitle,
                    touched.abstractTitle,
                    { placeholder: 'Enter abstract title', autoCapitalize: 'sentences' },
                  )}
                  {renderTextField(
                    'Description',
                    'abstractDescription',
                    values.abstractDescription,
                    handleChange('abstractDescription'),
                    () => handleBlur('abstractDescription'),
                    errors.abstractDescription,
                    touched.abstractDescription,
                    {
                      placeholder: 'Enter abstract description',
                      multiline: true,
                      numberOfLines: 4,
                      autoCapitalize: 'sentences',
                    },
                  )}

                  <View style={globalStyles.fieldContainer}>
                    <Text style={globalStyles.fieldLabel}>
                      Upload Abstract (only .doc, .docx, or .pdf files)
                      <Text style={styles.requiredAsterisk}> *</Text>
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.filePickerButton,
                        errors.abstractFileName && touched.abstractFileName
                          ? styles.filePickerButtonError
                          : null,
                      ]}
                      onPress={handleSelectDocument}
                    >
                      <Text style={styles.filePickerButtonText}>Choose File</Text>
                    </TouchableOpacity>
                    {values.abstractFileName ? (
                      <Text style={styles.fileNameText}>{values.abstractFileName}</Text>
                    ) : null}
                    {documentError ? (
                      <Text style={globalStyles.fieldErrorText}>{documentError}</Text>
                    ) : null}
                    {touched.abstractFileName && errors.abstractFileName ? (
                      <Text style={globalStyles.fieldErrorText}>{errors.abstractFileName}</Text>
                    ) : null}
                  </View>
                </View>

                <View style={styles.section}>
                  <TouchableOpacity style={styles.checkboxRow} onPress={toggleDeclaration}>
                    <View
                      style={[
                        styles.checkbox,
                        values.acceptDeclaration && styles.checkboxChecked,
                      ]}
                    >
                      {values.acceptDeclaration ? <Text style={styles.checkboxMark}>✓</Text> : null}
                    </View>
                    <Text style={styles.checkboxText}>
                      By submitting this form, I confirm that the first author will be registered for
                      the Congress by 31st December 2025 for the abstract to be accepted.
                    </Text>
                  </TouchableOpacity>
                  {touched.acceptDeclaration && errors.acceptDeclaration ? (
                    <Text style={globalStyles.fieldErrorText}>{errors.acceptDeclaration}</Text>
                  ) : null}
                </View>

                <View style={styles.secondSection}>
                
                  <View style={globalStyles.fieldContainer}>
                    <View style={globalStyles.formCaptchaContainer}>
                      <View style={styles.captchaCodeWrapper}>
                        <Text style={globalStyles.formCaptchaCode}>{captchaCode}</Text>
                      </View>
                      <TextInput
                        style={globalStyles.formCaptchaInput}
                        placeholder="Enter CAPTCHA"
                        placeholderTextColor={colors.gray}
                        value={values.captcha}
                        onChangeText={handleChange('captcha')}
                        onBlur={() => handleBlur('captcha')}
                        autoCapitalize="characters"
                        maxLength={6}
                      />
                      <TouchableOpacity
                        style={globalStyles.formRefreshButton}
                        onPress={refreshCaptcha}
                      >
                        <RefreshIcon size={20} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                    {touched.captcha && errors.captcha ? (
                      <Text style={globalStyles.fieldErrorText}>{errors.captcha}</Text>
                    ) : null}
                  </View>
                </View>
                </View>
          
              </ScrollView>

              <View style={styles.footerBtContainer}>
        <GradientButton
          title="SUBMIT"
          onPress={() => handleSubmit()}
          disabled={!isValid}         
        />
      </View>
             
            </KeyboardAvoidingView>

            
          );
          
        }}
      </Formik>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bottomContainer: {
    flex: 1,
    paddingBottom:30,
  },
  flex: {
    flex: 1,
  },

  footerBtContainer: {
    position: 'absolute',
    bottom: Dimensions.get('window').height * -0.1,
    left: 0,
    right: 0,
    backgroundColor: colors.lightGray,
    paddingTop: Dimensions.get('window').height * 0.012,
    paddingBottom: Dimensions.get('window').height * 0.012,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 12,
  },

  secondSection:{
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  section: { paddingHorizontal: spacing.md },
  sectionTitle: {
    fontSize: spacing.lg,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  requiredAsterisk: {
    color: colors.red,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 120,
  },
  authorCard: {
    backgroundColor: '#F0F5FF',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  authorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  authorTitle: {
    fontSize: spacing.md,
    fontFamily: Fonts.Medium,
    color: colors.primary,
  },
  removeAuthorButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 100,
    backgroundColor: '#FFECEC',
    borderWidth: 1,
    borderColor: colors.red,
  },
  removeAuthorText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.red,
  },
  addAuthorButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  addAuthorText: {
    fontSize: spacing.md,
    fontFamily: Fonts.Medium,
    color: colors.accent,
  },
  filePickerButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignSelf: 'flex-start',
  },
  filePickerButtonError: {
    backgroundColor: colors.red,
  },
  filePickerButtonText: {
    fontSize: spacing.md,
    fontFamily: Fonts.Medium,
    color: colors.white,
  },
  fileNameText: {
    marginTop: spacing.xs,
    fontSize: spacing.sm,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginTop: 4,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxMark: {
    color: colors.white,
    fontSize: 14,
    fontFamily: Fonts.Bold,
  },
  checkboxText: {
    flex: 1,
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.black,
  },
  captchaCodeWrapper: {
    backgroundColor: '#FFF2CC',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
 
  },
});

export default SubmitAbstract;

