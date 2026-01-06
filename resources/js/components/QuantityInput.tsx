import React from "react";

interface QuantityInputProps {
    productId: number;
    stockQuantity: number;
    cartAmount?: number;
    tempAmount?: number;
    onChangeInCart?: (amount: number) => void;
    onChangeTemp?: (amount: number) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
    stockQuantity,
    cartAmount,
    tempAmount,
    onChangeInCart,
    onChangeTemp,
}) => {
    const value = cartAmount ?? tempAmount ?? 1;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = Number(e.target.value);
        val = Math.max(1, Math.min(val, stockQuantity));

        if (cartAmount !== undefined && onChangeInCart) {
            onChangeInCart(val);
        } else if (onChangeTemp) {
            onChangeTemp(val);
        }
    };

    return (
        <input
            type="number"
            min={1}
            max={stockQuantity}
            value={value}
            onChange={handleChange}
            className="w-16 rounded border px-2 py-1 text-white"
        />
    );
};

export default QuantityInput;
