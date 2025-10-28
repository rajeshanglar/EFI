import React from 'react';
import { SvgProps } from 'react-native-svg';

// Import SVG files as React components
import AbstractIconSvg from '../../assets/images/abstract-icon.svg';
import ArrowRightIconSvg from '../../assets/images/arrow-right-icon.svg';
import MyCardsIconSvg from '../../assets/images/my-cards-icon.svg';
import BlogIconSvg from '../../assets/images/blogs-icon.svg';
import MediaIconSvg from '../../assets/images/media-icon.svg';
import DonationsIconSvg from '../../assets/images/donations-icon.svg';
import ContactIconSvg from '../../assets/images/contact-icon.svg';
import FacebookIconSvg from '../../assets/images/facebook-icon.svg';
import TwitterIconSvg from '../../assets/images/twitter-icon.svg';
import LinkedinIconSvg from '../../assets/images/linkedin-icon.svg';
import YoutubeIconSvg from '../../assets/images/youtube-icon.svg';
import AboutUsIconSvg from '../../assets/images/info-icon.svg';
import BoardIconSvg from '../../assets/images/board-icon.svg';
import InformationIconSvg from '../../assets/images/information-icon.svg';
import InfoIconSvg from '../../assets/images/info-icon.svg';
import TrainingIconSvg from '../../assets/images/training-session-icon.svg';
import OutreachIconSvg from '../../assets/images/training-session-icon.svg';
import SurgeryIconSvg from '../../assets/images/surgery-icon.svg';
import CongressIconSvg from '../../assets/images/conference-icon.svg';
import RunIconSvg from '../../assets/images/yellow-ribbon-icon.svg';
import MembershipIconSvg from '../../assets/images/membership-icon.svg';
import HomeIconSvg from '../../assets/images/home-icon.svg';
import UserIconSvg from '../../assets/images/user-icon.svg';
import NotificationIconSvg from '../../assets/images/notification-icon.svg';
import MenuIconSvg from '../../assets/images/menu-icon.svg';
import LoginImgSvg from '../../assets/images/login-img.svg';
import FundraisingIconSvg from '../../assets/images/fundraising-icon.svg';
import JoinCauseIconSvg from '../../assets/images/join-cause-icon.svg';
import PartnershipsIconSvg from '../../assets/images/corporate-icon.svg';
import CloseIconSvg from '../../assets/images/close-icon.svg';
import TopArrowIconSvg from '../../assets/images/top-arrow-icon.svg';
import BottomArrowIconSvg from '../../assets/images/bottom-arrow-icon.svg';
import CardRightArrowIconSvg from '../../assets/images/card-right-arrow-icon.svg';

import WhiteMyCardsIconSvg from '../../assets/images/white-my-cards-icon.svg';
import WhiteLoginIconSvg from '../../assets/images/white-login-icon.svg';
import WhiteUserIconSvg from '../../assets/images/white-user-icon.svg';
import WhiteCloseIconSvg from '../../assets/images/white-close-icon.svg';
import EmailIconSvg from '../../assets/images/email-icon.svg';
import PasswordIconSvg from '../../assets/images/password-icon.svg';
import YellowRibbonIconSvg from '../../assets/images/yellow-ribbon-icon.svg';
import RefreshIconSvg from '../../assets/images/refresh-icon.svg';

import ArrowLeftIconYellowSvg from '../../assets/images/arrow-left-icon-yellow.svg';
import BackArrowIconSvg from '../../assets/images/backarrow-icon.svg';
import HomeHeaderIconSvg from '../../assets/images/home-header-icon.svg';
import SuccessIconSvg from '../../assets/images/success-icon.svg';
import DownloadIconSvg from '../../assets/images/download-icon.svg';

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

// Export individual icon components
export const AbstractIcon = ({ size = 24, color, style }: IconProps) => (
  <AbstractIconSvg width={size} height={size} color={color} style={style} />
);

export const ArrowRightIcon = ({ size = 24, color, style }: IconProps) => (
  <ArrowRightIconSvg width={size} height={size} color={color} style={style} />
);

export const MyCardsIcon = ({ size = 24, color, style }: IconProps) => (
  <MyCardsIconSvg width={size} height={size} color={color} style={style} />
);

export const BlogIcon = ({ size = 24, color, style }: IconProps) => (
  <BlogIconSvg width={size} height={size} color={color} style={style} />
);

export const MediaIcon = ({ size = 24, color, style }: IconProps) => (
  <MediaIconSvg width={size} height={size} color={color} style={style} />
);

export const DonationsIcon = ({ size = 24, color, style }: IconProps) => (
  <DonationsIconSvg width={size} height={size} color={color} style={style} />
);

export const ContactIcon = ({ size = 24, color, style }: IconProps) => (
  <ContactIconSvg width={size} height={size} color={color} style={style} />
);

export const FacebookIcon = ({ size = 24, color, style }: IconProps) => (
  <FacebookIconSvg width={size} height={size} color={color} style={style} />
);

export const TwitterIcon = ({ size = 24, color, style }: IconProps) => (
  <TwitterIconSvg width={size} height={size} color={color} style={style} />
);

export const LinkedinIcon = ({ size = 24, color, style }: IconProps) => (
  <LinkedinIconSvg width={size} height={size} color={color} style={style} />
);

export const YoutubeIcon = ({ size = 24, color, style }: IconProps) => (
  <YoutubeIconSvg width={size} height={size} color={color} style={style} />
);

export const AboutUsIcon = ({ size = 24, color, style }: IconProps) => (
  <AboutUsIconSvg width={size} height={size} color={color} style={style} />
);

export const BoardIcon = ({ size = 24, color, style }: IconProps) => (
  <BoardIconSvg width={size} height={size} color={color} style={style} />
);

export const InformationIcon = ({ size = 24, style }: IconProps) => (
  <InformationIconSvg width={size} height={size} style={style} />
);

export const InfoIcon = ({ size = 24, color, style }: IconProps) => (
  <InfoIconSvg width={size} height={size} color={color} style={style} />
);

export const TrainingIcon = ({ size = 24, color, style }: IconProps) => (
  <TrainingIconSvg width={size} height={size} color={color} style={style} />
);

export const OutreachIcon = ({ size = 24, color, style }: IconProps) => (
  <OutreachIconSvg width={size} height={size} color={color} style={style} />
);

export const SurgeryIcon = ({ size = 24, color, style }: IconProps) => (
  <SurgeryIconSvg width={size} height={size} color={color} style={style} />
);

export const CongressIcon = ({ size = 24, color, style }: IconProps) => (
  <CongressIconSvg width={size} height={size} color={color} style={style} />
);

export const RunIcon = ({ size = 24, color, style }: IconProps) => (
  <RunIconSvg width={size} height={size} color={color} style={style} />
);

export const MembershipIcon = ({ size = 24, color, style }: IconProps) => (
  <MembershipIconSvg width={size} height={size} color={color} style={style} />
);

export const HomeIcon = ({ size = 24, color, style }: IconProps) => (
  <HomeIconSvg width={size} height={size} color={color} style={style} />
);

export const UserIcon = ({ size = 24, color, style }: IconProps) => (
  <UserIconSvg width={size} height={size} color={color} style={style} />
);

export const NotificationIcon = ({ size = 24, color, style }: IconProps) => (
  <NotificationIconSvg width={size} height={size} color={color} style={style} />
);

export const MenuIcon = ({ size = 24, color, style }: IconProps) => (
  <MenuIconSvg width={size} height={size} color={color} style={style} />
);

export const LoginImg = ({ size = 24, style }: IconProps) => (
  <LoginImgSvg width={size} height={size} style={style} />
);


export const FundraisingIcon = ({ size = 24, color, style }: IconProps) => (
  <FundraisingIconSvg width={size} height={size} color={color} style={style} />
);

export const JoinCauseIcon = ({ size = 24, color, style }: IconProps) => (
  <JoinCauseIconSvg width={size} height={size} color={color} style={style} />
);

export const PartnershipsIcon = ({ size = 24, color, style }: IconProps) => (
  <PartnershipsIconSvg width={size} height={size} color={color} style={style} />
);

export const CloseIcon = ({ size = 24, color, style }: IconProps) => (
  <CloseIconSvg width={size} height={size} color={color} style={style} />
);

export const TopArrowIcon = ({ size = 24, color, style }: IconProps) => (
  <TopArrowIconSvg width={size} height={size} color={color} style={style} />
);

export const BottomArrowIcon = ({ size = 24, color, style }: IconProps) => (
  <BottomArrowIconSvg width={size} height={size} color={color} style={style} />
);

export const CardRightArrowIcon = ({ size = 24, color, style }: IconProps) => (
  <CardRightArrowIconSvg width={size} height={size} color={color} style={style} />
);

export const WhiteMyCardsIcon = ({ size = 24, color, style }: IconProps) => (
  <WhiteMyCardsIconSvg width={size} height={size} color={color} style={style} />
);

export const WhiteLoginIcon = ({ size = 24, color, style }: IconProps) => (
  <WhiteLoginIconSvg width={size} height={size} color={color} style={style} />
);

export const WhiteUserIcon = ({ size = 24, color, style }: IconProps) => (
  <WhiteUserIconSvg width={size} height={size} color={color} style={style} />
);

export const WhiteCloseIcon = ({ size = 24, color, style }: IconProps) => (
  <WhiteCloseIconSvg width={size} height={size} color={color} style={style} />
);

export const EmailIcon = ({ size = 24, color, style }: IconProps) => (
  <EmailIconSvg width={size} height={size} color={color} style={style} />
);

export const PasswordIcon = ({ size = 24, color, style }: IconProps) => (
  <PasswordIconSvg width={size} height={size} color={color} style={style} />
);

export const YellowRibbonIcon = ({ size = 24, color, style }: IconProps) => (
  <YellowRibbonIconSvg width={size} height={size} color={color} style={style} />
);

export const ArrowLeftIconYellow = ({ size = 24, color, style }: IconProps) => (
  <ArrowLeftIconYellowSvg width={size} height={size} color={color} style={style} />
);

export const BackArrowIcon = ({ size = 24, style }: IconProps) => (
  <BackArrowIconSvg width={size} height={size} style={style} />
);

export const HomeHeaderIcon = ({ size = 24, style }: IconProps) => (
  <HomeHeaderIconSvg width={size} height={size} style={style} />
);

export const RefreshIcon = ({ size = 24, color, style }: IconProps) => (
  <RefreshIconSvg width={size} height={size} color={color} style={style} />
);

export const SuccessIcon = ({ size = 24, color, style }: IconProps) => (
  <SuccessIconSvg width={size} height={size} color={color} style={style} />
);

export const DownloadIcon = ({ size = 24, color, style }: IconProps) => (
  <DownloadIconSvg width={size} height={size} color={color} style={style} />
);
