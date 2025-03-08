import { FC } from 'react';
import { Card } from '../card';
import { Text } from '../text';
import { styled, View, XStack, YStack } from 'tamagui';
import { Phone } from '@tamagui/lucide-icons';
import { CallTemplate } from '@voice-agent-caller/shared';

export interface CallTemplateCardProps {
  template: CallTemplate;
  onPress: () => void;
}

export const CallTemplateCard: FC<CallTemplateCardProps> = ({ template, onPress }) => {
  return (
    <Card
      elevated
      onPress={onPress}
      backgroundColor="$background"
    >
      <XStack padding="$4" space="$3" alignItems="center">
        <IconContainer backgroundColor={getCategoryColor(template.category)}>
          {template.icon ? (
            <Text fontSize={20}>{template.icon}</Text>
          ) : (
            <Phone size={20} color="white" />
          )}
        </IconContainer>
        
        <YStack flex={1} space="$1">
          <Text variant="subheading" weight="bold">
            {template.name}
          </Text>
          <Text variant="caption" numberOfLines={2}>
            {template.description}
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
};

const IconContainer = styled(View, {
  name: 'IconContainer',
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$primary',
});

function getCategoryColor(category?: string): string {
  switch (category?.toLowerCase()) {
    case 'medical':
      return '#E53935'; // Red
    case 'customer service':
      return '#039BE5'; // Blue
    case 'reservation':
      return '#43A047'; // Green
    case 'finance':
      return '#FB8C00'; // Orange
    case 'travel':
      return '#8E24AA'; // Purple
    default:
      return '#4070F4'; // Default primary
  }
}
