import { render, screen } from '@testing-library/react';
import ProductCard from '../components/products/ProductCard';
import { CartProvider } from '../context/CartContext';

const product = {
  _id: '1',
  title: 'Test Product',
  description: 'A product for testing',
  price: 99.99,
  images: []
};

describe('ProductCard', () => {
  it('renders product information', () => {
    render(
      <CartProvider>
        <ProductCard product={product} />
      </CartProvider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });
});
