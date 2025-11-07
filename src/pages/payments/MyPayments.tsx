import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Header } from '../../components/Header';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { DownloadWhiteIcon } from '../../components/icons';

const { width: screenWidth } = Dimensions.get('window');

interface PaymentData {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
}

interface MyPaymentsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

const MyPayments: React.FC<MyPaymentsProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  // Mock payment data - Replace with actual API data
  const payments: PaymentData[] = [
    {
      id: '1',
      title: '3rd Edition of Endometriosis Congress',
      date: '17-10-2025',
      amount: 11000,
      status: 'Paid',
    },
    // Add more payments as needed
  ];

  const handleDownload = (paymentId: string) => {
    console.log('Downloading receipt for payment:', paymentId);
    // Implement download logic here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return '#4CAF50'; // Green
      case 'Pending':
        return '#FF9800'; // Orange
      case 'Failed':
        return '#F44336'; // Red
      default:
        return colors.darkGray;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Payments"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {payments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No payments found</Text>
          </View>
        ) : (
          payments.map((payment) => (
            <View key={payment.id} style={styles.paymentCard}>
              {/* Top Section */}
              <View style={styles.paymentCardTop}>
                <View style={styles.paymentCardLeft}>
                  <Text style={styles.paymentLabel}>Payment</Text>
                  <Text style={styles.paymentTitle}>{payment.title}</Text>
                </View>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleDownload(payment.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.downloadIconContainer}>
                    <DownloadWhiteIcon size={18} color={colors.white} />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Bottom Section */}
              <View style={styles.paymentCardBottom}>
                {/* Date */}
                <View style={styles.paymentInfoColumn}>
                  <Text style={styles.paymentInfoLabel}>Date</Text>
                  <Text style={styles.paymentInfoValue}>{payment.date}</Text>
                </View>

                {/* Amount */}
                <View style={styles.paymentInfoColumn}>
                  <Text style={styles.paymentInfoLabel}>Amount</Text>
                  <Text style={styles.paymentInfoValue}>
                    ₹ {payment.amount.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* Status */}
                <View style={styles.paymentInfoColumn}>
                  <Text style={styles.paymentInfoLabel}>Status</Text>
                  <Text
                    style={[
                      styles.paymentInfoValue,
                      { color: getStatusColor(payment.status) },
                    ]}
                  >
                    {payment.status}
                  </Text>
                </View>
              </View>
            </View>
          ))
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
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
  },
  paymentCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  paymentCardLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  paymentLabel: {
    fontSize: screenWidth * 0.03,
    fontFamily: Fonts.Regular,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  paymentTitle: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Bold,
    color: colors.black,
    lineHeight: screenWidth * 0.05,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  paymentInfoColumn: {
    flex: 1,
    alignItems: 'flex-start',
  },
  paymentInfoLabel: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.Regular,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  paymentInfoValue: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Medium,
    color: colors.black,
  },
});

export default MyPayments;

