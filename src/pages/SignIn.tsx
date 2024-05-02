import H1 from "../components/headers/H1";
import AuthForm from "../components/AuthForm";

export default function SignIn() {
  return (
    <section>
      <H1 title="Sign In" />
      <AuthForm type="singIn" />
    </section>
  );
}
