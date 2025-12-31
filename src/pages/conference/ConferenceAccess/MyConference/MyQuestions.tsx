import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Header from '../../../../components/Header';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../../../styles/globalStyles';
import { getSessionQuestions } from '../../../../services/conferenceService';
import { ToastService } from '../../../../utils/service-handlers';

const { width: screenWidth } = Dimensions.get('window');

interface Question {
  question_id: string | number;
  session_id: number;
  question: string;
  status: string;
  created_at: string;
  session_title?: string;
  is_anonymous?: number;
}

interface MyQuestionsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const MyQuestions: React.FC<MyQuestionsProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions on mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching session questions...');
      const response = await getSessionQuestions();
      console.log('Session Questions API Response:', JSON.stringify(response, null, 2));
      
      if (response?.success && response?.data) {
        const questionsList = response.data.questions || [];
        console.log('Questions Data:', JSON.stringify(questionsList, null, 2));
        setQuestions(questionsList);
      } else {
        console.error('API response indicates failure:', response);
        setError(response?.message || 'Failed to load questions');
      }
    } catch (err: any) {
      console.error('Error fetching questions:', err);
      console.error('Error details:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
      });
      setError(err?.response?.data?.message || err?.message || 'Failed to load questions');
      ToastService.error('Error', err?.response?.data?.message || err?.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string): string => {
    const s = status.toLowerCase();
    if (s === 'approved' || s === 'answered') return '#00b000';
    if (s === 'pending' || s === 'review') return '#ffa500';
    if (s === 'rejected' || s === 'declined') return colors.red;
    return colors.darkGray;
  };

  const getStatusText = (status: string): string => {
    const s = status.toLowerCase();
    if (s === 'approved') return 'Approved';
    if (s === 'pending') return 'Pending';
    if (s === 'answered') return 'Answered';
    if (s === 'rejected') return 'Rejected';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Questions"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading questions...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : questions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No questions found</Text>
            <Text style={styles.emptySubtext}>You haven't asked any questions yet.</Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {questions.map((question, index) => (
              <View key={question.question_id || index} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionTitle}>Question #{question.question_id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(question.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(question.status) }]}>
                      {getStatusText(question.status)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.questionText}>{question.question}</Text>

                <View style={styles.questionFooter}>
                  <View style={styles.questionInfo}>
                    <Text style={styles.infoLabel}>Date:</Text>
                    <Text style={styles.infoValue}>{formatDate(question.created_at)}</Text>
                  </View>
                  {question.session_title && (
                    <View style={styles.questionInfo}>
                      <Text style={styles.infoLabel}>Session:</Text>
                      <Text style={styles.infoValue} numberOfLines={1}>
                        {question.session_title}
                      </Text>
                    </View>
                  )}
                  {question.is_anonymous === 1 && (
                    <View style={styles.anonymousBadge}>
                      <Text style={styles.anonymousText}>Anonymous</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
  },
  errorContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  errorText: {
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.red,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: spacing.lg,
    fontFamily: Fonts.SemiBold,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
    textAlign: 'center',
  },
  contentContainer: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  questionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  questionTitle: {
    fontSize: spacing.md,
    fontFamily: Fonts.SemiBold,
    color: colors.black,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: spacing.sm,
    fontFamily: Fonts.SemiBold,
  },
  questionText: {
    fontSize: spacing.md,
    fontFamily: Fonts.Regular,
    color: colors.black,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  questionFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  questionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoLabel: {
    fontSize: spacing.sm,
    fontFamily: Fonts.SemiBold,
    color: colors.darkGray,
    marginRight: spacing.xs,
    minWidth: 60,
  },
  infoValue: {
    fontSize: spacing.sm,
    fontFamily: Fonts.Regular,
    color: colors.black,
    flex: 1,
  },
  anonymousBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  anonymousText: {
    fontSize: spacing.sm,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
  },
});

export default MyQuestions;

