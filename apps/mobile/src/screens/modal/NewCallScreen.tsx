import { FC, useEffect, useState } from 'react';
import { View, Text, styled, YStack, ScrollView } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Button, PhoneInput, Input, CallTemplateCard } from '@voice-agent-caller/ui';
import { useCallTemplates, useQueueCall } from '@voice-agent-caller/api';
import { useAuth } from '../../providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Phone } from '@tamagui/lucide-icons';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'NewCall'>;

export const NewCallScreen: FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { templateId } = route.params || {};
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(templateId);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({});
  
  // Fetch call templates
  const { data: templates = [], isLoading: isTemplatesLoading } = useCallTemplates();
  
  // Queue call mutation
  const queueCallMutation = useQueueCall();
  
  // Find selected template
  const selectedTemplate = templates.find(template => template.id === selectedTemplateId);
  
  // Handle template selection
  const handleTemplateSelect = (id: string) => {
    setSelectedTemplateId(id);
  };
  
  // Handle phone number change
  const handlePhoneChange = (number: string, isValid: boolean) => {
    setPhoneNumber(number);
    setIsValidPhone(isValid);
  };
  
  // Handle variable change
  const handleVariableChange = (key: string, value: string) => {
    setCustomVariables(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle call submission
  const handleSubmitCall = async () => {
    if (!user?.id || !selectedTemplateId || !isValidPhone) {
      Alert.alert(t('errors.invalidInput'));
      return;
    }
    
    try {
      await queueCallMutation.mutateAsync({
        userId: user.id,
        callRequest: {
          template_id: selectedTemplateId,
          recipient_number: phoneNumber,
          custom_variables: customVariables
        }
      });
      
      Alert.alert(
        t('calls.callQueued'),
        t('calls.callQueuedDescription'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('errors.failedToQueue'), (error as Error).message);
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Container>
          {/* Header */}
          <Header>
            <Button
              variant="ghost"
              icon={<X size={24} />}
              onPress={() => navigation.goBack()}
            />
            <Text fontSize="$6" fontWeight="bold">
              {t('calls.newCall')}
            </Text>
            <View width={40} />
          </Header>
          
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack space="$4" paddingBottom="$10">
              {!selectedTemplate ? (
                /* Template selection */
                <>
                  <Text fontSize="$5" fontWeight="500">
                    {t('templates.selectTemplate')}
                  </Text>
                  
                  <YStack space="$3">
                    {isTemplatesLoading ? (
                      <Text>{t('common.loading')}</Text>
                    ) : templates.length > 0 ? (
                      templates.map((template) => (
                        <CallTemplateCard
                          key={template.id}
                          template={template}
                          onPress={() => handleTemplateSelect(template.id)}
                        />
                      ))
                    ) : (
                      <Text>{t('templates.noTemplates')}</Text>
                    )}
                  </YStack>
                </>
              ) : (
                /* Call form */
                <>
                  <Text fontSize="$5" fontWeight="500">
                    {selectedTemplate.name}
                  </Text>
                  
                  <Text color="$colorHover">
                    {selectedTemplate.description}
                  </Text>
                  
                  <PhoneInput
                    label={t('calls.recipientNumber')}
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                  />
                  
                  {/* Custom variables */}
                  {selectedTemplate.required_variables && selectedTemplate.required_variables.length > 0 && (
                    <YStack space="$3">
                      <Text fontSize="$4" fontWeight="500">
                        {t('calls.additionalInfo')}
                      </Text>
                      
                      {selectedTemplate.required_variables.map((variable) => (
                        <Input
                          key={variable}
                          label={variable}
                          value={customVariables[variable] || ''}
                          onChangeText={(value) => handleVariableChange(variable, value)}
                        />
                      ))}
                    </YStack>
                  )}
                  
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<Phone size={20} color="white" />}
                    onPress={handleSubmitCall}
                    loading={queueCallMutation.isPending}
                    disabled={!isValidPhone || queueCallMutation.isPending}
                    marginTop="$4"
                  >
                    {t('calls.callNow')}
                  </Button>
                </>
              )}
            </YStack>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
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
