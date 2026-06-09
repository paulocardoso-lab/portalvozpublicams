import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function EuPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const role = (session.user as { role?: string }).role;
  if (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'EDITOR' || role === 'REPORTER') {
    redirect('/admin');
  }

  // Leitor autenticado sem papel admin — redireciona para home por enquanto
  redirect('/');
}
