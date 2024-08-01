"use client";

import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export default function Home() {
  const { push } = useRouter();
  
  const apiUrl = process.env.API_BASE_URL_ENV || 'http://localhost:8080/api/auth/login';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      user_name: event.currentTarget.username.value,
      user_pass: event.currentTarget.password.value,
    };

    try {
      await axios.post(apiUrl, payload, { withCredentials: true }); 
      push("/dashboard"); 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        alert(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        console.error('Unexpected error:', error);
        alert(`Unexpected error: ${error.message}`);
      }
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
