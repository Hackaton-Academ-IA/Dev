import SignupForm from "@/components/signup/SignupForm";

export default function SignupPage() {
  return (
    <div className="crt-flicker relative min-h-screen overflow-hidden">
      <div className="stars-far" />
      <div className="stars-mid" />
      <div className="stars-near" />
      <div className="stage-glow" />
      <div className="relative z-10">
        <SignupForm />
      </div>
    </div>
  );
}
