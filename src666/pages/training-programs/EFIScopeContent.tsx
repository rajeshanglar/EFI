import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import globalStyles, {
  colors,
  spacing,
  borderRadius,
  Fonts,
} from '../../styles/globalStyles';

const { width: screenWidth } = Dimensions.get('window');

export const EFIScopeContent: React.FC = () => {
  return (
    <View>
      <Image
        source={require('../../assets/images/efi-training-img.jpg')}
        style={styles.heroImage}
      />
      <View style={styles.contentSection}>
        <Text style={globalStyles.headingH1}>
          Surgical Certification in Robotic Pelvic and Endometriosis Expertise Cadaveric Course for Pelvis and Endometriosis Surgery
        </Text>

        <Text style={globalStyles.paragraphP}>
          The EFI-SCOPE Certification Course, launched by the Endometriosis Foundation of India (EFI), is your gateway to mastering cutting-edge techniques in the management of Deep Infiltrating Endometriosis (DIE) and complex pelvic conditions.
        </Text>

        <Text style={globalStyles.paragraphP}>
          This premier course offers a rare opportunity to enhance your surgical precision using advanced robotic technology, combining the best of learning with hands-on experience.
        </Text>
      </View>

      <View style={globalStyles.sectionCardLightYellow}>
        <Text style={globalStyles.headingH1}>Course Cost</Text>
     

        <View style={globalStyles.feeCard}>
        <Text style={globalStyles.h2}>Indian delegates</Text>
          <View style={globalStyles.feeRow}>
            <Text style={globalStyles.feeLabel}>EFI member</Text>
            <Text style={globalStyles.feeAmount}>₹ 3,00,000</Text>            
          </View>
          <View style={globalStyles.feeRow}>
            <Text style={globalStyles.feeLabel}>EFI Non-Members</Text>
            <Text style={globalStyles.feeAmount}>₹ 3,30,000</Text>
          </View>
        </View>

        <View style={globalStyles.feeCard}>
        <Text style={globalStyles.h2}>International delegates</Text>
          <View style={globalStyles.feeRow}>
            <Text style={globalStyles.feeLabel}>EFI Members</Text>
            <Text style={globalStyles.feeAmount}> ₹ 3,40,000 </Text>
          </View>
          <View style={globalStyles.feeRow}>
            <Text style={globalStyles.feeLabel}>EFI Non-Members</Text>
            <Text style={globalStyles.feeAmount}>₹ 3,80,000</Text>
          </View>
        </View>

        <Text style={globalStyles.feeNote}>
          Fee covers a two day masterclass in Hyderabad, one day cadaveric workshop in Bangalore. (Note: Candidates have to make their own travel and accommodation arrangements in Hyderabad and Bangalore.)
        </Text>

        <Text style={globalStyles.feeNoteYellow}>
        (Note: CANDIDATES HAVE TO MAKE THEIR OWN TRAVEL AND ACCOMMODATION ARRANGEMENTS IN HYDERABAD AND BANGALORE.)

        </Text>
      </View>

  

      <View style={styles.contentSection}>
        <View style={globalStyles.sectionCardBlue}>
          <Text style={[globalStyles.headingH1, globalStyles.whiteColor]}>Why This Course?</Text>
          <Text style={globalStyles.yellowTaglineH5}>The EFI-SCOPE Certification Course is meticulously designed for gynecologists and pelvic surgeons aiming to:
          </Text>
          <View style={globalStyles.mb20}>
             <Text style={[globalStyles.h2, globalStyles.whiteColor]}>Master Robotic Pelvic Surgery</Text>
             <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>Acquire proficiency in robotic techniques that reduce patient recovery time, improve surgical outcomes, and elevate the quality of care you provide. </Text>
          </View>

          <View style={globalStyles.mb20}>
             <Text style={[globalStyles.h2, globalStyles.whiteColor]}>Hands-On Experience</Text>
             <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>Through intensive cadaveric dissection and robotic simulations, gain invaluable practical exposure to the intricate anatomy of the pelvis.</Text>
          </View>

          <View style={globalStyles.mb20}>
             <Text style={[globalStyles.h2, globalStyles.whiteColor]}>Advanced Endometriosis Management</Text>
             <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>Deepen your understanding of managing the most challenging cases of 
                Endometriosis, and position yourself at the forefront of minimally invasive gynecological surgery.</Text>
                <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>This certification is more than just a qualification—it’s 
                    a professional leap toward excellence, giving you the tools to handle the most complex pelvic surgeries with unmatched precision.</Text>
          </View>

          <View style={globalStyles.mb20}>
             <Text style={[globalStyles.h2, globalStyles.whiteColor]}>Course Highlights</Text>
             <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>Three day intensive course consisting of two day intensive masterclass with live surgery observation and robotic simulator, and one day of intensive cadaveric hands on training. Learn from national and international experts in robotic surgery and Endometriosis management
                 </Text>
          </View>

          <View style={globalStyles.mb20}>
             <Text style={[globalStyles.h2, globalStyles.whiteColor]}> Exclusive Access</Text>
             <Text style={[globalStyles.paragraphP, globalStyles.whiteColor]}>With only 4 seats available (2 for each national and
                 international applicant), this course offers highly personalized training that ensures every participant receives tailored guidance. </Text>
          </View>



        
        </View>


        <View style={globalStyles.cardHeadingPara}>
            <Text style={[globalStyles.headingH1, globalStyles.mbSm]}>Course Highlights</Text>
            <Text style={globalStyles.paragraphP}>Three day intensive course consisting of two day intensive 
                masterclass with live surgery observation and robotic simulator, and one day of intensive cadaveric hands on training.
                 Learn from national and international experts in robotic surgery and Endometriosis management. </Text>
        </View>

<View></View>
        <View style={globalStyles.cardHeadingPara}>
            <Text style={[globalStyles.headingH1, globalStyles.mbSm]}>Exclusive Access</Text>
            <Text style={globalStyles.paragraphP}>With only 4 seats available (2 for each national and 
                international applicant), this course offers highly personalized training that ensures every participant receives 
                tailored guidance. </Text>
        </View>



        <View style={globalStyles.sectionCardBlue}>
          <Text style={[globalStyles.headingH1, globalStyles.whiteColor]}>Program Details</Text>
          <Text style={[globalStyles.taglineH5, globalStyles.whiteColor]}>Duration: 3 days</Text>

          <View style={styles.detailBlock}>
            <Text style={[globalStyles.h2, globalStyles.whiteColor]}>Format</Text>
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
                Two day Masterclass at Apollo Hospitals, Hyderabad.
              </Text>
            </View>
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
                One day cadaveric workshop at Bangalore (R.A.I.C – MS Ramaiah Advanced Learning Centre).
              </Text>
            </View>
          </View>

          <View style={styles.detailBlock}>
            <Text style={[globalStyles.h2, globalStyles.whiteColor]}>Key Learning Outcomes</Text>
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
                Only 4 seats available (2 each for national and international applicants).
              </Text>
            </View>
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
                Personalised training ensuring every participant receives tailored guidance.
              </Text>
            </View>
          </View>

          <View style={styles.detailBlock}>
            <Text style={[globalStyles.h2, globalStyles.whiteColor]}>Eligibility Criteria</Text>
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
                Gynaecologists and Pelvic Surgeons with a completed specialization in Obstetrics and Gynaecology (MS, MD, DNB or equivalent).
              </Text>
            </View>
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
                A minimum of 3-5 years of surgical experience, preferably in laparoscopy or robotic surgery.
              </Text>
            </View>
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
                Active practitioners with a strong interest in robotic surgery for complex Endometriosis cases, ideally with access to a robotic surgery system.
              </Text>
            </View>
            <View style={globalStyles.bulletRowLight}>
              <View style={globalStyles.bulletDotAccent} />
              <Text style={globalStyles.bulletTextLight}>
                Applicants must have spent at least 20 hours on a robotic simulator (contact your local intuitive representative or similar for simulation coursework).
              </Text>
            </View>
          </View>

          <Text style={globalStyles.bulletTextLight}>
            Surgeons from across the globe are welcome to apply, ensuring that this program draws the finest minds in Endometriosis management and robotic surgery.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    height: screenWidth * 0.45,
    resizeMode: 'cover',
  },
  contentSection: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  sectionCardYellow: {
    backgroundColor: '#FFF1CC',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    fontSize: spacing.lg,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  costGroup: {
    gap: spacing.xs,
  },
  costGroupTitle: {
    fontSize: spacing.md,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  costLabel: {
    fontSize: spacing.md,
    fontFamily: Fonts.Medium,
    color: colors.black,
  },
  costAmount: {
    fontSize: spacing.md,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  costNote: {
    fontSize: screenWidth * 0.033,
    fontFamily: Fonts.Regular,
    color: colors.darkGray,
  },

  sectionHeadingLight: {
    fontSize: spacing.lg,
    fontFamily: Fonts.Bold,
    color: colors.white,
  },
  sectionWhiteBulletCard: {},
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
 
  detailTag: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    backgroundColor: colors.accent,
    fontSize: spacing.sm,
    fontFamily: Fonts.Bold,
    color: colors.black,
  },
  detailBlock: {
    gap: spacing.sm,
  },
  detailHeading: {
    fontSize: spacing.md,
    fontFamily: Fonts.Bold,
    color: colors.white,
  },
});
