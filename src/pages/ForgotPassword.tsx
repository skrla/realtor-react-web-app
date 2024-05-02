import AuthForm from '../components/AuthForm';
import H1 from '../components/headers/H1';

export default function ForgotPassword() {

  return (
    <section>
      <H1 title="Forgot Password" />
      <AuthForm type="forgotPassword" />
    </section>
  );
}
