import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { sampleMilestones } from './src/data/milestones';

const { width } = Dimensions.get('window');
const STORAGE_KEY = '@milestone_responses';
const LANGUAGE_KEY = '@language_preference';
const VIDEO_UPLOADS_KEY = '@video_uploads';

// API Configuration
const API_BASE_URL = 'http://localhost:8000';  // Change to your computer's IP for physical device testing
// For physical device: const API_BASE_URL = 'http://192.168.x.x:8000';

// Bilingual translations
const translations = {
  en: {
    appTitle: 'Child Development Tracker',
    subtitle: 'Track your child\'s milestones',
    progress: 'Progress',
    milestonesMet: 'Milestones Met',
    ageGroups: 'Age Groups',
    motor: 'Motor Skills',
    language: 'Language',
    social: 'Social Skills',
    yes: 'Yes',
    no: 'No',
    redFlagWarning: 'Important milestone - consult health worker if not achieved',
    uploadVideo: 'Upload Video for AI Analysis',
    videoUploaded: 'Video Uploaded',
    selectVideo: 'Select Video',
    videoUploadSuccess: 'Video uploaded successfully!',
    videoUploadError: 'Failed to upload video. Please try again.',
    permissionDenied: 'Permission to access media library is required.',
    evaluateSection: 'Evaluate Progress',
    evaluating: 'Evaluating...',
    onTrack: 'On Track!',
    onTrackMessage: 'Great progress! Your child is developing well.',
    referralNeeded: 'Consult Health Worker',
    referralMessage: 'Possible Developmental Delay Detected',
    referralDetails: 'Please consult with a health worker or pediatrician for a comprehensive assessment.',
    needsSupport: 'Needs Support',
    needsSupportMessage: 'Focus on suggested activities to support development.',
    apiError: 'Unable to connect to evaluation service. Please check your internet connection.',
  },
  hi: {
    appTitle: 'बच्चे का विकास ट्रैकर',
    subtitle: 'अपने बच्चे के विकास को ट्रैक करें',
    progress: 'प्रगति',
    milestonesMet: 'पूर्ण किए गए चरण',
    ageGroups: 'आयु समूह',
    motor: 'शारीरिक कौशल',
    language: 'भाषा',
    social: 'सामाजिक कौशल',
    yes: 'हाँ',
    no: 'नहीं',
    redFlagWarning: 'महत्वपूर्ण चरण - यदि प्राप्त नहीं हुआ तो स्वास्थ्य कार्यकर्ता से परामर्श करें',
    uploadVideo: 'AI विश्लेषण के लिए वीडियो अपलोड करें',
    videoUploaded: 'वीडियो अपलोड किया गया',
    selectVideo: 'वीडियो चुनें',
    videoUploadSuccess: 'वीडियो सफलतापूर्वक अपलोड किया गया!',
    videoUploadError: 'वीडियो अपलोड करने में विफल। कृपया पुनः प्रयास करें।',
    permissionDenied: 'मीडिया लाइब्रेरी तक पहुंचने की अनुमति आवश्यक है।',
    evaluateSection: 'प्रगति का मूल्यांकन करें',
    evaluating: 'मूल्यांकन हो रहा है...',
    onTrack: 'सही रास्ते पर!',
    onTrackMessage: 'बढ़िया प्रगति! आपका बच्चा अच्छी तरह से विकसित हो रहा है।',
    referralNeeded: 'स्वास्थ्य कार्यकर्ता से परामर्श करें',
    referralMessage: 'संभावित विकासात्मक देरी का पता चला',
    referralDetails: 'कृपया व्यापक मूल्यांकन के लिए स्वास्थ्य कार्यकर्ता या बाल रोग विशेषज्ञ से परामर्श करें।',
    needsSupport: 'सहायता की आवश्यकता है',
    needsSupportMessage: 'विकास का समर्थन करने के लिए सुझाई गई गतिविधियों पर ध्यान दें।',
    apiError: 'मूल्यांकन सेवा से कनेक्ट करने में असमर्थ। कृपया अपना इंटरनेट कनेक्शन जांचें।',
  }
};

// Milestone descriptions in both languages
const milestoneTranslations = {
  "M_12M_001": {
    en: "Stands alone without support",
    hi: "बिना सहारे के अकेले खड़ा होता है"
  },
  "M_12M_002": {
    en: "Walks holding onto furniture",
    hi: "फर्नीचर पकड़कर चलता है"
  },
  "M_12M_003": {
    en: "Uses pincer grasp to pick up objects",
    hi: "वस्तुओं को उठाने के लिए चिमटी पकड़ का उपयोग करता है"
  },
  "M_12M_004": {
    en: "Puts objects into container",
    hi: "वस्तुओं को कंटेनर में रखता है"
  },
  "L_12M_001": {
    en: "Understands simple commands",
    hi: "सरल आदेशों को समझता है"
  },
  "L_12M_002": {
    en: "Says 'mama' and 'dada' correctly",
    hi: "'मामा' और 'दादा' सही ढंग से कहता है"
  },
  "L_12M_003": {
    en: "Uses gestures like waving bye-bye",
    hi: "बाय-बाय जैसे इशारों का उपयोग करता है"
  },
  "S_12M_001": {
    en: "Shows stranger anxiety",
    hi: "अजनबियों से डर दिखाता है"
  },
  "S_12M_002": {
    en: "Shows preference for people and toys",
    hi: "लोगों और खिलौनों के लिए प्राथमिकता दिखाता है"
  },
  "S_12M_003": {
    en: "Repeats actions to get attention",
    hi: "ध्यान आकर्षित करने के लिए क्रियाओं को दोहराता है"
  }
};

export default function App() {
  const [language, setLanguage] = useState('en');
  const [selectedAge, setSelectedAge] = useState(12);
  const [milestoneResponses, setMilestoneResponses] = useState({});
  const [videoUploads, setVideoUploads] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const t = translations[language];

  // Age groups for tabs
  const ageGroups = [
    { months: 3, label: '3m' },
    { months: 6, label: '6m' },
    { months: 9, label: '9m' },
    { months: 12, label: '12m' },
    { months: 18, label: '18m' },
    { months: 24, label: '24m' },
  ];

  useEffect(() => {
    loadData();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        t.permissionDenied
      );
    }
  };

  const loadData = async () => {
    try {
      const responsesJson = await AsyncStorage.getItem(STORAGE_KEY);
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      const videosJson = await AsyncStorage.getItem(VIDEO_UPLOADS_KEY);

      if (responsesJson) {
        setMilestoneResponses(JSON.parse(responsesJson));
      }
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
      if (videosJson) {
        setVideoUploads(JSON.parse(videosJson));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (responses) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const saveVideoData = async (videos) => {
    try {
      await AsyncStorage.setItem(VIDEO_UPLOADS_KEY, JSON.stringify(videos));
    } catch (error) {
      console.error('Error saving video data:', error);
    }
  };

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'hi' : 'en';
    setLanguage(newLanguage);
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const handleMilestoneResponse = (milestoneId, value) => {
    const newResponses = {
      ...milestoneResponses,
      [milestoneId]: value
    };
    setMilestoneResponses(newResponses);
    saveData(newResponses);
  };

  const handleVideoUpload = async (milestoneId) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const videoUri = result.assets[0].uri;
        const videoData = {
          uri: videoUri,
          uploadedAt: new Date().toISOString(),
          milestoneId: milestoneId,
        };

        const newVideoUploads = {
          ...videoUploads,
          [milestoneId]: videoData
        };

        setVideoUploads(newVideoUploads);
        await saveVideoData(newVideoUploads);

        Alert.alert(
          t.videoUploadSuccess.split('!')[0],
          t.videoUploadSuccess
        );
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert(
        'Error',
        t.videoUploadError
      );
    }
  };

  const evaluateProgress = async () => {
    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      // Get completed milestone IDs for the current age
      const currentMilestones = sampleMilestones.filter(
        m => m.age_range_months.typical === selectedAge
      );

      const completedMilestoneIds = currentMilestones
        .filter(m => milestoneResponses[m.milestone_id] === true)
        .map(m => m.milestone_id);

      // Make API call to backend
      const response = await fetch(`${API_BASE_URL}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          child_age_months: selectedAge,
          completed_milestones: completedMilestoneIds,
          child_name: 'Your Child'
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setEvaluationResult(data);

      // Show appropriate alert based on result
      if (data.result === 'Referral Needed') {
        Alert.alert(
          `🚨 ${t.referralNeeded}`,
          `${t.referralMessage}\n\n${t.referralDetails}\n\n${data.message}`,
          [
            {
              text: 'OK',
              style: 'default',
            }
          ],
          { cancelable: false }
        );
      } else if (data.result === 'On Track') {
        Alert.alert(
          `✅ ${t.onTrack}`,
          `${t.onTrackMessage}\n\n${data.message}`,
          [
            {
              text: 'Great!',
              style: 'default',
            }
          ]
        );
      } else if (data.result === 'Needs Support') {
        Alert.alert(
          `💛 ${t.needsSupport}`,
          `${t.needsSupportMessage}\n\n${data.message}`,
          [
            {
              text: 'OK',
              style: 'default',
            }
          ]
        );
      }

    } catch (error) {
      console.error('Error evaluating progress:', error);
      Alert.alert(
        'Connection Error',
        t.apiError + '\n\nMake sure the backend server is running on port 8000.',
        [
          {
            text: 'OK',
            style: 'cancel',
          }
        ]
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  // Filter milestones by selected age
  const currentMilestones = sampleMilestones.filter(
    m => m.age_range_months.typical === selectedAge
  );

  // Calculate progress
  const totalMilestones = currentMilestones.length;
  const completedMilestones = currentMilestones.filter(
    m => milestoneResponses[m.milestone_id] === true
  ).length;
  const progressPercentage = totalMilestones > 0
    ? (completedMilestones / totalMilestones) * 100
    : 0;

  // Get domain icon
  const getDomainIcon = (domain) => {
    switch (domain) {
      case 'motor': return '🏃';
      case 'language': return '💬';
      case 'social': return '🤝';
      default: return '📋';
    }
  };

  // Get domain color
  const getDomainColor = (domain) => {
    switch (domain) {
      case 'motor': return '#4CAF50';
      case 'language': return '#2196F3';
      case 'social': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.appInfo}>
            <View style={styles.appIcon}>
              <Text style={styles.appIconText}>👶</Text>
            </View>
            <View>
              <Text style={styles.appTitle}>{t.appTitle}</Text>
              <Text style={styles.appSubtitle}>{t.subtitle}</Text>
            </View>
          </View>

          {/* Language Toggle */}
          <View style={styles.languageToggle}>
            <Text style={[styles.languageLabel, language === 'en' && styles.languageLabelActive]}>EN</Text>
            <Switch
              value={language === 'hi'}
              onValueChange={toggleLanguage}
              trackColor={{ false: '#B0BEC5', true: '#4CAF50' }}
              thumbColor={language === 'hi' ? '#2E7D32' : '#fff'}
            />
            <Text style={[styles.languageLabel, language === 'hi' && styles.languageLabelActive]}>हिं</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>{t.progress}</Text>
            <Text style={styles.progressCount}>
              {completedMilestones}/{totalMilestones} {t.milestonesMet}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
        </View>
      </View>

      {/* Age Group Tabs */}
      <View style={styles.ageTabsContainer}>
        <Text style={styles.ageTabsTitle}>{t.ageGroups}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ageTabsScroll}
        >
          {ageGroups.map((age) => (
            <TouchableOpacity
              key={age.months}
              style={[
                styles.ageTab,
                selectedAge === age.months && styles.ageTabActive
              ]}
              onPress={() => setSelectedAge(age.months)}
            >
              <Text style={[
                styles.ageTabText,
                selectedAge === age.months && styles.ageTabTextActive
              ]}>
                {age.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Milestones Cards */}
      <ScrollView style={styles.milestonesContainer}>
        {currentMilestones.map((milestone) => {
          const response = milestoneResponses[milestone.milestone_id];
          const videoUpload = videoUploads[milestone.milestone_id];
          const isRedFlag = milestone.red_flag && response === false;
          const domainColor = getDomainColor(milestone.domain);
          const translation = milestoneTranslations[milestone.milestone_id];

          return (
            <View
              key={milestone.milestone_id}
              style={[
                styles.milestoneCard,
                isRedFlag && styles.milestoneCardRedFlag
              ]}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={[styles.domainIcon, { backgroundColor: domainColor }]}>
                    <Text style={styles.domainIconText}>{getDomainIcon(milestone.domain)}</Text>
                  </View>
                  <View style={styles.cardHeaderInfo}>
                    <Text style={styles.domainLabel}>
                      {t[milestone.domain] || milestone.domain}
                    </Text>
                    <Text style={styles.subdomainLabel}>{milestone.subdomain}</Text>
                  </View>
                </View>
                {response !== undefined && (
                  <View style={[
                    styles.statusBadge,
                    response ? styles.statusBadgeYes : styles.statusBadgeNo
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {response ? '✓' : '✗'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Card Content */}
              <Text style={styles.milestoneDescription}>
                {translation ? translation[language] : milestone.milestone_description}
              </Text>

              {/* Video Upload Status */}
              {videoUpload && (
                <View style={styles.videoUploadedBadge}>
                  <Text style={styles.videoUploadedIcon}>📹</Text>
                  <Text style={styles.videoUploadedText}>{t.videoUploaded} ✓</Text>
                </View>
              )}

              {/* Red Flag Warning */}
              {isRedFlag && (
                <View style={styles.redFlagWarning}>
                  <Text style={styles.redFlagIcon}>⚠️</Text>
                  <Text style={styles.redFlagText}>{t.redFlagWarning}</Text>
                </View>
              )}

              {/* Response Buttons */}
              <View style={styles.responseButtons}>
                <TouchableOpacity
                  style={[
                    styles.responseButton,
                    styles.responseButtonYes,
                    response === true && styles.responseButtonYesActive
                  ]}
                  onPress={() => handleMilestoneResponse(milestone.milestone_id, true)}
                >
                  <Text style={[
                    styles.responseButtonText,
                    response === true && styles.responseButtonTextActive
                  ]}>
                    {t.yes}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.responseButton,
                    styles.responseButtonNo,
                    response === false && styles.responseButtonNoActive
                  ]}
                  onPress={() => handleMilestoneResponse(milestone.milestone_id, false)}
                >
                  <Text style={[
                    styles.responseButtonText,
                    response === false && styles.responseButtonTextActive
                  ]}>
                    {t.no}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Video Upload Button */}
              <TouchableOpacity
                style={[
                  styles.videoUploadButton,
                  videoUpload && styles.videoUploadButtonUploaded
                ]}
                onPress={() => handleVideoUpload(milestone.milestone_id)}
              >
                <Text style={styles.videoUploadButtonIcon}>
                  {videoUpload ? '✓' : '📹'}
                </Text>
                <Text style={styles.videoUploadButtonText}>
                  {videoUpload ? t.videoUploaded : t.uploadVideo}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },

  // Header Styles
  header: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appIconText: {
    fontSize: 32,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  appSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  languageLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    marginHorizontal: 4,
  },
  languageLabelActive: {
    color: '#FFFFFF',
  },

  // Progress Section
  progressSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // Age Tabs
  ageTabsContainer: {
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  ageTabsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 20,
    marginBottom: 12,
  },
  ageTabsScroll: {
    paddingHorizontal: 16,
  },
  ageTab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ageTabActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1E88E5',
  },
  ageTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  ageTabTextActive: {
    color: '#1E88E5',
  },

  // Evaluate Button
  evaluateButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  evaluateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E88E5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  evaluateButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  evaluateButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  evaluateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Milestones Container
  milestonesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Milestone Card
  milestoneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  milestoneCardRedFlag: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  domainIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  domainIconText: {
    fontSize: 24,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  domainLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  subdomainLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeYes: {
    backgroundColor: '#4CAF50',
  },
  statusBadgeNo: {
    backgroundColor: '#F44336',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Card Content
  milestoneDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 16,
  },

  // Red Flag Warning
  redFlagWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  redFlagIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  redFlagText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
    fontWeight: '500',
  },

  // Response Buttons
  responseButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  responseButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  responseButtonYes: {
    backgroundColor: '#F1F8F4',
    borderColor: '#C8E6C9',
  },
  responseButtonYesActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  responseButtonNo: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFCDD2',
  },
  responseButtonNoActive: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  responseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  responseButtonTextActive: {
    color: '#FFFFFF',
  },

  // Video Upload Styles
  videoUploadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  videoUploadedIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  videoUploadedText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '600',
  },
  videoUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
  },
  videoUploadButtonUploaded: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderStyle: 'solid',
  },
  videoUploadButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  videoUploadButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976D2',
  },
});
