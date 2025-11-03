import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Header } from '../../components/Header';
import {
  CalendarIconYellow,
  MapWIcon,
  TimeWIcon,
  WorkshopIcon,
  CardRightArrowIcon,
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

interface LiveQAProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  sessionData?: SessionData;
  onSubmitQuestion?: (question: string) => void;
  onMyQuestionsPress?: () => void;
  onRecentQuestionsPress?: () => void;
}

const LiveQA: React.FC<LiveQAProps> = ({
  onBack,
  onNavigateToHome,
  sessionData,
  onSubmitQuestion,
  onMyQuestionsPress,
  onRecentQuestionsPress,
}) => {
  const [question, setQuestion] = useState('');

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

  const handleSubmit = () => {
    const trimmed = question.trim();
    if (!trimmed) {
      return;
    }
    onSubmitQuestion?.(trimmed);
    setQuestion('');
  };

  return (
    <View style={styles.container}>
      <Header title="Live Q&A" onBack={onBack} onNavigateToHome={onNavigateToHome} />

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
            style={styles.questionInput}
            placeholder="Enter Question"
            placeholderTextColor={colors.darkGray}
            multiline
            value={question}
            onChangeText={setQuestion}
          />

 

        <View style={styles.submitButtonContainer}>
            <View style={styles.submitButtonContent}>
        <GradientButton
          title="Submit"
          textStyle={styles.submitButtonText}
          onPress={handleSubmit}      
        />
        </View>
    </View>
          <View style={globalStyles.actionsSection}>
            <TouchableOpacity
              style={globalStyles.actionButton}
              activeOpacity={0.8}
              onPress={onMyQuestionsPress}
            >
              <View style={globalStyles.actionButtonContent}>
                <View style={styles.actionIconWrapper}>
                  <CardRightArrowIcon size={18} color={colors.black} />
                </View>
                <Text style={globalStyles.actionButtonText}>My Questions</Text>
                <CardRightArrowIcon size={18} color={colors.black} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={globalStyles.actionButton}
              activeOpacity={0.8}
              onPress={onRecentQuestionsPress}
            >
              <View style={globalStyles.actionButtonContent}>
                <View style={styles.actionIconWrapper}>
                  <CardRightArrowIcon size={18} color={colors.black} />
                </View>
                <Text style={globalStyles.actionButtonText}>Recent Questions</Text>
                <CardRightArrowIcon size={18} color={colors.black} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
  questionInput: {
    minHeight: 160,
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
  submitButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  submitButtonContent: {
    width: Dimensions.get('window').width * 0.5,
  },
  submitButtonText: {
    fontSize: Dimensions.get('window').width * 0.04,
  },
  actionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
});

export default LiveQA;
