import { SignIn, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { signInWithCustomToken } from "firebase/auth";


export default function SignInPage() {
  const { user } = useUser();

  useEffect(() => {
    async function loginToFirebase() {
      if (!user) return;

      // Clerk session token → Firebase Custom Token
      const token = await user.getToken();
      await signInWithCustomToken(auth, token);
    }

    loginToFirebase();
  }, [user]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn redirectUrl="/dashboard" />
    </div>
  );
}
