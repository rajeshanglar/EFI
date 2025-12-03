import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import globalStyles from '../styles/globalStyles';

interface ConferenceInformationModalProps {
  visible: boolean;
  onClose: () => void;
}

const ConferenceInformationModal: React.FC<ConferenceInformationModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={globalStyles.modalInfoOverlay}>
        <View style={globalStyles.modalInfoContainer}>
          <View style={globalStyles.modalInfoHeader}>
            <Text style={globalStyles.modalInfoTitle}>INFORMATION</Text>
            <TouchableOpacity
              style={globalStyles.modalInfoCloseButton}
              onPress={onClose}
            >
              <Text style={globalStyles.modalInfoCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={globalStyles.modalInfoContent}>
            {/* Important Section */}
            <View style={globalStyles.modalInfoSection}>
              <Text style={globalStyles.modalInfoSectionTitle}>Important</Text>
              <Text style={globalStyles.modalInfoListItem}>
                • Registration fee is exclusive of GST @ 18%.
              </Text>
              <Text style={globalStyles.modalInfoListItem}>
                • Membership number is mandatory.
              </Text>
              <Text style={globalStyles.modalInfoListItem}>
                • Please mention your mobile number and email ID for better
                communication.
              </Text>
            </View>

            {/* Registration Guidelines Section */}
            <View style={globalStyles.modalInfoSection}>
              <Text style={globalStyles.modalInfoSectionTitle}>
                Registration Guidelines
              </Text>
              <Text style={globalStyles.modalInfoListItem}>
                • Online charges will be applicable at 3% of the total amount.
              </Text>
              <Text style={globalStyles.modalInfoListItem}>
                • Registration fees include admission to the scientific halls,
                trade exhibition, public awareness programme, inaugural
                function, lunch, banquet, delegate kit, and participation
                certificate.
              </Text>
              <Text style={globalStyles.modalInfoListItem}>
                • No delegate kit for spot registrations.
              </Text>
              <Text style={globalStyles.modalInfoListItem}>
                • The participation certificate will be available to download
                once the feedback form is submitted.
              </Text>
            </View>

            {/* Cancellation Policy Section */}
            <View style={globalStyles.modalInfoSection}>
              <Text style={globalStyles.modalInfoSectionTitle}>
                Cancellation & Refund Policy
              </Text>
              <Text style={globalStyles.modalInfoListItem}>
                • Requests for cancellation refunds must be made in writing
                via email or post to the conference secretariat.
              </Text>
              <Text style={globalStyles.modalInfoListItem}>
                • No refund of registration fee will be provided for
                cancellation requests received after{' '}
                <Text style={globalStyles.modalInfoBoldText}>15.11.2025</Text>.
              </Text>
              <Text style={globalStyles.modalInfoListItem}>
                • <Text style={globalStyles.modalInfoBoldText}>30%</Text> of the registration
                fee will be deducted as processing charges, and the remaining
                amount will be refunded.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ConferenceInformationModal;

