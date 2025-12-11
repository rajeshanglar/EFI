import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import Header from '../../components/Header';
import globalStyles, { colors, spacing, borderRadius, Fonts } from '../../styles/globalStyles';
import { getPaymentTransactionById } from '../../services/commonService';
import { DownloadMembershipInvoice } from '../../services/staticService';
import { ToastService } from '../../utils/service-handlers';
import { DownloadWhiteIcon } from '../../components/icons';
import ReactNativeBlobUtil from 'react-native-blob-util';

const { width: screenWidth } = Dimensions.get('window');

interface GatewayResponseParsed {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  id?: string;
  entity?: string;
  amount?: number;
  currency?: string;
  status?: string;
  order_id?: string;
  method?: string;
  card?: {
    id?: string;
    entity?: string;
    name?: string;
    last4?: string;
    network?: string;
    type?: string;
    issuer?: string;
    international?: boolean;
    emi?: boolean;
    sub_type?: string;
  };
  bank?: any;
  wallet?: any;
  vpa?: any;
  email?: string;
  contact?: string;
  fee?: number;
  tax?: number;
  captured?: boolean;
  acquirer_data?: {
    auth_code?: string;
  };
}

interface PaymentTransactionDetails {
  id: number;
  registration_type: string;
  reference_id: number;
  registration_number: string;
  source_type: string;
  transaction_id: string;
  payment_gateway: string;
  payment_method: string;
  amount: number;
  currency: string;
  status: string;
  gateway_transaction_id: string;
  gateway_order_id: string;
  gateway_response: string;
  gateway_response_parsed?: GatewayResponseParsed;
  failure_reason: string | null;
  payment_date: string;
  created_by: number;
  updated_by: number | null;
  created_on: string;
  updated_on: string;
  first_name: string;
  last_name: string;
  registration_email: string;
  registration_phone: string;
  registration_serial_number: string;
  address: string;
  city: string;
  country: number;
  dob: string;
  grand_total: string;
  sub_total: string;
  coupon_code: string | null;
  coupon_value: string;
  full_name: string;
}

interface MyPaymentsDetailsProps {
  onBack: () => void;
  onNavigateToHome: () => void;
  paymentData?: { id: number } | PaymentTransactionDetails;
}

const MyPaymentsDetails: React.FC<MyPaymentsDetailsProps> = ({
  onBack,
  onNavigateToHome,
  paymentData,
}) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentTransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!paymentData) {
        setLoading(false);
        setError('Payment data not found');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const paymentId = paymentData.id;
        const response = await getPaymentTransactionById(paymentId);
        
        if (response?.success && response?.data) {
          setPaymentDetails(response.data);
        } else {
          setError(response?.message || 'Failed to fetch payment details');
        }
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch payment details. Please try again.';
        setError(errorMessage);
        ToastService.error('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentData]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    } catch {
      return dateString;
    }
  };

  const mapStatus = (status: string): 'Paid' | 'Pending' | 'Failed' => {
    const s = status.toLowerCase();
    if (s === 'success' || s === 'paid' || s === 'captured') return 'Paid';
    if (s === 'pending' || s === 'processing') return 'Pending';
    return 'Failed';
  };

  const getStatusColor = (status: string) => {
    const colorsMap: Record<string, string> = {
      'Paid': '#4CAF50',
      'Pending': '#FF9800',
      'Failed': '#F44336',
    };
    return colorsMap[status] || colors.darkGray;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="Payment Details"
          onBack={onBack}
          onNavigateToHome={onNavigateToHome}
          onMenuItemPress={(id: any) => console.log('Menu:', id)}
        />
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyText, { marginTop: spacing.md }]}>
            Loading payment details...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !paymentDetails) {
    return (
      <View style={styles.container}>
        <Header
          title="Payment Details"
          onBack={onBack}
          onNavigateToHome={onNavigateToHome}
          onMenuItemPress={(id: any) => console.log('Menu:', id)}
        />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.red }]}>
            {error || 'Payment data not found'}
          </Text>
        </View>
      </View>
    );
  }

  const displayStatus = mapStatus(paymentDetails.status);
  const statusColor = getStatusColor(displayStatus);
  const cardInfo = paymentDetails.gateway_response_parsed?.card;

  const infoRows = [
    { label: 'Transaction ID', value: paymentDetails.transaction_id || 'N/A' },
    { label: 'Registration Type', value: paymentDetails.registration_type || 'N/A' },
    { label: 'Registration Number', value: paymentDetails.registration_number || paymentDetails.registration_serial_number || 'N/A' },
    { label: 'Source Type', value: paymentDetails.source_type || 'N/A' },
    { label: 'Payment Gateway', value: paymentDetails.payment_gateway || 'N/A' },
    { label: 'Payment Method', value: paymentDetails.payment_method || 'N/A' },
    // { label: 'Sub Total', value: `₹ ${parseFloat(paymentDetails.sub_total || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
    // { label: 'Coupon Code', value: paymentDetails.coupon_code || 'N/A' },
    // { label: 'Coupon Value', value: `₹ ${parseFloat(paymentDetails.coupon_value || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
    { label: 'Grand Total', value: `₹ ${parseFloat(paymentDetails.grand_total || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
    { label: 'Currency', value: paymentDetails.currency || 'N/A' },
    { label: 'Status', value: displayStatus, isStatus: true },
    { label: 'Gateway Transaction ID', value: paymentDetails.gateway_transaction_id || 'N/A' },
    { label: 'Gateway Order ID', value: paymentDetails.gateway_order_id || 'N/A' },
    { label: 'Payment Date', value: formatDate(paymentDetails.payment_date || paymentDetails.created_on) },
    // { label: 'Created On', value: formatDate(paymentDetails.created_on) },
    // { label: 'Updated On', value: formatDate(paymentDetails.updated_on) },
  ];

  const userInfoRows = [
    { label: 'Full Name', value: paymentDetails.full_name || `${paymentDetails.first_name || ''} ${paymentDetails.last_name || ''}`.trim() || 'N/A' },
    { label: 'Email', value: paymentDetails.registration_email || 'N/A' },
    { label: 'Phone', value: paymentDetails.registration_phone || 'N/A' },
    // { label: 'Date of Birth', value: paymentDetails.dob ? formatDate(paymentDetails.dob) : 'N/A' },
    { label: 'Address', value: paymentDetails.address || 'N/A' },
    { label: 'City', value: paymentDetails.city || 'N/A' },
    ...(paymentDetails.failure_reason ? [{ label: 'Failure Reason', value: paymentDetails.failure_reason }] : []),
  ];

  const cardInfoRows = cardInfo ? [
    { label: 'Card Network', value: cardInfo.network || 'N/A' },
    { label: 'Card Type', value: cardInfo.type || 'N/A' },
    // { label: 'Last 4 Digits', value: cardInfo.last4 ? `**** ${cardInfo.last4}` : 'N/A' },
    // { label: 'Card Issuer', value: cardInfo.issuer || 'N/A' },
    { label: 'International', value: cardInfo.international ? 'Yes' : 'No' },
    // { label: 'EMI', value: cardInfo.emi ? 'Yes' : 'No' },
  ] : [];

  const gatewayInfoRows = paymentDetails.gateway_response_parsed ? [
    { label: 'Payment ID', value: paymentDetails.gateway_response_parsed.razorpay_payment_id || paymentDetails.gateway_response_parsed.id || 'N/A' },
    { label: 'Order ID', value: paymentDetails.gateway_response_parsed.razorpay_order_id || paymentDetails.gateway_response_parsed.order_id || 'N/A' },
    // { label: 'Gateway Status', value: paymentDetails.gateway_response_parsed.status || 'N/A' },
    // { label: 'Captured', value: paymentDetails.gateway_response_parsed.captured ? 'Yes' : 'No' },
    // ...(paymentDetails.gateway_response_parsed.fee ? [{ label: 'Gateway Fee', value: `₹ ${(paymentDetails.gateway_response_parsed.fee / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` }] : []),
    // ...(paymentDetails.gateway_response_parsed.tax ? [{ label: 'Tax', value: `₹ ${(paymentDetails.gateway_response_parsed.tax / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` }] : []),
    // ...(paymentDetails.gateway_response_parsed.acquirer_data?.auth_code ? [{ label: 'Auth Code', value: paymentDetails.gateway_response_parsed.acquirer_data.auth_code }] : []),
  ] : [];

  const handleDownloadInvoice = async () => {
    if (!paymentDetails?.reference_id) {
      ToastService.error('Error', 'Reference ID not found');
      return;
    }

    if (isDownloading) {
      return;
    }

    setIsDownloading(true);

    try {
      const payload = {
        registration_id: paymentDetails.reference_id,
      };

      const result = await DownloadMembershipInvoice(payload);

      if (result?.success === true) {
        if (!result?.data?.pdf_base64) {
          throw new Error(result?.message || 'PDF data not found in response.');
        }

        const { pdf_base64, filename } = result.data;

        // Clean base64 data
        let base64Data = pdf_base64;
        if (base64Data.includes(',')) {
          base64Data = base64Data.split(',')[1];
        }
        base64Data = base64Data.trim();

        // Request storage permission for Android 9 and below
        if (Platform.OS === 'android' && Platform.Version < 29) {
          try {
            const permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
            const checkResult = await check(permission);

            if (checkResult !== RESULTS.GRANTED) {
              const requestResult = await request(permission);
              if (requestResult !== RESULTS.GRANTED) {
                Alert.alert(
                  'Storage Permission Required',
                  'Please grant storage permission to download the receipt.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Open Settings',
                      onPress: () => Linking.openSettings()
                    }
                  ]
                );
                setIsDownloading(false);
                return;
              }
            }
          } catch (error) {
            console.error('Permission request error:', error);
          }
        }

        // Determine file path
        let filePath: string;
        if (Platform.OS === 'android') {
          if (Platform.Version >= 29) {
            const publicDownloadsPath = '/storage/emulated/0/Download';
            try {
              const publicDownloadsExists = await ReactNativeBlobUtil.fs.exists(publicDownloadsPath);
              if (publicDownloadsExists) {
                const testFilePath = `${publicDownloadsPath}/.test_write_${Date.now()}`;
                try {
                  await ReactNativeBlobUtil.fs.writeFile(testFilePath, 'test', 'utf8');
                  await ReactNativeBlobUtil.fs.unlink(testFilePath);
                  filePath = `${publicDownloadsPath}/${filename}`;
                } catch {
                  filePath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
                }
              } else {
                filePath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
              }
            } catch {
              filePath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
            }
          } else {
            filePath = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${filename}`;
          }
        } else {
          filePath = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${filename}`;
        }

        // Write file
        await ReactNativeBlobUtil.fs.writeFile(filePath, base64Data, 'base64');

        // Verify file was written
        const fileExists = await ReactNativeBlobUtil.fs.exists(filePath);
        if (!fileExists) {
          throw new Error('File was not saved successfully. Please check permissions.');
        }

        // Show Android notification
        if (Platform.OS === 'android') {
          try {
            await ReactNativeBlobUtil.android.addCompleteDownload({
              title: filename,
              description: 'Payment receipt PDF downloaded successfully',
              mime: 'application/pdf',
              path: filePath,
              showNotification: true,
            });
          } catch (notificationError) {
            console.warn('Failed to add Android notification:', notificationError);
          }
        }

        let successMessage = `Receipt saved successfully!\n\nFile: ${filename}`;
        if (Platform.OS === 'android') {
          successMessage += '\n\nLocation: Downloads folder';
        } else {
          successMessage += '\n\nLocation: Files app';
        }

        // Alert.alert('Success', successMessage);
        ToastService.success('Success', 'Receipt downloaded successfully');
      } else {
        throw new Error(result?.message || 'Failed to download receipt');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to download receipt. Please try again.';
      ToastService.error('Error', errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Payment Details"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
        onMenuItemPress={(id: any) => console.log('Menu:', id)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Information */}
        <View style={styles.detailsCard}>
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Payment Information</Text>
            <View style={styles.headerRight}>
              <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {displayStatus}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownloadInvoice}
                disabled={isDownloading}
                activeOpacity={0.7}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <DownloadWhiteIcon size={18} color={colors.white} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoSection}>
            {infoRows.map((row, index) => (
              <View key={index} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text
                  style={[
                    styles.infoValue,
                    row.isStatus && { color: statusColor, fontFamily: Fonts.SemiBold },
                  ]}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* User Information */}
      <View style={[styles.detailsCard, { marginTop: spacing.md }]}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <View style={styles.infoSection}>
            {userInfoRows.map((row, index) => (
              <View key={index} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View> 

        {/* Card Information */}
        {cardInfoRows.length > 0 && (
          <View style={[styles.detailsCard, { marginTop: spacing.md }]}>
            <Text style={styles.sectionTitle}>Card Information</Text>
            <View style={styles.infoSection}>
              {cardInfoRows.map((row, index) => (
                <View key={index} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Gateway Information */}
        {gatewayInfoRows.length > 0 && (
          <View style={[styles.detailsCard, { marginTop: spacing.md }]}>
            <Text style={styles.sectionTitle}>Gateway Information</Text>
            <View style={styles.infoSection}>
              {gatewayInfoRows.map((row, index) => (
                <View key={index} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value}</Text>
                </View>
              ))}
            </View>
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
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: screenWidth * 0.033,
    fontFamily: Fonts.SemiBold,
  },
  infoSection: {
    gap: spacing.md,
  },
  infoRow: {
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: screenWidth * 0.032,
    fontFamily: Fonts.Regular,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: screenWidth * 0.036,
    fontFamily: Fonts.Medium,
    color: colors.black,
    lineHeight: screenWidth * 0.048,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.038,
    fontFamily: Fonts.Bold,
    color: colors.black,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
});

export default MyPaymentsDetails;

