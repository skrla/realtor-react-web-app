import AuthForm from '../components/AuthForm';
import H1 from '../components/headers/H1';

export default function SingUp() {


  return (
    <section>
      <H1 title="Sign Up" />
      <AuthForm type="signUp" />
    </section>
  );
}
