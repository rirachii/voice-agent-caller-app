import { FC, useState } from 'react';
import { View, Text, styled, YStack, XStack, Separator } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabsParamList, RootStackParamList } from '../../navigation';
import { Button, Card } from '@voice-agent-caller/ui';
import { useAuth } from '../../providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  CreditCard, 
  Globe, 
  HelpCircle, 
  Info, 
  ChevronRight, 
  LogOut,
  Moon,
  Sun,
} from '@tamagui/lucide-icons';
import { Alert } from 'react-native';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Settings'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const SettingsScreen: FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const handleSignOut = () => {
    Alert.alert(
      t('auth.signOut'),
      t('auth.signOutConfirmation'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('auth.signOut'),
          style: 'destructive',
          onPress: () => {
            signOut().catch(err => {
              console.error('Error signing out:', err);
            });
          }
        }
      ]
    );
  };
  
  const handleSubscription = () => {
    navigation.navigate('SubscriptionPlans');
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement theme switching
  };
  
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLanguage);
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Container>
        {/* Header */}
        <Header>
          <Text fontSize="$7" fontWeight="bold">
            {t('screens.settings.title')}
          </Text>
        </Header>
        
        <YStack space="$4">
          {/* User Card */}
          <Card bordered elevated>
            <XStack padding="$4" space="$3" alignItems="center">
              <ProfileCircle>
                <Text fontSize="$5" color="white" fontWeight="bold">
                  {user?.full_name?.[0] || user?.email?.[0] || 'U'}
                </Text>
              </ProfileCircle>
              
              <YStack flex={1} space="$1">
                <Text fontSize="$4" fontWeight="bold">
                  {user?.full_name || t('common.user')}
                </Text>
                <Text fontSize="$3" color="$colorHover">
                  {user?.email}
                </Text>
              </YStack>
            </XStack>
          </Card>
          
          {/* Settings Sections */}
          <YStack space="$4">
            {/* Account Section */}
            <SettingsSection title={t('screens.settings.account')}>
              <SettingsItem
                icon={<User size={20} color="$colorHover" />}
                label={t('screens.settings.profile')}
                onPress={() => {}}
              />
              <SettingsItem
                icon={<CreditCard size={20} color="$colorHover" />}
                label={t('screens.settings.subscription')}
                onPress={handleSubscription}
              />
            </SettingsSection>
            
            {/* Preferences Section */}
            <SettingsSection title={t('screens.settings.preferences')}>
              <SettingsItem
                icon={<Globe size={20} color="$colorHover" />}
                label={t('screens.settings.language')}
                value={i18n.language === 'en' ? 'English' : 'Español'}
                onPress={toggleLanguage}
              />
              <SettingsItem
                icon={isDarkMode ? <Moon size={20} color="$colorHover" /> : <Sun size={20} color="$colorHover" />}
                label={t('screens.settings.theme')}
                value={isDarkMode ? t('screens.settings.darkMode') : t('screens.settings.lightMode')}
                onPress={toggleDarkMode}
              />
            </SettingsSection>
            
            {/* Support Section */}
            <SettingsSection title={t('screens.settings.support')}>
              <SettingsItem
                icon={<HelpCircle size={20} color="$colorHover" />}
                label={t('screens.settings.help')}
                onPress={() => {}}
              />
              <SettingsItem
                icon={<Info size={20} color="$colorHover" />}
                label={t('screens.settings.about')}
                onPress={() => {}}
              />
            </SettingsSection>
          </YStack>
          
          {/* Sign Out Button */}
          <Button
            variant="outline"
            icon={<LogOut size={20} color="$danger" />}
            onPress={handleSignOut}
            marginTop="$4"
          >
            <Text color="$danger">{t('auth.signOut')}</Text>
          </Button>
        </YStack>
      </Container>
    </SafeAreaView>
  );
};

// Components
interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: FC<SettingsSectionProps> = ({ title, children }) => {
  return (
    <YStack space="$0">
      <Text fontSize="$4" fontWeight="500" color="$colorHover" paddingBottom="$2">
        {title}
      </Text>
      <Card>
        <YStack>{children}</YStack>
      </Card>
    </YStack>
  );
};

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress: () => void;
}

const SettingsItem: FC<SettingsItemProps> = ({ icon, label, value, onPress }) => {
  return (
    <>
      <XStack
        padding="$3"
        justifyContent="space-between"
        alignItems="center"
        onPress={onPress}
        pressStyle={{ opacity: 0.7, backgroundColor: '$backgroundHover' }}
      >
        <XStack space="$3" alignItems="center">
          {icon}
          <Text>{label}</Text>
        </XStack>
        
        <XStack space="$2" alignItems="center">
          {value && (
            <Text color="$colorHover" fontSize="$2">
              {value}
            </Text>
          )}
          <ChevronRight size={18} color="$colorHover" />
        </XStack>
      </XStack>
      <Separator />
    </>
  );
};

// Styled components
const Container = styled(View, {
  flex: 1,
  padding: '$4',
  backgroundColor: '$background',
});

const Header = styled(View, {
  paddingVertical: '$3',
});

const ProfileCircle = styled(View, {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: '$primary',
  justifyContent: 'center',
  alignItems: 'center',
});
