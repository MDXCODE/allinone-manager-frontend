import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    console.log('useAuth hook executed');

    const checkAuth = async () => {
      console.log('Checking authentication');

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_ENV}/auth/check`, {
          method: 'GET',
          credentials: 'include', 
        });

        console.log('Response status:', response.status);

        if (response.status === 200) {
          console.log('User authenticated');
        } else {
          console.log('Response not OK (status: ' + response.status + '), redirecting...');
          router.push('/');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        router.push('/');
      }
    };

    checkAuth();

    const intervalId = setInterval(checkAuth, 10000);

    return () => {
      console.log('Cleaning up interval');
      clearInterval(intervalId);
    };
  }, [router]);

  return null; 
};

export default useAuth;
