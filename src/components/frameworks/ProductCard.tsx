
import Link from 'next/link';
import { FrameworkProduct } from '@/config/products';
import { Check } from 'lucide-react';

interface ProductCardProps {
    product: FrameworkProduct;
}

export function ProductCard({ product }: ProductCardProps) {
    const priceFormatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: product.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(product.price / 100);

    return (
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{product.name}</h3>
            <p className="mt-4 flex-grow text-gray-500 dark:text-gray-400">{product.description}</p>

            <div className="my-8">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{priceFormatted}</span>
            </div>

            <ul className="mb-8 space-y-3">
                {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Check className="mr-3 h-4 w-4 text-indigo-600" />
                        {feature}
                    </li>
                ))}
            </ul>

            <Link
                href={`/frameworks/${product.slug}`}
                className="block w-full rounded-lg bg-white px-6 py-3 text-center text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-200 hover:bg-gray-50 dark:bg-gray-900 dark:ring-indigo-900 dark:hover:bg-gray-800"
            >
                View Details
            </Link>
        </div>
    );
}
