import { FC, useCallback, useState } from 'react';
import { View, Text, styled, YStack, XStack, ScrollView } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Button, SubscriptionCard } from '@voice-agent-caller/ui';
import { useSubscriptionPlans, useUserSubscription, useCreateCheckoutSession } from '@voice-agent-caller/api';
import { useAuth } from '../../providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ArrowLeft } from '@tamagui/lucide-icons';
import { Alert, RefreshControl, Linking } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'SubscriptionPlans'>;

export const SubscriptionPlansScreen: FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  // Fetch subscription plans
  const { 
    data: plans = [], 
    isLoading: isPlansLoading,
    refetch: refetchPlans
  } = useSubscriptionPlans();
  
  // Fetch user subscription
  const { 
    data: subscription, 
    isLoading: isSubscriptionLoading,
    refetch: refetchSubscription
  } = useUserSubscription(user?.id);
  
  // Create checkout session mutation
  const createCheckoutMutation = useCreateCheckoutSession();
  
  const onRefresh = useCallback(() => {
    refetchPlans();
    refetchSubscription();
  }, [refetchPlans, refetchSubscription]);
  
  // Handle plan selection
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };
  
  // Handle subscription purchase
  const handleSubscribe = async () => {
    if (!user?.id || !selectedPlanId) {
      Alert.alert(t('errors.selectPlan'));
      return;
    }
    
    try {
      // Create a checkout session
      const checkoutUrl = await createCheckoutMutation.mutateAsync({
        userId: user.id,
        priceId: selectedPlanId
      });
      
      // Open the checkout URL
      if (await Linking.canOpenURL(checkoutUrl)) {
        await Linking.openURL(checkoutUrl);
      } else {
        Alert.alert(t('errors.cannotOpenUrl'));
      }
    } catch (error) {
      Alert.alert(t('errors.checkoutError'), (error as Error).message);
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Container>
        <Header>
          <Button
            variant="ghost"
            icon={<ArrowLeft size={24} />}
            onPress={() => navigation.goBack()}
          />
          <Text fontSize="$6" fontWeight="bold">
            {t('subscription.plans')}
          </Text>
          <View width={40} />
        </Header>
        
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isPlansLoading || isSubscriptionLoading}
              onRefresh={onRefresh}
            />
          }
        >
          <YStack space="$4" paddingBottom="$8">
            {/* Current Subscription */}
            {subscription && (
              <YStack space="$2" marginBottom="$2">
                <Text fontSize="$5" fontWeight="500">
                  {t('subscription.currentPlan')}
                </Text>
                
                <Text color="$colorHover">
                  {t('subscription.renewalInfo', {
                    date: new Date(subscription.current_period_end).toLocaleDateString()
                  })}
                </Text>
              </YStack>
            )}
            
            {/* Plans List */}
            {isPlansLoading ? (
              <Text textAlign="center" padding="$4">{t('common.loading')}</Text>
            ) : plans.length > 0 ? (
              <YStack space="$4">
                {plans.map((plan) => (
                  <SubscriptionCard
                    key={plan.id}
                    plan={plan}
                    isCurrentPlan={subscription?.plan_id === plan.id}
                    onSelect={() => handleSelectPlan(plan.id)}
                  />
                ))}
              </YStack>
            ) : (
              <Text>{t('subscription.noPlans')}</Text>
            )}
            
            {/* Subscribe Button */}
            {selectedPlanId && (
              <Button
                variant="primary"
                size="lg"
                onPress={handleSubscribe}
                loading={createCheckoutMutation.isPending}
                disabled={createCheckoutMutation.isPending}
                marginTop="$4"
              >
                {t('subscription.subscribe')}
              </Button>
            )}
            
            {/* Terms and Privacy */}
            <YStack marginTop="$6" space="$2">
              <Text fontSize="$2" color="$colorHover" textAlign="center">
                {t('subscription.termsInfo')}
              </Text>
              <XStack justifyContent="center" space="$2">
                <Button variant="link" size="sm">
                  {t('subscription.terms')}
                </Button>
                <Text color="$colorHover">•</Text>
                <Button variant="link" size="sm">
                  {t('subscription.privacy')}
                </Button>
              </XStack>
            </YStack>
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
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: '$2',
  marginBottom: '$2',
});
