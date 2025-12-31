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
import { stripHtml } from '../../../../utils/stripHtml';
import { formatDate } from '../../../../utils/dateFormatter';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Question {
  question_id: string | number;
  session_id: number;
  question: string;
  status: string;
  created_at: string;
  session_title?: string;
  is_anonymous?: number;
  answer: any;
}

interface MyQuestionsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  sessionId?: number | string;
}

const MyQuestions: React.FC<MyQuestionsProps> = ({
  onBack,
  onNavigateToHome,
  sessionId,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions on mount or when sessionId changes
  useEffect(() => {
    fetchQuestions();
  }, [sessionId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Log payload
      const payload = sessionId ? { session_id: sessionId } : {};
      console.log('My Questions - Payload:', payload);
      
      const response = await getSessionQuestions(sessionId);
      
      // Log response
      console.log('My Questions - Response:', response);
      
      if (response?.success && response?.data) {
        setQuestions(response.data.questions || []);
      } else {
        setError(response?.message || 'Failed to load questions');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load questions');
      ToastService.error('Error', err?.response?.data?.message || err?.message || 'Failed to load questions');
    } finally {
      setLoading(false);
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
    const statusMap: Record<string, string> = {
      approved: 'Approved',
      pending: 'Pending',
      answered: 'Answered',
      rejected: 'Rejected',
    };
    return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Questions"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={() => {}}
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

                <Text style={styles.questionText}>
                  <Text style={styles.questionTextBold}>Q:</Text> {question.question}
                </Text>
                
                {question.status.toLowerCase() !== 'answered' && (
                  <View style={styles.statusBadgeContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(question.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(question.status) }]}>
                        {getStatusText(question.status)}
                      </Text>
                    </View>
                  </View>
                )}
                
                {question.answer && (
                  <View style={styles.answerContainer}> 
                    <Text style={styles.questionTextBold}>A:</Text>                
                    <Text style={styles.answerText}>{stripHtml(question.answer)}</Text>
                  </View>
                )}

          <View style={styles.questionFooter}>
                  <View style={styles.questionInfo}>
                    <Text style={styles.infoLabel}>Asked on:</Text>
                    <Text style={styles.infoValue}>{formatDate(question.created_at)}</Text>
                  </View>
                  {/* {question.session_title && (
                    <View style={styles.questionInfo}>
                      <Text style={styles.infoLabel}>Session:</Text>
                      <Text style={styles.infoValue} numberOfLines={1}>
                        {question.session_title}
                      </Text>
                    </View>
                  )} */}
                  {/* {question.is_anonymous === 1 && (
                    <View style={styles.anonymousBadge}>
                      <Text style={styles.anonymousText}>Anonymous</Text>
                    </View>
                  )} */}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusBadgeContainer: {
    marginTop:0,
    alignSelf: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,


    gap: spacing.sm,
 
  },
  statusText: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.SemiBold,
  },
  questionText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Medium,
    color: colors.black,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  answerContainer: {
    marginTop: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
    width: '95%',
  },
  answerText: {
    fontSize: screenWidth * 0.037,
    fontFamily: Fonts.Regular,
    color: colors.primary,
    flex: 1,
  },
  questionTextBold: {
    fontSize: spacing.md,
    fontFamily: Fonts.SemiBold,
    color: colors.black,
  },
  questionFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
    
  },
  questionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:5,
  },
  infoLabel: {
    fontSize:screenWidth * 0.03,
    fontFamily: Fonts.SemiBold,
    color: colors.darkGray,
    marginRight: spacing.xs,
    minWidth: 60,
  },
  infoValue: {
    fontSize:screenWidth * 0.032,
    fontFamily: Fonts.Regular,
    color: colors.black,
    flex: 1,
  },
});

export default MyQuestions;

