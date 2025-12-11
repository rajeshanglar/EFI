import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { CardRightArrowIcon, DownloadWhiteIcon } from '../../components/icons';
import { getPaymentTransactions } from '../../services/commonService';
import { ToastService } from '../../utils/service-handlers';
import { useAuth } from '../../contexts/AuthContext';

const { width: screenWidth } = Dimensions.get('window');
const PER_PAGE = 10;

interface PaymentTransaction {
  id: number;
  transaction_id: string;
  registration_type: string;
  reference_id: number;
  payment_gateway: string;
  payment_method: string;
  amount: number;
  currency: string;
  status: string;
  gateway_transaction_id: string;
  gateway_order_id: string;
  failure_reason: string | null;
  payment_date: string;
  created_on: string;
  updated_on: string;
  first_name: string;
  last_name: string;
  registration_email: string;
  registration_phone: string;
  registration_serial_number: string;
  full_name: string;
}

interface PaymentData {
  id: string;
  registration_type: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  transaction_id?: string;
}

interface MyPaymentsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  onNavigateToPaymentDetails?: (paymentData: PaymentTransaction) => void;
}

const MyPayments: React.FC<MyPaymentsProps> = ({
  onBack,
  onNavigateToHome,
  onNavigateToPaymentDetails,
}) => {
  const { isAuthenticated } = useAuth();
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [transactionsMap, setTransactionsMap] = useState<Map<string, PaymentTransaction>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  };

  const mapStatus = (status: string): 'Paid' | 'Pending' | 'Failed' => {
    const s = status.toLowerCase();
    if (s === 'success' || s === 'paid') return 'Paid';
    if (s === 'pending' || s === 'processing') return 'Pending';
    return 'Failed';
  };

  const mapTransactions = (transactions: PaymentTransaction[]): PaymentData[] => {
    return transactions.map((t) => ({
      id: t.id.toString(),
      registration_type: t.registration_type || '',
      date: formatDate(t.payment_date || t.created_on),
      amount: t.amount || 0,
      status: mapStatus(t.status),
      transaction_id: t.transaction_id,
    }));
  };

  const fetchPayments = async (pageNum: number, isLoadMore: boolean = false) => {
    if (!isAuthenticated) {
      setLoading(false);
      setError('Please login to view your payments');
      return;
    }

    try {
      isLoadMore ? setLoadingMore(true) : (setLoading(true), setError(null));
      
      const response = await getPaymentTransactions(pageNum, PER_PAGE);
      
      console.log('=== GET PAYMENT TRANSACTIONS RESPONSE ===');
      console.log('Full Response:', JSON.stringify(response, null, 2));
      console.log('Success:', response?.success);
      console.log('Message:', response?.message);
      console.log('Data:', JSON.stringify(response?.data, null, 2));
      
      if (response?.success && response?.data?.transactions) {
        const transactions: PaymentTransaction[] = response.data.transactions;
        
        console.log('=== TRANSACTIONS DATA ===');
        console.log('Transactions Count:', transactions.length);
        console.log('Transactions Array:', JSON.stringify(transactions, null, 2));
        
        const mappedPayments = mapTransactions(transactions);
        
        console.log('=== MAPPED PAYMENTS ===');
        console.log('Mapped Payments:', JSON.stringify(mappedPayments, null, 2));
        
        // Store full transaction data in map
        setTransactionsMap((prevMap) => {
          const newMap = new Map(prevMap);
          transactions.forEach((t) => {
            newMap.set(t.id.toString(), t);
          });
          return newMap;
        });
        
        setPayments((prev) => isLoadMore ? [...prev, ...mappedPayments] : mappedPayments);
        setPage(response.data.pagination?.current_page || pageNum);
        setHasNextPage(response.data.pagination?.has_next_page || false);
      } else if (!isLoadMore) {
        setError(response?.message || 'Failed to fetch payments');
        setPayments([]);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch payment transactions. Please try again.';
      if (!isLoadMore) {
        setError(errorMessage);
        setPayments([]);
      }
      ToastService.error('Error', isLoadMore ? 'Failed to load more payments' : errorMessage);
    } finally {
      isLoadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1, false);
  }, [isAuthenticated]);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    
    if (isNearBottom && hasNextPage && !loadingMore) {
      fetchPayments(page + 1, true);
    }
  };
  

  const handlePaymentDetails = (paymentId: string) => {
    console.log('=== PAYMENT DETAILS CLICKED ===');
    console.log('Payment ID:', paymentId);
    
    const transaction = transactionsMap.get(paymentId);
    console.log('Transaction Found:', transaction ? 'Yes' : 'No');
    
    if (transaction) {
      console.log('=== TRANSACTION DATA ===');
      console.log('Full Transaction:', JSON.stringify(transaction, null, 2));
      console.log('Transaction ID:', transaction.transaction_id);
      console.log('Registration Type:', transaction.registration_type);
      console.log('Amount:', transaction.amount);
      console.log('Currency:', transaction.currency);
      console.log('Status:', transaction.status);
      console.log('Payment Date:', transaction.payment_date);
    }
    
    if (transaction && onNavigateToPaymentDetails) {
      onNavigateToPaymentDetails(transaction);
    }
  };

  const getStatusColor = (status: string) => {
    const colorsMap: Record<string, string> = {
      'Paid': '#4CAF50',
      'Pending': '#FF9800',
      'Failed': '#F44336',
    };
    return colorsMap[status] || colors.darkGray;
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Payments"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.emptyText, { marginTop: spacing.md }]}>
              Loading payments...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.red }]}>
              {error}
            </Text>
          </View>
        ) : payments.length === 0 ? (
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
                  <Text style={styles.paymentTitle}>{payment.registration_type}</Text>
                  <Text style={styles.paymentTransactionIdLabel}>Transaction ID</Text>
                <Text style={styles.paymentTransactionId}>{payment.transaction_id}</Text>
                </View>

                {/* <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => handleDownloadInvoice(payment.id)}
                  activeOpacity={0.7}>               
                 <View style={styles.downloadIconContainer}>                   
                    <DownloadWhiteIcon size={18} color={colors.white} />
                  </View>
                </TouchableOpacity> */}

              <TouchableOpacity
                  style={styles.rightArrowButton}
                  onPress={() => handlePaymentDetails(payment.id)}
                  activeOpacity={0.7}>               
                 <View style={styles.rightArrowIconContainer}>
                    <CardRightArrowIcon size={18} color={colors.white} />
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
        
        {/* Loading more indicator */}
        {loadingMore && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingMoreText}>Loading more...</Text>
          </View>
        )}
        
        {/* End of list indicator */}
        {!hasNextPage && payments.length > 0 && !loading && (
          <View style={styles.endOfListContainer}>
            <Text style={styles.endOfListText}>No more payments to load</Text>
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
    marginBottom: spacing.sm,
  },
  paymentCardLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  paymentLabel: {
    fontSize: screenWidth * 0.03,
    fontFamily: Fonts.Regular,
    color: colors.gray,
    marginBottom:0,
  },
  paymentTitle: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Bold,
    color: colors.black,
    lineHeight: screenWidth * 0.05,
    textTransform: 'capitalize',
  },

  paymentTransactionIdLabel:{
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.Regular,
    color: colors.black,
    marginBottom:0,
    marginTop: spacing.sm,
  },
  paymentTransactionId:{
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.SemiBold,
    color: colors.primary,
    marginBottom:0,
  },
  rightArrowButton:{
    width: 40,
    height: 40,
    borderRadius: 20,    
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,    
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  rightArrowIconContainer: {
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
    paddingTop: spacing.sm,
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
    marginBottom:0,
  },
  paymentInfoValue: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.SemiBold,
    color: colors.black,
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  loadingMoreText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.darkGray,
  },
  endOfListContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  endOfListText: {
    fontSize: screenWidth * 0.033,
    fontFamily: Fonts.Regular,
    color: colors.gray,
  },
});

export default MyPayments;

