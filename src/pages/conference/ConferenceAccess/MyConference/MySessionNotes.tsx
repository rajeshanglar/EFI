import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Header from '../../../../components/Header';
import {
  CalendarIconYellow,
  MapWIcon,
  TimeWIcon,
  WorkshopIcon,
} from '../../../../components/icons';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../../../styles/globalStyles';
import GradientButton from '../../../../components/GradientButton';
import { getSessionNotesBySessionId, saveSessionNotes } from '../../../../services/commonService';
import { getSessionDetailsBySessionId } from '../../../../services/staticService';
import { ToastService } from '../../../../utils/service-handlers';

// API Response Data Structure
interface ApiSessionData {
  session_id: number;
  session_title: string;
  description: string;
  event_id: number;
  event_name: string;
  module_id: number;
  module_name: string;
  session_date: string;
  formatted_date: string;
  start_time: string;
  end_time: string;
  time_range: string;
  session_type: number;
  session_pdf_url: string | null;
  session_pdf_image?: string | null;
  hall: {
    hall_id: number;
    hall_name: string;
    capacity: number;
    virtual_meeting_link: string;
  };
  workshop: {
    id: number;
    name: string;
    description: string;
    status: number;
    is_morning_workshop: number;
    is_afternoon_workshop: number;
    workshop_image: string | null;
    workshop_pdf: string | null;
    created_by: number;
    updated_by: number | null;
    created_on: string;
    updated_on: string | null;
    workshop_pdf_url: string | null;
    workshop_image_url: string | null;
  } | null;
}

interface MySessionNotesProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  sessionId: number | string; // Session ID to fetch details from API (required)
  onExportNotes?: (notes: string) => void;
}

const MySessionNotes: React.FC<MySessionNotesProps> = ({
  onBack,
  onNavigateToHome,
  sessionId,
  onExportNotes,
}) => {
  const [notes, setNotes] = useState('');
  const [sessionData, setSessionData] = useState<ApiSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch session details and notes on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch session details and notes in parallel
        const [sessionDetailsResponse, sessionNotesResponse] = await Promise.all([
          getSessionDetailsBySessionId(sessionId),
          getSessionNotesBySessionId(Number(sessionId)),
        ]);

        console.log('Session Details API Response:', JSON.stringify(sessionDetailsResponse, null, 2));
        console.log('Session Notes API Response:', JSON.stringify(sessionNotesResponse, null, 2));
        
        // Set session data
        if (sessionDetailsResponse?.success && sessionDetailsResponse?.data) {
          setSessionData(sessionDetailsResponse.data);
        }

        // Set notes if available
        if (sessionNotesResponse?.success && sessionNotesResponse?.data?.notes && sessionNotesResponse.data.notes.length > 0) {
          const sessionNote = sessionNotesResponse.data.notes[0];
          setNotes(sessionNote.notes || '');
        } else {
          setNotes('');
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load session data');
        ToastService.error('Error', err?.response?.data?.message || err?.message || 'Failed to load session data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  const metadataItems = sessionData ? [
    {
      icon: <MapWIcon size={20} color={colors.primaryLight} />,
      label: sessionData.hall?.hall_name || '',
    },
    {
      icon: <TimeWIcon size={20} color={colors.primaryLight} />,
      label: sessionData.time_range || '',
    },
    sessionData.workshop?.name
      ? {
          icon: <WorkshopIcon size={20} color={colors.primaryLight} />,
          label: 'Workshop',
        }
      : null,
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[] : [];

  const handleSaveNotes = async () => {
    if (!sessionId) {
      ToastService.error('Error', 'Session ID is required');
      return;
    }

    try {
      setSaving(true);
      const sessionIdNum = Number(sessionId);
      console.log('Saving session notes:', { sessionId: sessionIdNum, notes });
      const response = await saveSessionNotes(sessionIdNum, notes.trim());
      console.log('Save Session Notes API Response:', JSON.stringify(response, null, 2));
      
      if (response?.success) {
        ToastService.success('Success', response?.message || 'Session notes saved successfully');
      } else {
        ToastService.error('Error', response?.message || 'Failed to save session notes');
      }
    } catch (err: any) {
      console.error('Error saving session notes:', err);
      ToastService.error(
        'Error',
        err?.response?.data?.message || err?.message || 'Failed to save session notes'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    onExportNotes?.(notes.trim());
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Session Notes"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading session data...</Text>
          </View>
        ) : error || !sessionData ? (
          <View style={styles.emptyContainer}>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        ) : (
          <>
            <ImageBackground
              source={require('../../../../assets/images/wave-img.png')}
              style={globalStyles.imgBgContainerWave}
              imageStyle={globalStyles.imgBgWave}
            >
              <View style={globalStyles.metadataCard}>
                <View style={globalStyles.metadataRow}>
                  <View style={globalStyles.iconContainer}>
                    <CalendarIconYellow size={20} color={colors.primaryLight} />
                  </View>
                  <Text style={globalStyles.dateText}>{sessionData.formatted_date}</Text>
                </View>

                <View style={globalStyles.metadataInfoRow}>
                  {metadataItems.map(item => (
                    <View style={globalStyles.metadataInfoItem} key={item.label}>
                      {item.icon}
                      <Text style={globalStyles.metadataText}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ImageBackground>

            <View style={styles.contentContainer}>
              <Text style={globalStyles.sessionTitle}>{sessionData.session_title}</Text>
              <Text style={globalStyles.sessionSubtitle}>{sessionData.module_name}</Text>
            

              <TextInput
                style={styles.notesInput}
                placeholder="Write your notes here..."
                placeholderTextColor={colors.darkGray}
                multiline
                value={notes}
                onChangeText={setNotes}
                editable={!saving}
              />
              {/* <TouchableOpacity 
                style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
                onPress={handleSaveNotes}
                disabled={saving || !sessionId || !sessionData}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Notes</Text>
                )}
              </TouchableOpacity> */}

              <Text style={styles.helperText}>
                When you click "Export your notes," your notes will be emailed to you in an Excel file.
              </Text>

            </View>
          </>
        )}
      </ScrollView>

        {!loading && sessionData && (
        <View style={globalStyles.footerBtContainer}>
        <GradientButton title="save and Export Your Notes"  
        onPress={handleSaveNotes}
        disabled={saving || !sessionId || !sessionData}
        />
        </View>
        )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
padding: spacing.md,
  },
  notesInput: {
    minHeight:Dimensions.get('window').height * 0.52,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding: spacing.md,
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.black,
    textAlignVertical: 'top',
    backgroundColor: colors.lightGray,
  },
  helperText: {
    fontSize: spacing.md,
    fontFamily: Fonts.Medium,
    color: colors.primary,
    marginVertical: spacing.md,
    textAlign: 'center',
  },
  exportButton: {
    alignSelf: 'stretch',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportButtonText: {
    fontSize: spacing.md,
    fontFamily: Fonts.Bold,
    color: colors.white,
    textTransform: 'uppercase',
  },

  saveButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.35,
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  saveButtonText:{
    fontSize: spacing.md,
    fontFamily: Fonts.SemiBold,
    color: colors.white,
    textTransform: 'uppercase',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
  },
  errorText: {
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.red,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default MySessionNotes;


