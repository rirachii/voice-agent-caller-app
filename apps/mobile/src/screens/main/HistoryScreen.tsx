import { FC, useCallback } from 'react';
import { View, Text, styled, YStack, ScrollView } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabsParamList, RootStackParamList } from '../../navigation';
import { CallHistoryItem } from '@voice-agent-caller/ui';
import { useCallHistory } from '@voice-agent-caller/api';
import { useAuth } from '../../providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl } from 'react-native';
import { ShepherdCrook } from '@tamagui/lucide-icons';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'History'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const HistoryScreen: FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const { 
    data: callHistory = [], 
    isLoading,
    refetch
  } = useCallHistory(user?.id);
  
  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);
  
  const handleCallPress = (callId: string) => {
    navigation.navigate('CallDetails', { callId });
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Container>
        {/* Header */}
        <Header>
          <Text fontSize="$7" fontWeight="bold">
            {t('screens.history.title')}
          </Text>
        </Header>
        
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={onRefresh}
            />
          }
        >
          {isLoading ? (
            <Text textAlign="center" padding="$4">{t('common.loading')}</Text>
          ) : callHistory.length === 0 ? (
            <EmptyState>
              <ShepherdCrook size={50} color="$colorHover" />
              <Text fontSize="$4" fontWeight="500" marginTop="$3">
                {t('calls.noHistory')}
              </Text>
              <Text color="$colorHover" textAlign="center" marginTop="$2">
                {t('calls.noHistoryDescription')}
              </Text>
            </EmptyState>
          ) : (
            <YStack space="$3" paddingBottom="$8">
              {callHistory.map((call) => (
                <CallHistoryItem
                  key={call.id}
                  call={call}
                  onPress={() => handleCallPress(call.id)}
                />
              ))}
            </YStack>
          )}
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
  paddingVertical: '$3',
});

const EmptyState = styled(YStack, {
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$8',
  marginTop: '$8',
});
