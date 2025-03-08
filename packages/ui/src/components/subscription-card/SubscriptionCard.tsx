import { FC } from 'react';
import { Card } from '../card';
import { Button } from '../button';
import { Text } from '../text';
import { View, XStack, YStack, Separator, styled, H2 } from 'tamagui';
import { SubscriptionPlan } from '@voice-agent-caller/shared';
import { formatPrice } from '@voice-agent-caller/shared';

export interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  onSelect?: () => void;
}

export const SubscriptionCard: FC<SubscriptionCardProps> = ({ 
  plan, 
  isCurrentPlan = false,
  onSelect
}) => {
  return (
    <Card
      elevated
      bordered={false}
      backgroundColor={isCurrentPlan ? '$primaryLight' : undefined}
    >
      {/* Plan header */}
      <YStack padding="$4" space="$2" alignItems="center">
        {plan.is_featured && (
          <Badge>
            <Text color="white" fontSize="$1" fontWeight="bold">
              POPULAR
            </Text>
          </Badge>
        )}
        
        <Text variant="subheading" weight="bold" color={isCurrentPlan ? 'white' : undefined}>
          {plan.name}
        </Text>
        
        <XStack alignItems="flex-end" space="$1">
          <H2 color={isCurrentPlan ? 'white' : '$color'} fontWeight="bold">
            {formatPrice(plan.price)}
          </H2>
          <Text color={isCurrentPlan ? 'white' : '$colorHover'} fontSize="$2">
            /{plan.interval}
          </Text>
        </XStack>
        
        <Text textAlign="center" color={isCurrentPlan ? 'white' : '$colorHover'}>
          {plan.description}
        </Text>
      </YStack>
      
      <Separator borderColor={isCurrentPlan ? 'white' : '$borderColor'} />
      
      {/* Features list */}
      <YStack padding="$4" space="$3">
        <YStack space="$2">
          <Feature highlight>
            <Text color={isCurrentPlan ? 'white' : undefined} fontWeight="bold">
              {plan.call_limit} calls per month
            </Text>
          </Feature>
          
          {plan.features.map((feature, index) => (
            <Feature key={index}>
              <Text color={isCurrentPlan ? 'white' : undefined}>
                {feature}
              </Text>
            </Feature>
          ))}
        </YStack>
        
        <Button
          variant={isCurrentPlan ? 'ghost' : 'primary'}
          onPress={onSelect}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
        </Button>
      </YStack>
    </Card>
  );
};

const Badge = styled(View, {
  name: 'Badge',
  backgroundColor: '$success',
  paddingVertical: '$1',
  paddingHorizontal: '$2',
  borderRadius: '$1',
  marginBottom: '$2',
});

const Feature = styled(XStack, {
  name: 'Feature',
  alignItems: 'center',
  gap: '$2',
  
  variants: {
    highlight: {
      true: {
        marginBottom: '$2',
      },
    },
  },
});
