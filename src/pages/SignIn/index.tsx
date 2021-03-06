import React, { useCallback, useRef } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import * as Yup from "yup";
import getValidationErrors from '../../utils/getValidationErrors';

import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";

import { useAuth } from "../../hooks/auth";

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

import logoImg from '../../assets/logo.png';

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const {signIn} = useAuth();

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail required')
            .email('Enter a valid email address'),
          password: Yup.string().required('Password is required'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          console.log(errors);
          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert('Erro na autenticação', 'There was an error signing in! check the credentials!',);
      }
    },
    [signIn],
  );

  return (
  <>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS == 'ios' ? 'padding' : undefined}
    enabled
    >

    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{flex:1}}
    >
    <Container>
      <Image source={logoImg} />

      <View>
        <Title>Faça seu logon</Title>
      </View>

      <Form ref={formRef} onSubmit={handleSignIn}>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          name="email"
          icon="mail"
          placeholder="E-mail"
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordInputRef.current?.focus();
          }}
        />

        <Input
          ref={passwordInputRef}
          name="password"
          icon="lock"
          placeholder="Senha"
          secureTextEntry
          returnKeyType="send"
          onSubmitEditing={() => {
            formRef.current?.submitForm();
        }}
        />

        <Button
          onPress={() => {
            formRef.current?.submitForm();
        }}
        >
          Entrar
          </Button>
      </Form>

      <ForgotPassword onPress={() => {}}>
        <ForgotPasswordText>
          Equeci minha senha
        </ForgotPasswordText>
      </ForgotPassword>
    </Container>
    </ScrollView>
    </KeyboardAvoidingView>

    <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
      <Icon name="log-in" size={20} color="#ff9000" />
      <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
    </CreateAccountButton>

    </>
  );
};

export default SignIn;
