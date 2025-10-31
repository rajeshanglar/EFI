import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { ArrowLeftIconYellow, LoginImg } from '../../../components/icons';
import globalStyles from '../../../styles/globalStyles';
import styles from '../styles';

interface Props {
  onBackToHome: () => void;
}

const LoginHeader: React.FC<Props> = React.memo(({ onBackToHome }) => (
  <ImageBackground
    source={require('../../../assets/images/wave-img.png')}
    style={globalStyles.imgBgContainerWave}
    imageStyle={globalStyles.imgBgWave}
  >
    <View style={styles.LoginLogoContainer}>
      <Image
        source={require('../../../assets/images/logo-w.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>

    <TouchableOpacity style={styles.homeBackButton} onPress={onBackToHome}>
      <ArrowLeftIconYellow size={20} />
      <Text style={styles.backButtonText}>BACK TO HOME</Text>
    </TouchableOpacity>

    <View style={styles.floatingIconContainer}>
      <View style={styles.floatingImgBlock}>
        <LoginImg
          size={Dimensions.get('window').width * 0.26}
          style={styles.floatingimg}
        />
      </View>
    </View>
  </ImageBackground>
));

export default LoginHeader;
