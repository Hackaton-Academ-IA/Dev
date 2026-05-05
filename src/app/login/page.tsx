import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="crt-flicker relative min-h-screen overflow-hidden">
      <div className="stars-far" />
      <div className="stars-mid" />
      <div className="stars-near" />
      <div className="stage-glow" />
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
