import { FC, useCallback } from 'react';
import { View, Text, styled, YStack, XStack, Separator, ScrollView } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Button, StatusBadge, Card } from '@voice-agent-caller/ui';
import { useCallDetails, useCallTranscript, useCancelCall } from '@voice-agent-caller/api';
import { useAuth } from '../../providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  X, 
  Phone, 
  Calendar, 
  Clock, 
  MessageCircle,
  Copy,
  XCircle
} from '@tamagui/lucide-icons';
import { Alert, RefreshControl, Share } from 'react-native';
import { formatDateTime, formatDuration, formatPhoneNumber } from '@voice-agent-caller/shared';

type Props = NativeStackScreenProps<RootStackParamList, 'CallDetails'>;

export const CallDetailsScreen: FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { callId } = route.params;
  
  // Fetch call details
  const { 
    data: call, 
    isLoading,
    refetch
  } = useCallDetails(callId);
  
  // Fetch call transcript
  const { 
    data: transcript,
    isLoading: isTranscriptLoading,
    refetch: refetchTranscript
  } = useCallTranscript(callId);
  
  // Cancel call mutation
  const cancelCallMutation = useCancelCall();
  
  const onRefresh = useCallback(() => {
    refetch();
    refetchTranscript();
  }, [refetch, refetchTranscript]);
  
  // Handle call cancellation
  const handleCancelCall = () => {
    if (!user?.id || !call) return;
    
    Alert.alert(
      t('calls.cancelCall'),
      t('calls.cancelCallConfirmation'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('calls.cancelCall'),
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelCallMutation.mutateAsync({
                callId,
                userId: user.id
              });
              
              refetch();
            } catch (error) {
              Alert.alert(t('errors.failedToCancel'), (error as Error).message);
            }
          }
        }
      ]
    );
  };
  
  // Handle transcript sharing
  const handleShareTranscript = () => {
    if (!transcript) return;
    
    Share.share({
      title: t('calls.transcriptFor', { number: call?.recipient_number }),
      message: transcript
    });
  };
  
  // Handle transcript copy
  const handleCopyTranscript = () => {
    if (!transcript) return;
    
    // TODO: Implement copy to clipboard
    Alert.alert(t('common.copied'));
  };
  
  if (!call && !isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Container>
          <Header>
            <Button
              variant="ghost"
              icon={<X size={24} />}
              onPress={() => navigation.goBack()}
            />
            <Text fontSize="$6" fontWeight="bold">
              {t('calls.callDetails')}
            </Text>
            <View width={40} />
          </Header>
          
          <YStack flex={1} justifyContent="center" alignItems="center" space="$4">
            <Text>{t('errors.callNotFound')}</Text>
            <Button
              variant="outline"
              onPress={() => navigation.goBack()}
            >
              {t('common.back')}
            </Button>
          </YStack>
        </Container>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Container>
        <Header>
          <Button
            variant="ghost"
            icon={<X size={24} />}
            onPress={() => navigation.goBack()}
          />
          <Text fontSize="$6" fontWeight="bold">
            {t('calls.callDetails')}
          </Text>
          <View width={40} />
        </Header>
        
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isLoading || isTranscriptLoading}
              onRefresh={onRefresh}
            />
          }
        >
          {isLoading ? (
            <Text textAlign="center" padding="$4">{t('common.loading')}</Text>
          ) : call && (
            <YStack space="$4" paddingBottom="$10">
              {/* Call Info Card */}
              <Card bordered>
                <YStack padding="$4" space="$3">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$5" fontWeight="bold">
                      {formatPhoneNumber(call.recipient_number)}
                    </Text>
                    <StatusBadge status={call.status} />
                  </XStack>
                  
                  <Separator />
                  
                  <InfoItem 
                    icon={<Calendar size={18} color="$colorHover" />}
                    label={t('calls.calledAt')}
                    value={formatDateTime(call.created_at)}
                  />
                  
                  {call.status === 'completed' && call.duration_seconds && (
                    <InfoItem 
                      icon={<Clock size={18} color="$colorHover" />}
                      label={t('calls.duration')}
                      value={formatDuration(call.duration_seconds)}
                    />
                  )}
                  
                  {call.status === 'scheduled' && call.scheduled_time && (
                    <InfoItem 
                      icon={<Calendar size={18} color="$colorHover" />}
                      label={t('calls.scheduledFor')}
                      value={formatDateTime(call.scheduled_time)}
                    />
                  )}
                </YStack>
              </Card>
              
              {/* Cancel Button (if applicable) */}
              {(call.status === 'queued' || call.status === 'scheduled') && (
                <Button
                  variant="outline"
                  size="lg"
                  icon={<XCircle size={20} color="$danger" />}
                  onPress={handleCancelCall}
                  loading={cancelCallMutation.isPending}
                >
                  <Text color="$danger">{t('calls.cancelCall')}</Text>
                </Button>
              )}
              
              {/* Transcript Section */}
              {call.status === 'completed' && (
                <YStack space="$3">
                  <Text fontSize="$5" fontWeight="500">
                    {t('calls.transcript')}
                  </Text>
                  
                  {isTranscriptLoading ? (
                    <Text>{t('common.loading')}</Text>
                  ) : transcript ? (
                    <>
                      <Card>
                        <ScrollView style={{ maxHeight: 300 }}>
                          <Text padding="$4" lineHeight="$5">
                            {transcript}
                          </Text>
                        </ScrollView>
                      </Card>
                      
                      <XStack space="$2">
                        <Button
                          flex={1}
                          variant="outline"
                          icon={<Copy size={18} />}
                          onPress={handleCopyTranscript}
                        >
                          {t('common.copy')}
                        </Button>
                        <Button
                          flex={1}
                          variant="outline"
                          icon={<MessageCircle size={18} />}
                          onPress={handleShareTranscript}
                        >
                          {t('common.share')}
                        </Button>
                      </XStack>
                    </>
                  ) : (
                    <Text>{t('calls.noTranscript')}</Text>
                  )}
                </YStack>
              )}
              
              {/* Debug Info (for development) */}
              {__DEV__ && (
                <YStack space="$2" marginTop="$4">
                  <Text fontSize="$3" fontWeight="bold">Debug Info:</Text>
                  <Text fontSize="$2" fontFamily="monospace">
                    Call ID: {call.id}
                  </Text>
                  <Text fontSize="$2" fontFamily="monospace">
                    Template ID: {call.template_id}
                  </Text>
                </YStack>
              )}
            </YStack>
          )}
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem: FC<InfoItemProps> = ({ icon, label, value }) => {
  return (
    <XStack space="$2" alignItems="center">
      {icon}
      <Text color="$colorHover">{label}:</Text>
      <Text flex={1}>{value}</Text>
    </XStack>
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
