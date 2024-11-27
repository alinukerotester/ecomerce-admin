import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg"
          >
            <span>Login with </span>
            <span className="google-logo">
              {"Google".split("").map((letter, index) => (
                <span key={index} className={`letter letter-${index % 4}`}>
                  {letter}
                </span>
              ))}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 min-h-screen">
      <Nav />
      <div>logged in {session.user.email}</div>
    </div>
  );
}
