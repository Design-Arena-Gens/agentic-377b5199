import '@testing-library/jest-dom/extend-expect';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => ({ get: () => null }),
  useParams: () => ({})
}));
