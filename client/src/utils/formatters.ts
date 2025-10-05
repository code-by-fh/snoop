import { format } from 'date-fns';

export const formatPrice = (price: number | undefined) => {
    if (typeof price === "number") {
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        }).format(price);
    }
    return "Price on request";
};

export const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
};