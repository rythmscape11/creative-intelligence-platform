
import { FRAMEWORK_PRODUCTS } from '@/config/products';
import { ProductCard } from '@/components/frameworks/ProductCard';

export const metadata = {
    title: 'AureonOne Frameworks | Production-Ready Marketing Systems',
    description: 'Download battle-tested marketing frameworks, templates, and toolkits used by top agencies.',
};

export default function FrameworksPage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden pt-14">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                            Frameworks for High-Performance Marketing
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Stop reinventing the wheel. Download production-ready systems, strategies, and toolkits that we use to drive millions in revenue.
                        </p>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 bg-gray-50 dark:bg-gray-900/50 rounded-3xl mb-24">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Available Frameworks
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Instant digital delivery. Lifetime updates. No subscription required.
                    </p>
                </div>

                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                    {FRAMEWORK_PRODUCTS.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                    ))}
                </div>
            </div>

            {/* Why Frameworks Section */}
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-t border-gray-200 dark:border-gray-800">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Why buy a framework?
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Most agencies sell you "hours". We sell "outcomes". Our frameworks are the exact internal operating systems we use, productized for your team.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {[
                            {
                                name: 'Speed to Value',
                                description: 'Implement in days, not months. Skip the "discovery" phase and start executing.',
                            },
                            {
                                name: 'Proven Reliability',
                                description: 'Battle-tested on real client accounts with significant ad spend.',
                            },
                            {
                                name: 'Agency-Grade Quality',
                                description: 'The same polish and depth you expect from a premium consultancy.',
                            },
                        ].map((feature) => (
                            <div key={feature.name} className="flex flex-col">
                                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                    {feature.name}
                                </dt>
                                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
