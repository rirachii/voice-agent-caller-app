import { FC, useState } from 'react';
import { View, Text, styled, YStack, XStack } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation';
import { Button, Input } from '@voice-agent-caller/ui';
import { useAuth } from '../../providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Mail, ArrowLeft } from '@tamagui/lucide-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const handleResetPassword = async () => {
    if (!email) {
      setError(t('errors.requiredField'));
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t('errors.authError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Container>
        <YStack space="$4" width="100%" maxWidth={400}>
          <Button
            variant="ghost"
            onPress={() => navigation.goBack()}
            icon={<ArrowLeft size={20} />}
            alignSelf="flex-start"
            mb="$2"
          >
            {t('common.back')}
          </Button>
          
          <YStack space="$2" mb="$4">
            <Text fontSize="$8" fontWeight="bold" textAlign="center">
              {t('auth.resetPassword')}
            </Text>
            <Text fontSize="$3" color="$colorHover" textAlign="center">
              {t('auth.resetPasswordInstructions')}
            </Text>
          </YStack>
          
          {success ? (
            <YStack space="$4" alignItems="center">
              <Text color="$success" fontSize="$3" textAlign="center">
                {t('auth.resetPasswordSuccess')}
              </Text>
              
              <Button
                variant="outline"
                onPress={() => navigation.navigate('SignIn')}
                mt="$4"
              >
                {t('auth.backToSignIn')}
              </Button>
            </YStack>
          ) : (
            <>
              <Input
                label={t('auth.email')}
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color="$colorHover" />}
              />
              
              {error && (
                <Text color="$danger" fontSize="$2">
                  {error}
                </Text>
              )}
              
              <Button
                variant="primary"
                size="lg"
                onPress={handleResetPassword}
                loading={isLoading}
                mt="$2"
              >
                {t('auth.resetPassword')}
              </Button>
            </>
          )}
          
          <XStack alignItems="center" justifyContent="center" mt="$4">
            <Text color="$colorHover">{t('auth.rememberPassword')} </Text>
            <Button
              variant="link"
              onPress={() => navigation.navigate('SignIn')}
            >
              {t('auth.signIn')}
            </Button>
          </XStack>
        </YStack>
      </Container>
    </KeyboardAvoidingView>
  );
};

const Container = styled(View, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$4',
  backgroundColor: '$background',
});
