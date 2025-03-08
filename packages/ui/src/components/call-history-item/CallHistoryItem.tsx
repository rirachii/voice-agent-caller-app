import { FC } from 'react';
import { Card } from '../card';
import { Text } from '../text';
import { StatusBadge } from '../status-badge';
import { styled, XStack, YStack, View } from 'tamagui';
import { Calendar, Clock, Phone, MessageCircle } from '@tamagui/lucide-icons';
import { CallHistory } from '@voice-agent-caller/shared';
import { formatDate, formatDateTime, formatDuration, formatPhoneNumber } from '@voice-agent-caller/shared';

export interface CallHistoryItemProps {
  call: CallHistory;
  onPress: () => void;
}

export const CallHistoryItem: FC<CallHistoryItemProps> = ({ call, onPress }) => {
  return (
    <Card
      bordered
      onPress={onPress}
    >
      <XStack padding="$3" space="$3">
        <PhoneIconContainer>
          <Phone size={18} color="white" />
        </PhoneIconContainer>
        
        <YStack flex={1} space="$1">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold">
              {formatPhoneNumber(call.recipient_number)}
            </Text>
            <StatusBadge status={call.status} size="sm" />
          </XStack>
          
          <InfoRow>
            <Calendar size={14} color="$colorHover" />
            <Text variant="caption">
              {formatDate(call.created_at)}
            </Text>
          </InfoRow>
          
          {call.status === 'completed' && call.duration_seconds && (
            <InfoRow>
              <Clock size={14} color="$colorHover" />
              <Text variant="caption">
                {formatDuration(call.duration_seconds)}
              </Text>
            </InfoRow>
          )}
          
          {call.status === 'scheduled' && (
            <InfoRow>
              <Calendar size={14} color="$colorHover" />
              <Text variant="caption">
                Scheduled for {call.scheduled_time ? formatDateTime(call.scheduled_time) : 'Unknown'}
              </Text>
            </InfoRow>
          )}
          
          {call.transcript && (
            <InfoRow>
              <MessageCircle size={14} color="$colorHover" />
              <Text variant="caption">
                Transcript available
              </Text>
            </InfoRow>
          )}
        </YStack>
      </XStack>
    </Card>
  );
};

const PhoneIconContainer = styled(View, {
  name: 'PhoneIconContainer',
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '$primary',
  justifyContent: 'center',
  alignItems: 'center',
});

const InfoRow = styled(XStack, {
  name: 'InfoRow',
  alignItems: 'center',
  gap: '$1',
});
