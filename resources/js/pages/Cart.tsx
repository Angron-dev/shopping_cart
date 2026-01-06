import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type Cart from '@/Models/Cart';
import DynamicTable from '@/components/DynamicTable';
import TransactionApi from '@/API/TransactionApi';
import LogoutButton from '@/components/LogoutButton';
import QuantityInput from '@/components/QuantityInput';
import CartApi from '@/API/CartApi';

export default function CartPage() {
    const { auth } = usePage<SharedData>().props;
    const [user, setUser] = useState(auth.user);
    const [cart, setCart] = useState<Cart[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!auth.user) return;
        CartApi.index()
            .then((data) => setCart(data))
            .catch(() => setErrorMessage('Failed to load cart'));
    }, [auth.user]);

    const handleAmountChangeInCart = async (item: Cart, value: number) => {
        value = Math.max(1, Math.min(value, item.product.stock_quantity));
        try {
            const updatedItem = await CartApi.update(item.product_id, value);
            setCart((prev) =>
                prev.map((p) =>
                    p.id === item.id ? { ...p, amount: updatedItem.amount } : p,
                ),
            );
        } catch {
            setErrorMessage('Failed to update quantity');
        }
    };

    const handleRemoveFromCart = async (item: Cart) => {
        try {
            await CartApi.remove(item.product_id);
            setCart((prev) => prev.filter((p) => p.id !== item.id));
        } catch {
            setErrorMessage('Failed to remove product from cart');
        }
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
                product_id: item.product_id,
                amount: item.amount,
                user_id: auth.user!.id,
            }));

            const response = await TransactionApi.purchase(payload);

            setCart([]);
            setMessage(response.message);
            setUser((prev) =>
                prev ? { ...prev, balance: response.balance } : prev,
            );

        } catch (error: any) {
            const message =
                error?.response?.data?.errors?.balance?.[0] ||
                error?.response?.data?.message ||
                'Something went wrong during purchase';
            setErrorMessage(message);
        }
    };

    return (
        <>
            <Head title="Cart" />
            <div className="container flex flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]  mx-auto">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user && (
                            <>
                                <span className='text-gray-50 px-2 py-2 border-gray-600 border-1 rounded-sm'>
                                    User balance: {user.balance} $
                                </span>
                                <Link
                                    href="/"
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Home Page
                                </Link>
                                <LogoutButton />
                            </>
                        )}
                    </nav>
                </header>

                <main className="flex w-full max-w-[335px] flex-col text-center lg:max-w-4xl">
                    <h1 className="mb-4 text-2xl font-bold text-gray-50">
                        Cart
                    </h1>

                    {message && (
                        <p className="mx-auto mb-5 w-fit rounded-sm border border-green-500 px-5 py-2 text-center text-green-500">
                            {message}
                        </p>
                    )}
                    <DynamicTable
                        data={cart}
                        columns={[
                            {
                                header: 'Name',
                                key: 'name',
                                render: (item) => item.product.name,
                            },
                            {
                                header: 'Product price',
                                key: 'price',
                                render: (item) => `${item.product.price} $`,
                            },
                            {
                                header: 'Amount',
                                key: 'amount',
                                render: (item) => (
                                    <QuantityInput
                                        productId={item.product_id}
                                        stockQuantity={item.product.stock_quantity}
                                        cartAmount={item.amount}
                                        onChangeInCart={(val) =>
                                            handleAmountChangeInCart(item, val)
                                        }
                                    />
                                ),
                            },
                            {
                                header: 'Total',
                                key: 'total',
                                render: (item) =>
                                    `${item.product.price * item.amount} $`,
                            },
                            {
                                header: '',
                                key: 'action',
                                render: (item) => (
                                    <button
                                        className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                                        onClick={() => handleRemoveFromCart(item)}
                                    >
                                        Remove
                                    </button>
                                ),
                            },
                        ]}
                    />

                    <p className="mt-5 text-center text-gray-50">
                        Total price:{' '}
                        {cart.reduce(
                            (total, item) =>
                                total + item.product.price * item.amount,
                            0,
                        )}{' '}
                        $
                    </p>

                    {errorMessage && (
                        <p className="mx-auto mt-5 w-fit rounded-sm border border-red-500 px-5 py-2 text-center text-red-500">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        className="mx-auto mt-5 w-fit rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-700"
                        onClick={handlePurchaseClick}
                    >
                        Purchase
                    </button>
                </main>
            </div>
        </>
    );
}
