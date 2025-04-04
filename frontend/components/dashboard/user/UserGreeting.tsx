type UserPayload = {
  user_metadata: any;
  sub: string;
  email: string;
  role?: 'user' | 'customer';
  name?: string;
};

interface UserGreetingProps {
  user: UserPayload;
}

export default function UserGreeting({ user }: UserGreetingProps) {
  const username = user.user_metadata?.name || ""

  return (
    <>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
        Olá, {username} 👋
      </h1>
    </>
  );
}
