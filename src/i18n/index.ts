import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      events: 'Events',
      expenses: 'Expenses',
      thevaram: 'Thevaram',
      chat: 'Chat',
      maintenance: 'Maintenance',
      profile: 'Profile',
      logout: 'Logout',
      temples: 'Temples',
      instruments: 'Instruments',
      userManagement: 'User Management',
      accessControl: 'Access Control',
      
      // Navigation Sections
      mainNavigation: 'Main Navigation',
      templeManagement: 'Temple Management',
      instrumentManagement: 'Instrument Management',
      administration: 'Administration',
      ancientMusic: 'Ancient Music',
      
      // Common
      create: 'Create',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      loading: 'Loading...',
      search: 'Search',
      back: 'Back',
      backToDashboard: 'Back to Dashboard',
      
      // Dashboard
      welcomeBack: 'Welcome back',
      adminWelcomeMessage: 'Manage your temple events and community with powerful analytics',
      organizerWelcomeMessage: 'Organize and coordinate temple events efficiently',
      memberWelcomeMessage: 'Participate in temple events and community activities',
      noTempleAssigned: 'No temple assigned',
      totalEvents: 'Total Events',
      myEvents: 'My Events',
      totalExpenses: 'Total Expenses',
      thevaramCollection: 'Thevaram Collection',
      vsLastMonth: 'vs last month',
      upcomingEvents: 'Upcoming Events',
      noUpcomingEvents: 'No upcoming events',
      viewAllEvents: 'View All Events',
      quickActions: 'Quick Actions',
      createEvent: 'Create Event',
      organizeNewEvent: 'Organize a new temple event',
      readThevaram: 'Read Thevaram',
      browseSacredHymns: 'Browse sacred hymns and pathigams',
      trackExpenses: 'Track Expenses',
      monitorEventCosts: 'Monitor event costs and budgets',
      performanceMetrics: 'Performance Metrics',
      eventSuccessRate: 'Event Success Rate',
      memberEngagement: 'Member Engagement',
      budgetEfficiency: 'Budget Efficiency',
      
      // AI Insights
      aiInsights: 'AI Insights',
      predictiveAnalytics: 'Predictive Analytics',
      nextMonthPrediction: 'Next month prediction',
      engagementScore: 'Engagement Score',
      trendAnalysis: 'Trend Analysis',
      growingInterest: 'Growing interest in',
      classical: 'Classical',
      
      // Temple Performance
      topPerformingTemples: 'Top Performing Temples',
      eventsOrganized: 'events organized',
      expenseBreakdown: 'Expense Breakdown',
      
      // Event Management
      createEvent: 'Create Event',
      editEvent: 'Edit Event',
      eventName: 'Event Name',
      location: 'Location',
      templeName: 'Temple Name',
      dateTime: 'Date & Time',
      membersNeeded: 'Members Needed',
      instruments: 'Instruments',
      foodRequired: 'Food Required?',
      notes: 'Notes',
      
      // Profile
      profileSettings: 'Profile Settings',
      manageAccountSettings: 'Manage your account settings and preferences',
      profileInformation: 'Profile Information',
      security: 'Security',
      settings: 'Settings',
      applicationSettings: 'Application Settings',
      fullName: 'Full Name',
      emailAddress: 'Email Address',
      phoneNumber: 'Phone Number',
      primaryTemple: 'Primary Temple',
      enterFullName: 'Enter your full name',
      enterEmail: 'Enter your email',
      enterPhoneNumber: 'Enter your phone number',
      enterPrimaryTemple: 'Enter your primary temple',
      clickCameraToUpdate: 'Click the camera icon to update your profile picture',
      saveChanges: 'Save Changes',
      profileUpdated: 'Profile updated successfully!',
      profileUpdateFailed: 'Failed to update profile',
      
      // Security
      securitySettings: 'Security Settings',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      enterCurrentPassword: 'Enter your current password',
      enterNewPassword: 'Enter your new password',
      confirmNewPassword: 'Confirm your new password',
      passwordRequirements: 'Password Requirements',
      atLeast6Characters: 'At least 6 characters long',
      includeLettersNumbers: 'Include both letters and numbers',
      useUniquePassword: 'Use a unique password not used elsewhere',
      updatePassword: 'Update Password',
      passwordUpdated: 'Password updated successfully!',
      passwordUpdateFailed: 'Failed to update password',
      
      // Settings
      language: 'Language',
      theme: 'Theme',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      darkModeEnabled: 'Dark mode is enabled',
      lightModeEnabled: 'Light mode is enabled',
      languageChanged: 'Language changed successfully!',
      
      // Top Bar Actions
      uploadCSV: 'Upload CSV',
      downloadCSV: 'Download CSV',
      exportPDF: 'Export PDF',
      print: 'Print',
      
      // Auth
      login: 'Login',
      email: 'Email',
      password: 'Password',
      
      // Confirmations
      deleteEventConfirm: 'Are you sure you want to delete this event?',
      deleteExpenseConfirm: 'Are you sure you want to delete this expense?',
      leaveEventConfirm: 'Are you sure you want to leave this event?'
    }
  },
  ta: {
    translation: {
      // Navigation
      dashboard: 'டாஷ்போர்டு',
      events: 'நிகழ்வுகள்',
      expenses: 'செலவுகள்',
      thevaram: 'தேவாரம்',
      chat: 'அரட்டை',
      maintenance: 'பராமரிப்பு',
      profile: 'சுயவிவரம்',
      logout: 'வெளியேறு',
      temples: 'கோயில்கள்',
      instruments: 'வாத்தியங்கள்',
      userManagement: 'பயனர் மேலாண்மை',
      accessControl: 'அணுகல் கட்டுப்பாடு',
      
      // Navigation Sections
      mainNavigation: 'முக்கிய வழிசெலுத்தல்',
      templeManagement: 'கோயில் மேலாண்மை',
      instrumentManagement: 'வாத்திய மேலாண்மை',
      administration: 'நிர்வாகம்',
      ancientMusic: 'பண்டைய இசை',
      
      // Common
      create: 'உருவாக்கு',
      edit: 'திருத்து',
      delete: 'நீக்கு',
      save: 'சேமி',
      cancel: 'ரத்து',
      confirm: 'உறுதிப்படுத்து',
      yes: 'ஆம்',
      no: 'இல்லை',
      loading: 'ஏற்றுகிறது...',
      search: 'தேடு',
      back: 'பின்',
      backToDashboard: 'டாஷ்போர்டுக்கு திரும்பு',
      
      // Dashboard
      welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
      adminWelcomeMessage: 'சக்திவாய்ந்த பகுப்பாய்வுகளுடன் உங்கள் கோயில் நிகழ்வுகள் மற்றும் சமூகத்தை நிர்வகிக்கவும்',
      organizerWelcomeMessage: 'கோயில் நிகழ்வுகளை திறமையாக ஒழுங்கமைத்து ஒருங்கிணைக்கவும்',
      memberWelcomeMessage: 'கோயில் நிகழ்வுகள் மற்றும் சமூக நடவடிக்கைகளில் பங்கேற்கவும்',
      noTempleAssigned: 'கோயில் ஒதுக்கப்படவில்லை',
      totalEvents: 'மொத்த நிகழ்வுகள்',
      myEvents: 'என் நிகழ்வுகள்',
      totalExpenses: 'மொத்த செலவுகள்',
      thevaramCollection: 'தேவார தொகுப்பு',
      vsLastMonth: 'கடந்த மாதத்துடன் ஒப்பிடுகையில்',
      upcomingEvents: 'வரவிருக்கும் நிகழ்வுகள்',
      noUpcomingEvents: 'வரவிருக்கும் நிகழ்வுகள் இல்லை',
      viewAllEvents: 'அனைத்து நிகழ்வுகளையும் பார்க்கவும்',
      quickActions: 'விரைவு செயல்கள்',
      createEvent: 'நிகழ்வு உருவாக்கு',
      organizeNewEvent: 'புதிய கோயில் நிகழ்வை ஒழுங்கமைக்கவும்',
      readThevaram: 'தேவாரம் படிக்கவும்',
      browseSacredHymns: 'புனித பாடல்கள் மற்றும் பதிகங்களை உலாவவும்',
      trackExpenses: 'செலவுகளை கண்காணிக்கவும்',
      monitorEventCosts: 'நிகழ்வு செலவுகள் மற்றும் பட்ஜெட்களை கண்காணிக்கவும்',
      performanceMetrics: 'செயல்திறன் அளவீடுகள்',
      eventSuccessRate: 'நிகழ்வு வெற்றி விகிதம்',
      memberEngagement: 'உறுப்பினர் ஈடுபாடு',
      budgetEfficiency: 'பட்ஜெட் திறன்',
      
      // AI Insights
      aiInsights: 'AI நுண்ணறிவுகள்',
      predictiveAnalytics: 'முன்கணிப்பு பகுப்பாய்வு',
      nextMonthPrediction: 'அடுத்த மாத முன்கணிப்பு',
      engagementScore: 'ஈடுபாடு மதிப்பெண்',
      trendAnalysis: 'போக்கு பகுப்பாய்வு',
      growingInterest: 'வளர்ந்து வரும் ஆர்வம்',
      classical: 'கிளாசிக்கல்',
      
      // Temple Performance
      topPerformingTemples: 'சிறந்த செயல்திறன் கோயில்கள்',
      eventsOrganized: 'நிகழ்வுகள் ஒழுங்கமைக்கப்பட்டன',
      expenseBreakdown: 'செலவு பிரிவு',
      
      // Event Management
      createEvent: 'நிகழ்வு உருவாக்கு',
      editEvent: 'நிகழ்வு திருத்து',
      eventName: 'நிகழ்வு பெயர்',
      location: 'இடம்',
      templeName: 'கோயில் பெயர்',
      dateTime: 'தேதி மற்றும் நேரம்',
      membersNeeded: 'தேவையான உறுப்பினர்கள்',
      instruments: 'வாத்தியங்கள்',
      foodRequired: 'உணவு தேவையா?',
      notes: 'குறிப்புகள்',
      
      // Profile
      profileSettings: 'சுயவிவர அமைப்புகள்',
      manageAccountSettings: 'உங்கள் கணக்கு அமைப்புகள் மற்றும் விருப்பங்களை நிர்வகிக்கவும்',
      profileInformation: 'சுயவிவர தகவல்',
      security: 'பாதுகாப்பு',
      settings: 'அமைப்புகள்',
      applicationSettings: 'பயன்பாட்டு அமைப்புகள்',
      fullName: 'முழு பெயர்',
      emailAddress: 'மின்னஞ்சல் முகவரி',
      phoneNumber: 'தொலைபேசி எண்',
      primaryTemple: 'முதன்மை கோயில்',
      enterFullName: 'உங்கள் முழு பெயரை உள்ளிடவும்',
      enterEmail: 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
      enterPhoneNumber: 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
      enterPrimaryTemple: 'உங்கள் முதன்மை கோயிலை உள்ளிடவும்',
      clickCameraToUpdate: 'உங்கள் சுயவிவர படத்தை புதுப்பிக்க கேமரா ஐகானை கிளிக் செய்யவும்',
      saveChanges: 'மாற்றங்களை சேமிக்கவும்',
      profileUpdated: 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
      profileUpdateFailed: 'சுயவிவரத்தை புதுப்பிக்க முடியவில்லை',
      
      // Security
      securitySettings: 'பாதுகாப்பு அமைப்புகள்',
      currentPassword: 'தற்போதைய கடவுச்சொல்',
      newPassword: 'புதிய கடவுச்சொல்',
      confirmNewPassword: 'புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்',
      enterCurrentPassword: 'உங்கள் தற்போதைய கடவுச்சொல்லை உள்ளிடவும்',
      enterNewPassword: 'உங்கள் புதிய கடவுச்சொல்லை உள்ளிடவும்',
      confirmNewPassword: 'உங்கள் புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்',
      passwordRequirements: 'கடவுச்சொல் தேவைகள்',
      atLeast6Characters: 'குறைந்தது 6 எழுத்துகள் நீளம்',
      includeLettersNumbers: 'எழுத்துகள் மற்றும் எண்கள் இரண்டையும் சேர்க்கவும்',
      useUniquePassword: 'வேறு எங்கும் பயன்படுத்தாத தனித்துவமான கடவுச்சொல்லைப் பயன்படுத்தவும்',
      updatePassword: 'கடவுச்சொல்லை புதுப்பிக்கவும்',
      passwordUpdated: 'கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
      passwordUpdateFailed: 'கடவுச்சொல்லை புதுப்பிக்க முடியவில்லை',
      
      // Settings
      language: 'மொழி',
      theme: 'தீம்',
      darkMode: 'இருண்ட பயன்முறை',
      lightMode: 'ஒளி பயன்முறை',
      darkModeEnabled: 'இருண்ட பயன்முறை இயக்கப்பட்டுள்ளது',
      lightModeEnabled: 'ஒளி பயன்முறை இயக்கப்பட்டுள்ளது',
      languageChanged: 'மொழி வெற்றிகரமாக மாற்றப்பட்டது!',
      
      // Top Bar Actions
      uploadCSV: 'CSV பதிவேற்றம்',
      downloadCSV: 'CSV பதிவிறக்கம்',
      exportPDF: 'PDF ஏற்றுமதி',
      print: 'அச்சிடு',
      
      // Auth
      login: 'உள்நுழை',
      email: 'மின்னஞ்சல்',
      password: 'கடவுச்சொல்',
      
      // Confirmations
      deleteEventConfirm: 'இந்த நிகழ்வை நீக்க விரும்புகிறீர்களா?',
      deleteExpenseConfirm: 'இந்த செலவை நீக்க விரும்புகிறீர்களா?',
      leaveEventConfirm: 'இந்த நிகழ்வை விட்டு வெளியேற விரும்புகிறீர்களா?'
    }
  },
  hi: {
    translation: {
      // Navigation
      dashboard: 'डैशबोर्ड',
      events: 'कार्यक्रम',
      expenses: 'खर्च',
      thevaram: 'तेवारम',
      chat: 'चैट',
      maintenance: 'रखरखाव',
      profile: 'प्रोफाइल',
      logout: 'लॉगआउट',
      temples: 'मंदिर',
      instruments: 'वाद्य यंत्र',
      userManagement: 'उपयोगकर्ता प्रबंधन',
      accessControl: 'पहुंच नियंत्रण',
      
      // Navigation Sections
      mainNavigation: 'मुख्य नेवीगेशन',
      templeManagement: 'मंदिर प्रबंधन',
      instrumentManagement: 'वाद्य यंत्र प्रबंधन',
      administration: 'प्रशासन',
      ancientMusic: 'प्राचीन संगीत',
      
      // Common
      create: 'बनाएं',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      yes: 'हां',
      no: 'नहीं',
      loading: 'लोड हो रहा है...',
      search: 'खोजें',
      back: 'वापस',
      backToDashboard: 'डैशबोर्ड पर वापस',
      
      // Dashboard
      welcomeBack: 'वापस स्वागत है',
      adminWelcomeMessage: 'शक्तिशाली एनालिटिक्स के साथ अपने मंदिर कार्यक्रमों और समुदाय का प्रबंधन करें',
      organizerWelcomeMessage: 'मंदिर कार्यक्रमों को कुशलता से व्यवस्थित और समन्वयित करें',
      memberWelcomeMessage: 'मंदिर कार्यक्रमों और सामुदायिक गतिविधियों में भाग लें',
      noTempleAssigned: 'कोई मंदिर नियुक्त नहीं',
      totalEvents: 'कुल कार्यक्रम',
      myEvents: 'मेरे कार्यक्रम',
      totalExpenses: 'कुल खर्च',
      thevaramCollection: 'तेवारम संग्रह',
      vsLastMonth: 'पिछले महीने की तुलना में',
      upcomingEvents: 'आगामी कार्यक्रम',
      noUpcomingEvents: 'कोई आगामी कार्यक्रम नहीं',
      viewAllEvents: 'सभी कार्यक्रम देखें',
      quickActions: 'त्वरित कार्य',
      createEvent: 'कार्यक्रम बनाएं',
      organizeNewEvent: 'एक नया मंदिर कार्यक्रम आयोजित करें',
      readThevaram: 'तेवारम पढ़ें',
      browseSacredHymns: 'पवित्र भजन और पतिगम ब्राउज़ करें',
      trackExpenses: 'खर्च ट्रैक करें',
      monitorEventCosts: 'कार्यक्रम लागत और बजट की निगरानी करें',
      performanceMetrics: 'प्रदर्शन मेट्रिक्स',
      eventSuccessRate: 'कार्यक्रम सफलता दर',
      memberEngagement: 'सदस्य सहभागिता',
      budgetEfficiency: 'बजट दक्षता',
      
      // AI Insights
      aiInsights: 'AI अंतर्दृष्टि',
      predictiveAnalytics: 'भविष्यसूचक विश्लेषण',
      nextMonthPrediction: 'अगले महीने की भविष्यवाणी',
      engagementScore: 'सहभागिता स्कोर',
      trendAnalysis: 'ट्रेंड विश्लेषण',
      growingInterest: 'बढ़ती रुचि',
      classical: 'शास्त्रीय',
      
      // Temple Performance
      topPerformingTemples: 'शीर्ष प्रदर्शन करने वाले मंदिर',
      eventsOrganized: 'कार्यक्रम आयोजित',
      expenseBreakdown: 'खर्च विवरण',
      
      // Event Management
      createEvent: 'कार्यक्रम बनाएं',
      editEvent: 'कार्यक्रम संपादित करें',
      eventName: 'कार्यक्रम का नाम',
      location: 'स्थान',
      templeName: 'मंदिर का नाम',
      dateTime: 'दिनांक और समय',
      membersNeeded: 'आवश्यक सदस्य',
      instruments: 'वाद्य यंत्र',
      foodRequired: 'भोजन आवश्यक?',
      notes: 'टिप्पणियां',
      
      // Profile
      profileSettings: 'प्रोफाइल सेटिंग्स',
      manageAccountSettings: 'अपनी खाता सेटिंग्स और प्राथमिकताओं का प्रबंधन करें',
      profileInformation: 'प्रोफाइल जानकारी',
      security: 'सुरक्षा',
      settings: 'सेटिंग्स',
      applicationSettings: 'एप्लिकेशन सेटिंग्स',
      fullName: 'पूरा नाम',
      emailAddress: 'ईमेल पता',
      phoneNumber: 'फोन नंबर',
      primaryTemple: 'प्राथमिक मंदिर',
      enterFullName: 'अपना पूरा नाम दर्ज करें',
      enterEmail: 'अपना ईमेल दर्ज करें',
      enterPhoneNumber: 'अपना फोन नंबर दर्ज करें',
      enterPrimaryTemple: 'अपना प्राथमिक मंदिर दर्ज करें',
      clickCameraToUpdate: 'अपनी प्रोफाइल तस्वीर अपडेट करने के लिए कैमरा आइकन पर क्लिक करें',
      saveChanges: 'परिवर्तन सहेजें',
      profileUpdated: 'प्रोफाइल सफलतापूर्वक अपडेट हो गई!',
      profileUpdateFailed: 'प्रोफाइल अपडेट करने में विफल',
      
      // Security
      securitySettings: 'सुरक्षा सेटिंग्स',
      currentPassword: 'वर्तमान पासवर्ड',
      newPassword: 'नया पासवर्ड',
      confirmNewPassword: 'नए पासवर्ड की पुष्टि करें',
      enterCurrentPassword: 'अपना वर्तमान पासवर्ड दर्ज करें',
      enterNewPassword: 'अपना नया पासवर्ड दर्ज करें',
      confirmNewPassword: 'अपने नए पासवर्ड की पुष्टि करें',
      passwordRequirements: 'पासवर्ड आवश्यकताएं',
      atLeast6Characters: 'कम से कम 6 अक्षर लंबा',
      includeLettersNumbers: 'अक्षर और संख्या दोनों शामिल करें',
      useUniquePassword: 'एक अनूठा पासवर्ड का उपयोग करें जो कहीं और उपयोग नहीं किया गया हो',
      updatePassword: 'पासवर्ड अपडेट करें',
      passwordUpdated: 'पासवर्ड सफलतापूर्वक अपडेट हो गया!',
      passwordUpdateFailed: 'पासवर्ड अपडेट करने में विफल',
      
      // Settings
      language: 'भाषा',
      theme: 'थीम',
      darkMode: 'डार्क मोड',
      lightMode: 'लाइट मोड',
      darkModeEnabled: 'डार्क मोड सक्षम है',
      lightModeEnabled: 'लाइट मोड सक्षम है',
      languageChanged: 'भाषा सफलतापूर्वक बदल गई!',
      
      // Top Bar Actions
      uploadCSV: 'CSV अपलोड',
      downloadCSV: 'CSV डाउनलोड',
      exportPDF: 'PDF निर्यात',
      print: 'प्रिंट',
      
      // Auth
      login: 'लॉगिन',
      email: 'ईमेल',
      password: 'पासवर्ड',
      
      // Confirmations
      deleteEventConfirm: 'क्या आप वाकई इस कार्यक्रम को हटाना चाहते हैं?',
      deleteExpenseConfirm: 'क्या आप वाकई इस खर्च को हटाना चाहते हैं?',
      leaveEventConfirm: 'क्या आप वाकई इस कार्यक्रम को छोड़ना चाहते हैं?'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;