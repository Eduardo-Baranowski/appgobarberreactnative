import React, { useRef, useCallback } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform ,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";

import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";

import * as Yup from "yup";
import api from "../../services/api";

import getValidationErrors from "../../utils/getValidationErrors";

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

import logoImg from '../../assets/logo.png';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name required'),
          email: Yup.string()
            .required('E-mail required')
            .email('Enter a valid email address'),
          password: Yup.string().min(6, 'Must be at least 6 characters'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer login na aplicação!'
        );

        navigation.navigate('SignIn');

      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          console.log(errors);
          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert('Error in submit!','An error occurred while registering!',);
      }
    },
    [navigation],
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
        <Title>Crie sua conta</Title>
      </View>

      <Form
        ref={formRef}
        onSubmit={handleSignUp  }
      >
        <Input
          autoCapitalize="words"
          name="name"
          icon="user"
          placeholder="Nome"
          returnKeyType="next"
          onSubmitEditing={() => {
            emailInputRef.current?.focus();
          }}
        />
        <Input
          ref={emailInputRef}
          keyboardType="email-address"
          autoCorrect={false}
          autoCapitalize="none"
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
          secureTextEntry
          name="password"
          icon="lock"
          placeholder="Senha"
          textContentType="newPassword"
          returnKeyType="send"
          onSubmitEditing={() => formRef.current?.submitForm()}
        />

        <Button onPress={() => formRef.current?.submitForm()}>Entrar</Button>
      </Form>
    </Container>
    </ScrollView>
    </KeyboardAvoidingView>

    <BackToSignIn onPress={() => navigation.navigate('SignIn')}>
      <Icon name="arrow-left" size={20} color="#fff" />
      <BackToSignInText>Voltar para logon</BackToSignInText>
    </BackToSignIn>

    </>
  );
};

export default SignUp;
