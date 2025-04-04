import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import UserGreeting from '@/components/dashboard/user/UserGreeting';
import OrdersStats from '@/components/dashboard/user/OrdersStats';
import OrderBoardUserWrapper from '@/components/dashboard/user/OrderBoardUserWrapper';
import WaitTimeWarningCard from '@/components/dashboard/user/WaitTimeWarningCard';

type UserPayload = {
  sub: string;
  email: string;
  role?: 'user' | 'customer';
  name?: string;
  user_metadata: any;
};

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('access_token')?.value;

  if (!token) {
    return redirect('/login');
  }

  let user: UserPayload;

  try {
    const decoded = jwt.decode(token) as UserPayload;
    if (!decoded?.email || !decoded.sub) {
      throw new Error('Token inválido');
    }
    user = decoded;
  } catch (err) {
    console.error(err);
    return redirect('/login');
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white/90 backdrop-blur shadow-2xl rounded-3xl p-8">
          <UserGreeting user={user} />
          <OrdersStats userId={user.sub} />
          <div className="mt-8 flex justify-end">
            <WaitTimeWarningCard />
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <Link href="/products/list">
              <button
                type="button"
                className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Gerenciar Produtos
              </button>
            </Link>
            <form action="/logout" method="post">
              <button
                type="submit"
                className="text-sm font-medium text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur shadow-2xl rounded-3xl p-6">
          <OrderBoardUserWrapper userId={user.sub} />
        </div>
      </div>
    </main>
  );
}
