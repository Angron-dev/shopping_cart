import { cart as cartRoute, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Product from '@/Models/Product';
import { useEffect, useState } from 'react';
import ProductApi from '@/API/ProductApi';
import DynamicTable from '@/components/DynamicTable';
import LogoutButton from '@/components/LogoutButton';
import QuantityInput from '@/components/QuantityInput';

export default function HomePage({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<(Product & { amount: number })[]>(() => {
        const stored = sessionStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    });
    const [tempAmounts, setTempAmounts] = useState<Record<number, number>>({});
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        ProductApi.list().then((data) => {
            setProducts(data);
        });
    }, []);


    const handleAddToCartClick = (product: Product) => {
        if (!auth.user) {
            router.get('login');
            return;
        }

        const index = cart.findIndex((p) => p.id === product.id);
        const newCart = [...cart];

        if (index === -1) {
            const qty = tempAmounts[product.id] ?? 1;
            newCart.push({ ...product, amount: qty });
        } else {
            newCart.splice(index, 1);
        }

        setCart(newCart);
        sessionStorage.setItem('cart', JSON.stringify(newCart));
    };

    const handleAmountChangeInCart = (product: Product, value: number) => {
        value = Math.max(1, value);
        const index = cart.findIndex((p) => p.id === product.id);
        if (index === -1) return;

        const newCart = [...cart];
        newCart[index].amount = value;

        setCart(newCart);
        sessionStorage.setItem('cart', JSON.stringify(newCart));
    };

    const columns = [
        {
            header: 'Name',
            key: 'name',
            render: (product: Product) => product.name,
        },
        {
            header: 'Price',
            key: 'price',
            render: (product: Product) => product.price +  " $",
        },
        {
            header: 'Stock',
            key: 'stock',
            render: (product: Product) => product.stock_quantity,
        },
        {
            header: 'Amount',
            key: 'amount',
            render: (product: Product) => (
                <QuantityInput
                    productId={product.id}
                    stockQuantity={product.stock_quantity}
                    cartAmount={cart.find((c) => c.id === product.id)?.amount}
                    tempAmount={tempAmounts[product.id]}
                    onChangeInCart={(val) => handleAmountChangeInCart(product, val)}
                    onChangeTemp={(val) => setTempAmounts((prev) => ({ ...prev, [product.id]: val }))}
                />
            ),
        },
        {
            header: '',
            key: 'action',
            render: (product: Product) => {
                const inCart = cart.some((p) => p.id === product.id);

                return (
                    <button
                        className={`rounded-full px-4 py-2 font-bold text-white ${
                            inCart
                                ? 'bg-red-500 hover:bg-red-700'
                                : 'bg-blue-500 hover:bg-blue-700'
                        }`}
                        onClick={() => handleAddToCartClick(product)}
                    >
                        {inCart ? 'Remove' : 'Add to cart'}
                    </button>
                );
            },
        },
    ];

    return (
        <>
            <Head title="HomePage">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href={cartRoute()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Cart
                                </Link>
                                <LogoutButton />
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <DynamicTable columns={columns} data={products} />
                    </main>
                </div>
            </div>
        </>
    );
}
