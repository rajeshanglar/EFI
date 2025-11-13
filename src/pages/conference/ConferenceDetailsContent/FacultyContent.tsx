import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import globalStyles, { colors, spacing, Fonts, borderRadius } from '../../../styles/globalStyles';
import { ArrowRightIcon, DoctorIcon } from '../../../components/icons';
import { ConferenceMemberData } from '../../../components/CommitteeFacultyModal';

interface FacultyContentProps {
  onMemberPress?: (member: ConferenceMemberData) => void;
  activeFacultyTab?: 'international' | 'national';
  onFacultyTabChange?: (tab: 'international' | 'national') => void;
}

type FacultyTabKey = 'international' | 'national';

const getCountryFlag = (countryCode: string): string => {
  const flags: Record<string, string> = {
    GB: '🇬🇧',
    IN: '🇮🇳',
    DE: '🇩🇪',
    US: '🇺🇸',
  };
  return flags[countryCode] || '🏳️';
};

const internationalFaculty: ConferenceMemberData[] = [
  {
    name: 'Mohamed Mabrouk',
    country: 'England',
    countryCode: 'GB',
    image: null,
    role: 'Faculty Member',
    bio: 'Professor Mohamed Mabrouk is a leading consultant gynaecologist who has gained many achievements throughout his career. He is highly committed to providing the utmost quality of patient care and takes a holistic approach to help women suffering from gynaecological and reproductive disorders. Professor Mabrouk offers patients consultations at the Cleveland Clinic London Endometriosis Unit as well as at Cambridge Endocare, where he is also the owner and director.He performs high-level endoscopic surgery for endometriosis and benign gynaecological diseases, so much so that he is internationally recognised for his leading expertise in endometriosis. This has led him to teaching complex endometriosis surgery in the UK, Europe and internationally - he is frequently invited to present at national and international congresses. Whats more, he has performed hundreds of endoscopic surgeries and won two international awards in the field of endometriosis and female health in the USA.',
  },
  {
    name: 'Harald Krentel',
    country: 'Germany',
    countryCode: 'DE',
    image: null,
    // image: require('../../../assets/images/efiboard/viveksalunke.png'),
    role: 'International Faculty',
    bio: 'Dr. Harald Krentel is a renowned German gynecologist, oncologic surgeon, and expert in minimally invasive and robotic gynecological surgery. He is the Director of the Department of Gynecology, Obstetrics, and Gynecological Oncology at Bethesda Hospital, Duisburg, and an Associate Professor at Carl-von-Ossietzky University, Oldenburg. Dr. Krentel specializes in advanced surgical management of deep endometriosis, adenomyosis, fibroids, and gynecological cancers. He has authored over 100 scientific publications, serves as a visiting professor in Peru and Mexico, and is a sought-after international speaker and live surgeon. Dr. Krentel is also Past President of the European Endometriosis League (EEL) and Vice-Chair of the Endometriosis SIG at ESGE. In 2022, he was recognized as one of Germany’s top endoscopic gynecological surgeons for his excellence in treating complex endometriosis and fibroid cases.',
  },
  {
    name: 'Szabo Gabor',
    country: 'Hungary',
    countryCode: 'HU',
    image: null,
    role: 'International Faculty',
    bio: 'Gábor Szabó is an advanced gynecologic sonologist and surgeon. He is a senior lecturer and head of the Ultrasound Unit in the Department of Obstetrics and Gynecology at Semmelweis University. He completed his PhD in Medicine in 2013. His special interest is ultrasound in gynecologic diseases especially in endometriosis and oncology. He introduced a new field of gynecologic ultrasonography called pelveoneurosonography - examination of the pelvic nerves. Gábor is leading a research program in the learning curve of the visualization of sacral plexus and contributing to international research studies, IDEA, MUSA and P-IOTA. He is a Core member of the ISUOG AI Special Interest Group, board member of the Hungarian Society of Ultrasound in Obstetrics and Gynecology and the European Endometriosis League.',
  },

  {
    name: 'Wendaline Van Buren',
    country: 'USA',
    countryCode: 'US',
    image: null,
    role: 'International Faculty',
    bio: 'Dr. VanBuren is a board-certified radiologist, Associate Professor and Chair of the Gynecological imaging section at the Mayo Clinic in Rochester, MN, USA, where she established the Endometriosis imaging practice and has assisted in planning over 3,500 complex surgeries. Dr. VanBuren is the founder and Course Director for the International Endometriosis Imaging Congress and is one of the founding Course Directors for the Mayo Clinic Gynecological and Breast Imaging course. On a national level, she co-founded the Disease Focused Panel on Endometriosis for the Society of Abdominal Radiology and was the invited guest editor for the journal Abdominal Radiology Special Edition on Endometriosis in addition to over 60 peer reviewed publications in leading medical journals. Her ongoing work has been highlighted at a variety of national and international radiology, gynecology and pelvic pain conferences. Above all else, Dr. VanBuren is a passionate advocate for endometriosis!',
  },

  {
    name: 'Anuradha',
    country: 'USA',
    countryCode: 'US',
    image: null,
    role: 'International Faculty',
    bio: 'Anuradha ( Anu) Shenoy-Bhangle, MD DNB FSABI is a Staff ( Consultant) Radiologist in the Division of Abdominal Imaging at the Massachusetts General Hospital in Boston, the teaching hospital of the Harvard Medical School and an Assistant Professor at the Harvard Medical School. She is a Fellowship trained Abdominal Radiologist with research interest in Imaging of Endometriosis and Clinical Interest in Liver and Female Pelvic Imaging. As an educator, she has won multiple trainee nominated teaching awards and is actively involved in trainee education with her expertise as prior Fellowship Program Director and Associate Residency Program Director. She serves on committees at multiple National Societies including the Society of Abdominal Radiology; Society of Advanced Body Imaging and the American College of Radiology. With over 50 peer reviewed publications to her credit, she has been invited as a local, national and international speaker on varied topics related to Abdomino-Pelvic Imaging. She is the Education Chair for the Endometriosis Disease Focused Panel at the Society of Abdominal Radiology since 2022 and in this capacity is actively involved in organizing ; moderating and participating in Endometriosis related education and scientific research.',
  },

  {
    name: 'Yamal Patel',
    country: 'Kenya',
    countryCode: 'KE',
    image: null,
    role: 'International Faculty',
    bio: 'Dr. Yamal Patel is a highly accomplished Consultant Obstetrician and Gynaecologist, renowned for his expertise as a Hysteroscopic and Laparoscopic Surgeon and Endometriosis Specialist. He currently serves as the Director at 3rd Park Hospital and is a dedicated Trustee of Laparoscopy Mashinani, an initiative aimed at advancing minimally invasive surgery. Dr. Patel is an active Member of the American Association of Gynaecologic Laparoscopists (AAGL) and an Associate Member of the Royal College of Obstetricians and Gynaecologists. In addition, he contributes to academia as an Honorary Lecturer at Aga Khan University Hospital, Kenya. He has held several esteemed positions, including Immediate Past Chairman of the Kenya Society of Endoscopic Specialities (KESES) and Past Executive Board Member of the International Society of Gynaecological Endoscopists (ISGE). With his vast experience and dedication to women’s health, Dr. Patel continues to be a leading figure in advancing gynaecological care and minimally invasive surgical techniques.',
  },

  {
    name: 'Alison Deslandes',
    country: 'Australia',
    countryCode: 'DE',
    image:null,
    role: 'International Faculty',
    bio: 'Alison is a well-established clinical sonographer, specialising in obstetrics and gynaecology with key interests complex gynaecology and endometriosis diagnosis. In addition to clinical sonography, she is also a PhD candidate at the Robinson Research Institute as part of the IMAGENDO project. Her PhD research focuses on the use of artificial intelligence as a self-learning tool for sonographers learning to perform transvaginal ultrasound. She completed a Master by Research at the University of South Australia in 2022 which also focused on transvaginal ultrasound of the diagnosis of endometriosis. Her combined clinical and research expertise has made her a world-leading expert in the utility of transvaginal ultrasound for the diagnosis of endometriosis. As one of the few sonographers with this level of expertise, she has been invited to numerous international conferences to speak on this topic including the World Congress of Endometriosis, ISUOG World Congress, the Asia Pacific Initiative on Reproduction Congress, and the WFUMB World Congress of Ultrasound. She is passionate about empowering others to gain confidence in scanning for endometriosis to help reduce diagnostic delays associated with this disease.',
  },

  {
    name: 'Joe Njagi',
    country: 'Kenya',
    countryCode: 'KN',
    image: null,
    role: 'International Faculty',
    bio: 'Dr. Joe Njagi is a distinguished Consultant Obstetrician and Gynaecologist, with specialized expertise in Hysteroscopic and Laparoscopic Surgery and the management of Endometriosis. He is committed to advancing women’s health through both clinical practice and academic contributions. Dr. Njagi is an active Member of leading professional bodies in gynaecology and has contributed significantly to the field of minimally invasive surgery. He is also engaged in medical education and mentorship, shaping the next generation of gynaecologists. Through his clinical excellence and dedication to innovation, Dr. Njagi continues to make a profound impact on gynaecological care and endoscopic surgical practices',
  },

  {
    name: 'Alin Constantin',
    country: 'Germany',
    countryCode: 'DE',
    image: null,
    role: 'International Faculty',
    bio: 'Alin Constantin is an accomplished Consultant Obstetrician and Gynaecologist with expertise in minimally invasive gynaecologic surgery, including hysteroscopy and laparoscopy. He is dedicated to advancing women’s health through both clinical practice and academic involvement. Alin is an active member of professional gynaecology and endoscopy associations, contributing to the development and dissemination of best practices in the field. Known for his commitment to excellence and innovation, he continues to play a significant role in improving patient care and mentoring the next generation of gynaecologists.'
  },

  {
    name: 'Attila Bokor',
    country: 'Hungary',
    countryCode: 'HU',
    image: null,
    role: 'International Faculty',
    bio: 'Dr. Attila Bokor (m), head of Minimally Invasive Surgical Unit, Coordinator of the Endometriosis Centre, has relevant experience in non-invasive diagnostic methods for the diagnosis of endometriosis, endometrial small diameter nerve fibres as diagnostic markers for endometriosis, plasma biomarkers for the non-invasive diagnosis of endometriosis. His clinical interest is the surgical treatment of colorectal deep endometriosis. Member of ESHRE GDG of endometriosis and EEL Executive Board. 1019 citations, h-index: 12.'
  },

  {
    name: 'Tina Tellum',
    country: 'Norway',
    countryCode: 'NW',
    image: null,
    role: 'International Faculty',
    bio: 'Associate Prof Tina Tellum is a Senior Consultant at the Department of Gynecology in Oslo University Hospital and an associate professor at the University of Oslo, Norway. She is an expert in pelvic ultrasound with particular emphasis on adenomyosis and endometriosis as well as early pregnancy complications. Her clinical focus is in endometriosis care, including laparoscopic surgery. Ass. Prof Tellum is member of various international expert groups and advisory boards, and she is an academic editor of AOGS and FVVO.'
  },

  {
    name: 'Igor Chiminacio',
    country: 'Brazil',
    countryCode: 'BR',
    image: null,
    role: 'International Faculty',
    bio: 'Gynecologic Surgeon specialized in endometriosis excision, trained in advanced laparoscopy and robotic surgery. Advocate of the embryological origin theory of endometriosis. Promotes and disseminates the techniques of en-bloc excision and wide peritonectomy following Müllerian patterns of the disease. Surgeon at Rede D’Or Star in Brazil. Reviewer and presenter at the AAGL Global Congress in 2022, 2023, 2024, and 2025 (USA).'
  },

  {
    name: 'Sujata Gupta',
    country: 'UK',
    countryCode: 'UK',
    image: null,
    role: 'International Faculty',
    bio: 'Sujata Gupta Consultant Gynaecologist & Robotic Surgeon, Manchester Foundation Trust (UK) Miss Sujata Gupta is a Consultant Gynaecologist at Manchester Foundation Trust, UK, with over 15 years of experience in managing complex benign gynaecological conditions, including advanced endometriosis. She is a leading specialist in minimal access and robotic surgery, having pioneered the introduction of robotic gynaecological surgery at Stepping Hill Hospital in 2018 and more recently at St Mary’s Hospital in 2025. She is the Associate Director for Medical Education – Robotics and Simulation at Manchester Foundation Trust, Honorary Secretary of the British and Irish Association of Robotic Gynaecological Surgeons (BIARGS), and Senior Council Member of the British Society of Gynaecological Endoscopy (BSGE). Academically, Miss Gupta holds an MD and MBBS from Calcutta University, an MSc in Advanced Gynaecological Endoscopy from the University of Surrey, and is a Fellow of the Royal College of Obstetricians and Gynaecologists (FRCOG). She is certified in robotic surgery across multiple platforms including Da Vinci and CMR. A passionate educator and trainer, she regularly teaches on national and international robotic and minimal access surgery courses, cadaveric dissection workshops, and has contributed to the RCOG robotic surgery training framework. She has been invited faculty at major conferences such as the European Endometriosis League and chaired the BSGE Annual Scientific Meeting 2023 in Manchester. Her research interests include endometriosis, menopause, and paediatric gynaecology, with numerous publications and presentations globally.'
  },

  {
    name: 'Denis Tsepov',
    country: 'UK',
    countryCode: 'UK',
    image: null,
    role: 'International Faculty',
    bio: 'Mr. Denis Tsepov, MRCOG, is a high-volume gynaecological robotic surgeon who leads the multidisciplinary robotic team at the London Endometriosis & Advanced Pelvic Surgery Centre, The Princess Grace Hospital, London, UK. He is a member of the Royal College of Obstetricians and Gynaecologists (RCOG), UK, and an internationally recognized expert in the use of the DaVinci Xi robotic system for the treatment of severe deep endometriosis, uterine fibroids, and complex benign gynaecological conditions. Mr. Tsepov also serves as a member of the Intuitive Faculty at prestigious institutions including IRCAD (France), the Karolinska Institute (Sweden), and the Griffin Institute (UK). In recognition of his contributions to robotic gynaecological surgery, he served as the Scientific Chair of the XIII Congress of the British and Irish Robotic Gynaecology Society (BIARGS) held in London, UK, in 2023.'
  },

  
];


const nationalFaculty: ConferenceMemberData[] = [
  {
    name: 'Dr. Vimee Bindra',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/vimeebindra.jpg'),
    role: 'National Faculty',
    bio: 'Dr. Vimee Bindra Founder and President Endometriosis Foundation of India SRC Accredited Master Surgeon Multidisciplinary Endometriosis Care (MSMEC).Robotic and Laparoscopic Endometriosis Excision Surgeon ,Gynaecologist Apollo Health City, Hyderabad. Dr. Vimee Bindra is a distinguished robotic and laparoscopic gynaecologist based in Hyderabad, India, with over 15 years of experience in women’s health. She is widely recognized as one of India’s leading endometriosis surgeons, specializing in minimally invasive gynecological surgeries, particularly advanced excision procedures for endometriosis.She serves as a Consultant at Apollo Health City, Hyderabad, and is the Founder and President of the Endometriosis Foundation of India (EFI). Under her leadership, EFI has pioneered national-level initiatives including public awareness campaigns, international congresses, and specialized cadaveric dissection courses designed to train surgeons in advanced pelvic and neuroanatomy relevant to endometriosis surgery. These programs have been instrumental in bridging knowledge gaps, promoting early diagnosis, and advancing multidisciplinary care for women affected by this complex disease.Her contributions have been recognized with several accolades, including the Telangana Woman Leaders Award (2022) and the Young Clinician Award from Apollo Hospitals (2020). She has also authored multiple scientific publications and contributed chapters to leading gynecology textbooks.Fluent in English, Hindi, Bengali, Punjabi, and Telugu, Dr. Bindra remains committed to advancing women’s healthcare through clinical excellence, surgical innovation, patient advocacy, and medical education.',
  },

  {
    name: 'Dr. Sandesh Kade',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/sandeshkade.jpg'),
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Vivek Salunke',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/viveksalunke.png'),
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Yashodhan Deka',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/yashodan.jpg'),
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Sonu Singh',
    country: 'India',
    countryCode: 'IN',
    image: require('../../../assets/images/efiboard/sonusingh.jpg'),
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Seema Pandey',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Madhavi Nori',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Aniruddha Kulkarni',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: 'Dr. Aniruddha Kulkarni is the Director and Lead Faculty at ScholarMD and Ultrasound Educators, as well as a Professor of Radiology at R. K. Damani Medical College, SRiMS, Aurangabad. With a strong academic and clinical background, his areas of interest include Gynecology and Urology Imaging, Neck Ultrasound, and Pediatric Ultrasound. He has contributed two chapters to the Textbook of Radiology and has 27 indexed publications to his credit. Dr. Kulkarni also serves as a reviewer for esteemed journals such as the British Journal of Radiology (UGT sections) and the Journal of SFM India. A highly sought-after speaker, he has been a national and international faculty member at numerous ultrasound conferences and is well-known for his innovative ultrasound quiz-based teaching methods.',
  },

  {
    name: 'Dr. Hemant Kanojia',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Dr Raju V Giraddi',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: 'Dr. Raju V. Giraddi holds an M.S in Obstetrics and Gynecology and has completed a Fellowship in Fetal Medicine under the guidance of Dr. Adinarayan Sir. He is currently serving as a Junior Consultant in OBGY and Sonology at Bettadur Hospital, Raichur, Karnataka. Alongside his clinical practice, he plays a significant role in professional organizations as the Chairperson of the Imaging Committee, KSOGA, and Secretary of ROGS (2025–26), actively contributing to advancements in women’s health and fetal medicine.',
  },

  {
    name: 'Dr. Sai Daayana',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Kishore Alapati',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Balamba Puranam',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Manjiri Valsangkar',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Sanket Pisat',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Chandana Lakkireddi',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Sunitha Ilinani',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Nutan Jain',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Sandip Datta Roy',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Raktim Mukherjee',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Radhika Rani Akkineni',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Purnima Durga',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Saroja Koppala',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Ajay Aggarwal',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Jyothi Budi',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Aradhya',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Sindhura',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Anitha Kunnaiah',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Vijaya Bhaskar Nori',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: 'Dr. Vijaya Bhaskhar Nori is the Director and Chief Radiologist at Vista Imaging & Medical Centre, Banjara and Jubilee Hills, Hyderabad. A senior radiologist with extensive expertise in diagnostic and interventional radiology, he is recognized for his proficiency in advanced imaging technologies, precise reporting, and patient-centered care. He plays a pivotal role in multidisciplinary teams by delivering accurate and timely radiological evaluations that support the diagnosis and management of complex medical conditions. His areas of interest include body imaging (abdominal, pelvic, and thoracic imaging), cardiac imaging (CT coronary angiography, cardiac MRI, and functional cardiac assessments), gynaecological imaging, pelvic MRI, and fetal MRI. Dr. Nori is a Founder Member of the Indian Society of Abdominal Radiology (ISGAR) and served as the Immediate Past President of the Indian Association of Cardiac Imaging (2022–2025). With over 10 publications and more than 6,000 lectures at national and international conferences, he has made significant contributions to the advancement of radiology in India.',
  },

  {
    name: 'Dr. Aishwarya Nupur',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: '',
  },

  {
    name: 'Dr. Anupama Bahadur',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: 'Dr. Anupama Bahadur is a Professor and Unit Head in the Department of Obstetrics and Gynaecology at the All India Institute of Medical Sciences (AIIMS), Rishikesh. She is a pioneering academic and clinical leader with extensive experience in Minimally Invasive and Robotic Surgery, Reproductive Medicine, and Medical Education. Recognized nationally and internationally for her contributions to women’s health, innovation in gynecologic surgery, and excellence in teaching and clinical research, she has also served as the Head of the Division of Robotic Surgery in 2019 and 2021.Her areas of interest include Minimally Invasive Surgery (Robotic and Laparoscopic), Reproductive Medicine, High-Risk Pregnancy, and Medical Education and Mentorship. She has also led institutional efforts in COVID-19 response and maternal mortality surveillance. Among her many accolades are the Dr. Siuli Rudra Sinha Prize for Best Paper on Gynaecological Endoscopy at the 53rd AICOG, Guwahati (2010), 1st Runner-Up of the CORION Award (2016), and the Teacher’s Day Award (2020) for her distinguished contribution during COVID-19 management. Dr. Bahadur is also the author of the first Indian book on “Robotic Gynecologic Surgery”, along with several academic chapters in gynecologic endoscopy and robotic surgery. She has numerous national and international publications in peer-reviewed journals.',
  },

  {
    name: 'Dr. Shailesh Puntambekar',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: 'Dr. Shailesh Puntambekar is a Professor, Oncosurgeon, and Robotic Surgeon, currently serving as the Medical Director and Lead Cancer Surgeon at Galaxy Care Hospital, Pune. He is a renowned expert in laparoscopic pelvic surgery and gynecological cancer surgery, with a distinguished career marked by innovation, surgical excellence, and global recognition.Dr. Puntambekar developed the pioneering “Pune Technique” for laparoscopic radical hysterectomy in cervical cancer, a breakthrough that has earned international acclaim within the laparoscopic and gynecologic surgery community. He also performed India’s first uterine transplant, marking a historic milestone in the field of reproductive and transplant surgery.Among his numerous achievements, Dr. Puntambekar is one of the first Indian surgeons to receive an award from the American Association of Gynecologic Laparoscopists (AAGL) for his contributions to minimally invasive surgery. He has been an invited speaker at major international forums such as WALS 2025, where he shared his expertise on pelvic anatomy and advanced laparoscopic techniques in gynecologic oncology. Deeply committed to research, innovation, and surgical education, he continues to advance the frontiers of gynecologic oncology and minimally invasive surgery through his ongoing academic and clinical work.',
  },

  {
    name: 'Dr. Aishwarya S. Puntambekar',
    country: 'India',
    countryCode: 'IN',
    image: null,
    role: 'National Faculty',
    bio: 'Dr. Aishwarya S. Puntambekar is a Consultant in Minimal Access and Colorectal Surgery at Galaxy Care Hospital, Pune, and a Visiting Faculty at Cloud 9 Hospital, Pune. She completed her M.B.B.S. and M.S. (General Surgery) with distinction, earning double gold medals.She has undergone extensive specialized training, including a Clinical Fellowship in Colorectal and Peritoneal Surface Oncology at Tata Memorial Hospital, Mumbai, and a Fellowship in Minimal Access and Robotic Surgery at Galaxy Care Laparoscopy Institute, Pune. Dr. Puntambekar has also completed an Observership Program in Minimally Invasive Management of Deep Endometriosis at IRCSS Ospedale Sacro Cuore – Don Calabria, Negrar, Verona, Italy.',
  },

 
];

const { width: screenWidth } = Dimensions.get('window');

export const FacultyContent: React.FC<FacultyContentProps> = ({ 
  onMemberPress,
  activeFacultyTab = 'international',
  onFacultyTabChange,
}) => {
  const cardWidth = (screenWidth - spacing.lg * 3) / 2;

  // Get faculty members based on active tab
  const facultyMembers = useMemo(() => {
    return activeFacultyTab === 'international' ? internationalFaculty : nationalFaculty;
  }, [activeFacultyTab]);

  return (
    <View style={styles.container}>
      {/* Faculty Grid */}
      <View style={styles.contentContainer}>
        <View style={globalStyles.boardGrid}>
          {facultyMembers.map((member, index) => {
            const hasBio = member.bio && member.bio.trim().length > 0;
            const CardComponent = hasBio ? TouchableOpacity : View;
            
            return (
              <CardComponent
                key={index}
                style={[globalStyles.boardCard, { width: cardWidth }]}
                activeOpacity={hasBio ? 0.9 : 1}
                onPress={hasBio ? () => onMemberPress?.(member) : undefined}
              >
                <View style={globalStyles.boardImageContainer}>
                  {member.image ? (
                    <Image
                      source={member.image}
                      style={globalStyles.boardMemberImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={globalStyles.boardMemberPlaceholderImage}>
                      <DoctorIcon size={40} color={colors.primary} />
                    </View>
                  )}
                </View>
                <Text style={globalStyles.boardMemberName}>{member.name}</Text>
                {member.country && (
                  <View style={globalStyles.boardMembercountryContainer}>
                    <Text style={globalStyles.boardMemberflag}>
                      {getCountryFlag(member.countryCode || '')}
                    </Text>
                    <Text style={globalStyles.boardMembercountry}>{member.country}</Text>
                  </View>
                )}
                {hasBio && (
                  <View style={globalStyles.boardArrowContainer}>
                    <ArrowRightIcon size={14} color={colors.white} />
                  </View>
                )}
              </CardComponent>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// Export faculty tabs component and styles for use in parent
export const FacultyTabs: React.FC<{
  activeTab: 'international' | 'national';
  onTabChange: (tab: 'international' | 'national') => void;
}> = ({ activeTab, onTabChange }) => {
  return (
    <View style={facultyTabsStyles.facultyTabsContainer}>
      <TouchableOpacity
        style={[
          facultyTabsStyles.facultyTab,
          activeTab === 'international' && facultyTabsStyles.facultyTabActive,
        ]}
        onPress={() => onTabChange('international')}
        activeOpacity={0.85}
      >
        <Text
          style={[
            facultyTabsStyles.facultyTabText,
            activeTab === 'international' && facultyTabsStyles.facultyTabTextActive,
          ]}
        >
          International Faculty
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          facultyTabsStyles.facultyTab,
          activeTab === 'national' && facultyTabsStyles.facultyTabActive,
        ]}
        onPress={() => onTabChange('national')}
        activeOpacity={0.85}
      >
        <Text
          style={[
            facultyTabsStyles.facultyTabText,
            activeTab === 'national' && facultyTabsStyles.facultyTabTextActive,
          ]}
        >
          National Faculty
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const facultyTabsStyles = StyleSheet.create({
  facultyTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  facultyTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facultyTabActive: {
    backgroundColor: colors.primary,
  },
  facultyTabText: {
    fontSize: screenWidth * 0.035,
    fontFamily: Fonts.Medium,
    color: colors.white,
  },
  facultyTabTextActive: {
    color: colors.white,
    
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xxl,
  },
});