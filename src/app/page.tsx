// allinone-manager-frontend/src/app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authProvider';

export default function Home() {
  const { push } = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;

    try {
      await login(username, password);
      push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <main>
      <h1>Nextjs authentication JWT verify http cookie only</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="border rounded border-black"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="border rounded border-black"
          />
        </div>

        <button
          type="submit"
          className="p-2 bg-orange-600 text-white w-fit rounded"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
