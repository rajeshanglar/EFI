import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Header from '../../components/Header';
import {
  CalendarIconYellow,
  MapWIcon,
  TimeWIcon,
  WorkshopIcon,
} from '../../components/icons';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';
import GradientButton from '../../components/GradientButton';

interface SessionData {
  id: string;
  date: string;
  time: string;
  location: string;
  workshopNumber?: string;
  title: string;
  subtitle?: string;
}

interface MySessionNotesProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  sessionData?: SessionData;
  onExportNotes?: (notes: string) => void;
}

const MySessionNotes: React.FC<MySessionNotesProps> = ({
  onBack,
  onNavigateToHome,
  sessionData,
  onExportNotes,
}) => {
  const [notes, setNotes] = useState('');

  const session = sessionData || {
    id: '1',
    date: 'Monday, March 06, 2025',
    time: '08.00 am - 12:30pm',
    location: 'Hall 1',
    workshopNumber: 'Workshop 1',
    title: 'Robotics in Endometriosis',
    subtitle: 'Simulation to Strategy',
  };

  const metadataItems = [
    {
      icon: <MapWIcon size={20} color={colors.primaryLight} />,
      label: session.location,
    },
    {
      icon: <TimeWIcon size={20} color={colors.primaryLight} />,
      label: session.time,
    },
    session.workshopNumber
      ? {
          icon: <WorkshopIcon size={20} color={colors.primaryLight} />,
          label: session.workshopNumber,
        }
      : null,
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

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
        <ImageBackground
          source={require('../../assets/images/wave-img.png')}
          style={globalStyles.imgBgContainerWave}
          imageStyle={globalStyles.imgBgWave}
        >
          <View style={globalStyles.metadataCard}>
            <View style={globalStyles.metadataRow}>
              <View style={globalStyles.iconContainer}>
                <CalendarIconYellow size={20} color={colors.primaryLight} />
              </View>
              <Text style={globalStyles.dateText}>{session.date}</Text>
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
          <Text style={globalStyles.sessionTitle}>{session.title}</Text>
          <Text style={globalStyles.sessionSubtitle}>Simulation to Strategy</Text>
        

          <TextInput
            style={styles.notesInput}
            placeholder="Write your notes here..."
            placeholderTextColor={colors.darkGray}
            multiline
            value={notes}
            onChangeText={setNotes}
          />

          <Text style={styles.helperText}>
            When you click "Export your notes," your notes will be emailed to you in an Excel file.
          </Text>

        </View>
      </ScrollView>

        <View style={globalStyles.footerBtContainer}>
        <GradientButton title="Export Your Notes"  onPress={handleExport}/>
        </View>

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
    minHeight:Dimensions.get('window').height * 0.49,
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
});

export default MySessionNotes;


