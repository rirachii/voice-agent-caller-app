import { FC, useCallback } from 'react';
import { View, Text, styled, YStack, XStack, ScrollView } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabsParamList, RootStackParamList } from '../../navigation';
import { Button, Card, CallTemplateCard } from '@voice-agent-caller/ui';
import { useCallTemplates, useUserSubscription } from '@voice-agent-caller/api';
import { useAuth } from '../../providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { Phone, Plus, ChevronRight } from '@tamagui/lucide-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CallTemplate } from '@voice-agent-caller/shared';
import { formatDate } from '@voice-agent-caller/shared';
import { RefreshControl } from 'react-native';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const HomeScreen: FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Fetch user subscription
  const { 
    data: subscription, 
    isLoading: isSubscriptionLoading,
    refetch: refetchSubscription
  } = useUserSubscription(user?.id);
  
  // Fetch call templates
  const { 
    data: templates = [], 
    isLoading: isTemplatesLoading,
    refetch: refetchTemplates
  } = useCallTemplates();
  
  const onRefresh = useCallback(() => {
    refetchSubscription();
    refetchTemplates();
  }, [refetchSubscription, refetchTemplates]);
  
  const handleNewCall = () => {
    navigation.navigate('NewCall');
  };
  
  const handleTemplatePress = (template: CallTemplate) => {
    navigation.navigate('NewCall', { templateId: template.id });
  };
  
  const handleSubscription = () => {
    navigation.navigate('SubscriptionPlans');
  };
  
  // Filter templates to show popular ones first
  const popularTemplates = templates
    .filter(template => template.category === 'popular')
    .slice(0, 4);
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Container>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isSubscriptionLoading || isTemplatesLoading}
              onRefresh={onRefresh}
            />
          }
        >
          {/* Header */}
          <Header>
            <YStack>
              <Text fontSize="$3" color="$colorHover">
                {t('screens.home.welcome', { name: user?.full_name || t('common.user') })}
              </Text>
              <Text fontSize="$8" fontWeight="bold">
                {t('common.appName')}
              </Text>
            </YStack>
          </Header>
          
          {/* Subscription Status */}
          <Card
            backgroundColor={subscription ? '$primaryLight' : '$warning'}
            bordered={false}
            onPress={handleSubscription}
          >
            <YStack padding="$4" space="$2">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$4" fontWeight="bold" color="white">
                  {subscription 
                    ? t('subscription.currentPlan') 
                    : t('subscription.noActivePlan')}
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ChevronRight size={18} color="white" />}
                  iconPosition="right"
                >
                  <Text color="white">
                    {subscription ? t('subscription.managePlan') : t('subscription.subscribe')}
                  </Text>
                </Button>
              </XStack>
              
              {subscription ? (
                <>
                  <Text color="white">
                    {t('subscription.callsUsed', {
                      used: subscription.calls_used,
                      total: subscription.call_limit
                    })}
                  </Text>
                  <Text color="white" fontSize="$2">
                    {subscription.status === 'active' 
                      ? t('subscription.renews', { date: formatDate(subscription.current_period_end) })
                      : t('subscription.inactive')}
                  </Text>
                </>
              ) : (
                <Text color="white">
                  {t('subscription.subscribePrompt')}
                </Text>
              )}
            </YStack>
          </Card>
          
          {/* Quick Action Button */}
          <Button
            variant="primary"
            size="lg"
            icon={<Phone size={20} color="white" />}
            onPress={handleNewCall}
            marginVertical="$4"
            disabled={!subscription || subscription.status !== 'active'}
          >
            {t('calls.newCall')}
          </Button>
          
          {/* Templates Section */}
          <SectionHeader>
            <Text fontSize="$5" fontWeight="bold">
              {t('templates.popular')}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              icon={<Plus size={18} />}
              onPress={handleNewCall}
            >
              {t('templates.viewAll')}
            </Button>
          </SectionHeader>
          
          <YStack space="$3" marginBottom="$4">
            {isTemplatesLoading ? (
              <Text>{t('common.loading')}</Text>
            ) : popularTemplates.length > 0 ? (
              popularTemplates.map((template) => (
                <CallTemplateCard
                  key={template.id}
                  template={template}
                  onPress={() => handleTemplatePress(template)}
                />
              ))
            ) : (
              <Text>{t('templates.noTemplates')}</Text>
            )}
          </YStack>
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};

const Container = styled(View, {
  flex: 1,
  padding: '$4',
  backgroundColor: '$background',
});

const Header = styled(View, {
  paddingVertical: '$4',
});

const SectionHeader = styled(XStack, {
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$2',
});
