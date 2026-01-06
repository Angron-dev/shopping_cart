
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Product from '@/Models/Product';
import DynamicTable from '@/components/DynamicTable';
import TransactionApi from '@/API/TransactionApi';
import LogoutButton from '@/components/LogoutButton';
import QuantityInput from '@/components/QuantityInput';


export default function Cart() {
    const { auth } = usePage<SharedData>().props;
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [tempAmounts, setTempAmounts] = useState<Record<number, number>>({});
    const [cart, setCart] = useState<(Product & { amount: number })[]>(() => {
        const stored = sessionStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    });

    const handleRemoveFromCart = (product: Product) => {
        const newCart = cart.filter((p) => p.id !== product.id);
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

    const handlePurchaseClick = async () => {
        setErrorMessage(null);
        setMessage(null);
        if (!auth.user) {
            router.get('login');
            return;
        }

        if (cart.length === 0) {
            setErrorMessage('Cart is empty');
            return;
        }

        try {
            const payload = cart.map((item) => ({
                product_id: item.id,
                amount: item.amount,
                user_id: auth.user.id,
            }));

            const response = await TransactionApi.purchase(payload);

            setCart([]);
            sessionStorage.removeItem('cart');

            setMessage(response.message);
        } catch (error) {
            console.error(error);
            setErrorMessage('Something went wrong during purchase');
        }
    };

    return (
        <>
            <Head title="Cart" />
            <div className="container flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]  mx-auto">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user && (
                            <>
                                <Link
                                    href='/'
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Home Page
                                </Link>
                                <LogoutButton />
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex flex-col w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col lg:max-w-4xl text-center">
                        <h1 className="text-2xl font-bold text-gray-50 mb-4">Cart</h1>
                        {message && <p className='text-center mb-5 text-green-500 border border-green-500 rounded-sm px-5 py-2 w-fit mx-auto'>{message}</p>}
                        <DynamicTable
                            data={cart}
                            columns={[
                                {
                                    header: 'Name',
                                    key: 'name',
                                    render: (p) => p.name,
                                },
                                {
                                    header: 'Product price',
                                    key: 'price',
                                    render: (p) => p.price + " $",
                                },
                                {
                                    header: 'Amount',
                                    key: 'amount',
                                    render: (p) => (
                                        <QuantityInput
                                            productId={p.id}
                                            stockQuantity={p.stock_quantity}
                                            cartAmount={cart.find((c) => c.id === p.id)?.amount}
                                            tempAmount={tempAmounts[p.id]}
                                            onChangeInCart={(val) => handleAmountChangeInCart(p, val)}
                                            onChangeTemp={(val) => setTempAmounts((prev) => ({ ...prev, [p.id]: val }))}
                                        />
                                    ),
                                },
                                {
                                    header: 'Total',
                                    key: 'total',
                                    render: (p) => p.price * p.amount + " $",
                                },
                                {
                                    header: '',
                                    key: 'action',
                                    render: (p) => (
                                        <button
                                            className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                                            onClick={() => handleRemoveFromCart(p)}
                                        >
                                            Remove
                                        </button>
                                    ),
                                },
                            ]}
                        />
                        <p className='text-center mt-5 text-gray-50'>Total price: {cart.reduce((total, p) => total + p.price * p.amount, 0)} $</p>
                        {errorMessage && <p className='text-center mt-5 text-red-500 border border-red-500 rounded-sm px-5 py-2 w-fit mx-auto'>{errorMessage}</p>}
                        <button className='mt-5 rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-700 w-fit mx-auto' onClick={handlePurchaseClick}>Purchase</button>
                    </main>
                </div>
            </div>
        </>

    );
}
