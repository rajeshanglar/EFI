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

import EmailModalIconSvg from '../../assets/images/email-modal-icon.svg';
import CalendarIconYellowSvg from '../../assets/images/calendar-icon-yellow.svg';
import TimeWIconSvg from '../../assets/images/time-w-icon.svg';
import WorkshopIconSvg from '../../assets/images/workshop-w-icon.svg';
import MapWIconSvg from '../../assets/images/map-w-icon.svg';
import MapIconSvg from '../../assets/images/map-icon.svg';
import KmIconSvg from '../../assets/images/km-icon.svg';

import PrivacySettingsIconSvg from '../../assets/images/privacy-settings-icon.svg';
import MyConferenceIconSvg from '../../assets/images/my-conference-icon.svg';
import DigitalPostersIconSvg from '../../assets/images/digital-posters-icon.svg';
import KeynoteSpeakersIconSvg from '../../assets/images/keynote-speakers-icon.svg';
import DelegateListIconSvg from '../../assets/images/delegate-list-icon.svg';
import MyAbstractsIconSvg from '../../assets/images/my-abstracts-icon.svg';

import LiveIconSvg from '../../assets/images/live-icon.svg';
import NotesIconSvg from '../../assets/images/session-notes.svg';
import HandoutsIconSvg from '../../assets/images/handouts-icon.svg';
import MyQuestionsIconSvg from '../../assets/images/my-questions-icon.svg';
import RecentQuestionsIconSvg from '../../assets/images/recent-questions-icon.svg';

import HighlightsIconSvg from '../../assets/images/highlights-icon.svg';
import ExclusiveIconSvg from '../../assets/images/exclusive-icon.svg';

import DoctorIconSvg from '../../assets/images/doctor-icon.svg';

import ProfileIconSvg from '../../assets/images/profile-icon.svg';
import ProfileEditIconSvg from '../../assets/images/profile-edit-icon.svg';
import MyPaymentsIconSvg from '../../assets/images/my-payments-icon.svg';
import MyTrainingSessionIconSvg from '../../assets/images/my-training-session-icon.svg';
import MyCertificatesIconSvg from '../../assets/images/certificates-icon.svg';
import EditProfileIconSvg from '../../assets/images/edit-profile-icon.svg';
import PhoneIconSvg from '../../assets/images/phone-icon.svg';
import DownloadWhiteIconSvg from '../../assets/images/download-white-icon.svg';
import VenueFloatingIconSvg from '../../assets/images/venue-floting-icon.svg';

import GetDirectionsIconSvg from '../../assets/images/get-directions-icon.svg';
import PhoneWIconSvg from '../../assets/images/phone-w-icon.svg'; 
import WebsiteWIconSvg from '../../assets/images/website-w-icon.svg';

import SurgicalIconSvg from '../../assets/images/surgical-icon.svg';
import AwarenessIconSvg from '../../assets/images/awareness-icon.svg';
import ResearchIconSvg from '../../assets/images/research-icon.svg';
import MissionIconSvg from '../../assets/images/mission-icon.svg';
import VisionIconSvg from '../../assets/images/vision-icon.svg';
import ObjectivesIconSvg from '../../assets/images/objectives-icon.svg';
import RibbonRunBulletIconSvg from '../../assets/images/ribbonrun-icon-bullet.svg';

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

export const EmailModalIcon = ({ size = 24, color, style }: IconProps) => (
  <EmailModalIconSvg width={size} height={size} color={color} style={style} />
);

export const CalendarIconYellow = ({ size = 24, color, style }: IconProps) => (
  <CalendarIconYellowSvg width={size} height={size} color={color} style={style} />
);

export const TimeWIcon = ({ size = 24, color, style }: IconProps) => (
  <TimeWIconSvg width={size} height={size} color={color} style={style} />
);

export const WorkshopIcon = ({ size = 24, color, style }: IconProps) => (
  <WorkshopIconSvg width={size} height={size} color={color} style={style} />
);

export const MapWIcon = ({ size = 24, color, style }: IconProps) => (
  <MapWIconSvg width={size} height={size} color={color} style={style} />
);

export const PrivacySettingsIcon = ({ size = 24, color, style }: IconProps) => (
  <PrivacySettingsIconSvg width={size} height={size} color={color} style={style} />
);

export const MyConferenceIcon = ({ size = 24, color, style }: IconProps) => (
  <MyConferenceIconSvg width={size} height={size} color={color} style={style} />
);

export const DigitalPostersIcon = ({ size = 24, color, style }: IconProps) => (
  <DigitalPostersIconSvg width={size} height={size} color={color} style={style} />
);    

export const KeynoteSpeakersIcon = ({ size = 24, color, style }: IconProps) => (
  <KeynoteSpeakersIconSvg width={size} height={size} color={color} style={style} />
);

export const DelegateListIcon = ({ size = 24, color, style }: IconProps) => (
  <DelegateListIconSvg width={size} height={size} color={color} style={style} />
);

export const MyAbstractsIcon = ({ size = 24, color, style }: IconProps) => (
  <MyAbstractsIconSvg width={size} height={size} color={color} style={style} />
);

export const LiveIcon = ({ size = 24, color, style }: IconProps) => (
  <LiveIconSvg width={size} height={size}  style={style} />
);

export const NotesIcon = ({ size = 24, color, style }: IconProps) => (
  <NotesIconSvg width={size} height={size}  style={style} />
);

export const HandoutsIcon = ({ size = 24, color, style }: IconProps) => (
  <HandoutsIconSvg width={size} height={size}  style={style} />
);

export const MyQuestionsIcon = ({ size = 24, color, style }: IconProps) => (
  <MyQuestionsIconSvg width={size} height={size} style={style} />
);

export const RecentQuestionsIcon = ({ size = 24, color, style }: IconProps) => (
  <RecentQuestionsIconSvg width={size} height={size} style={style} />
);

export const HighlightsIcon = ({ size = 24, color, style }: IconProps) => (
  <HighlightsIconSvg width={size} height={size} style={style} />
);

export const ExclusiveIcon = ({ size = 24, color, style }: IconProps) => (
  <ExclusiveIconSvg width={size} height={size} style={style} />
);

export const DoctorIcon = ({ size = 24, color, style }: IconProps) => (
  <DoctorIconSvg width={size} height={size} style={style} />
);

export const ProfileIcon = ({ size = 24, color, style }: IconProps) => (
  <ProfileIconSvg width={size} height={size} color={color} style={style} />
);

export const ProfileEditIcon = ({ size = 24, color, style }: IconProps) => (
  <ProfileEditIconSvg width={size} height={size} color={color} style={style} />
);

export const MyPaymentsIcon = ({ size = 24, color, style }: IconProps) => (
  <MyPaymentsIconSvg width={size} height={size} color={color} style={style} />
);

export const MyTrainingSessionIcon = ({ size = 24, color, style }: IconProps) => (
  <MyTrainingSessionIconSvg width={size} height={size} color={color} style={style} />
);

export const MyCertificatesIcon = ({ size = 24, color, style }: IconProps) => (
  <MyCertificatesIconSvg width={size} height={size} color={color} style={style} />
);

export const EditProfileIcon = ({ size = 24, color, style }: IconProps) => (
  <EditProfileIconSvg width={size} height={size} color={color} style={style} />
);

export const PhoneIcon = ({ size = 24, color, style }: IconProps) => (
  <PhoneIconSvg width={size} height={size} color={color} style={style} />
);

export const DownloadWhiteIcon = ({ size = 24, color, style }: IconProps) => (
  <DownloadWhiteIconSvg width={size} height={size} color={color} style={style} />
);

export const VenueFloatingIcon = ({ size = 24, color, style }: IconProps) => (
  <VenueFloatingIconSvg width={size} height={size} color={color} style={style} />
);

export const GetDirectionsIcon = ({ size = 24, color, style }: IconProps) => (
  <GetDirectionsIconSvg width={size} height={size} color={color} style={style} />
);

export const PhoneWIcon = ({ size = 24, color, style }: IconProps) => (
  <PhoneWIconSvg width={size} height={size} color={color} style={style} />
);

export const WebsiteWIcon = ({ size = 24, color, style }: IconProps) => (
  <WebsiteWIconSvg width={size} height={size} color={color} style={style} />
);  

export const KmIcon = ({ size = 24, color, style }: IconProps) => (
  <KmIconSvg width={size} height={size} color={color} style={style} />
);

export const MapIcon = ({ size = 24, color, style }: IconProps) => (
  <MapIconSvg width={size} height={size} color={color} style={style} />
);

export const SurgicalIcon = ({ size = 24, color, style }: IconProps) => (
  <SurgicalIconSvg width={size} height={size} color={color} style={style} />
);

export const AwarenessIcon = ({ size = 24, color, style }: IconProps) => (
  <AwarenessIconSvg width={size} height={size} color={color} style={style} />
);

export const ResearchIcon = ({ size = 24, color, style }: IconProps) => (
  <ResearchIconSvg width={size} height={size} color={color} style={style} />
);

export const MissionIcon = ({ size = 24, color, style }: IconProps) => (
  <MissionIconSvg width={size} height={size} color={color} style={style} />
);

export const VisionIcon = ({ size = 24, color, style }: IconProps) => (
  <VisionIconSvg width={size} height={size} color={color} style={style} />
);

export const ObjectivesIcon = ({ size = 24, color, style }: IconProps) => (
  <ObjectivesIconSvg width={size} height={size} color={color} style={style} />
);

export const RibbonRunBulletIcon = ({ size = 24, color, style }: IconProps) => (
  <RibbonRunBulletIconSvg width={size} height={size} color={color} style={style} />
);
