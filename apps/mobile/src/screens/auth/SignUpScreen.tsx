import { FC, useState } from 'react';
import { View, Text, styled, YStack, XStack } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation';
import { Button, Input } from '@voice-agent-caller/ui';
import { useAuth } from '../../providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Mail, Lock, User } from '@tamagui/lucide-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export const SignUpScreen: FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSignUp = async () => {
    if (!email || !password) {
      setError(t('errors.requiredField'));
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      await signUp(email, password, fullName);
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
          <YStack space="$2" mb="$4">
            <Text fontSize="$8" fontWeight="bold" textAlign="center">
              {t('common.appName')}
            </Text>
            <Text fontSize="$4" color="$colorHover" textAlign="center">
              {t('auth.signUp')}
            </Text>
          </YStack>
          
          <Input
            label={t('auth.fullName')}
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
            leftIcon={<User size={20} color="$colorHover" />}
          />
          
          <Input
            label={t('auth.email')}
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color="$colorHover" />}
          />
          
          <Input
            label={t('auth.password')}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color="$colorHover" />}
            helper={t('auth.passwordRequirements')}
          />
          
          {error && (
            <Text color="$danger" fontSize="$2">
              {error}
            </Text>
          )}
          
          <Button
            variant="primary"
            size="lg"
            onPress={handleSignUp}
            loading={isLoading}
            mt="$2"
          >
            {t('auth.signUp')}
          </Button>
          
          <XStack alignItems="center" justifyContent="center" mt="$4">
            <Text color="$colorHover">{t('auth.alreadyHaveAccount')} </Text>
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
