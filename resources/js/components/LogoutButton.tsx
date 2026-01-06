import React from "react";
import { Inertia } from '@inertiajs/inertia';

const LogoutButton = () => {

    const handleLogout = () => {
        Inertia.post('/logout', {}, {
            onSuccess: () => {
                window.location.href = "/";
            },
            onFinish: () => {
                sessionStorage.removeItem('cart');
            },
            onError: (errors) => {
                console.error('Logout failed', errors);
            },
        });
    };

    return (
        <button
            onClick={handleLogout}
            className="inline-block rounded-sm border border-red-500 px-5 py-1.5 text-sm leading-normal bg-red-500  hover:bg-red-700 text-gray-100 hover:border-red-700 hover:text-white"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
