export const formatPrice = (price: any) => {
    // Handle null or undefined immediately to prevent crashes
    if (price === undefined || price === null) return '0.00';

    // Convert string inputs to numbers, otherwise use the price directly
    const value = typeof price === 'string' ? Number(price) : price;

    return value.toLocaleString('en-NG', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
}


export const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '₦';

export const formatPriceWithCurrency = (price: any) => {
    return `${currency}${formatPrice(price)}`;
}