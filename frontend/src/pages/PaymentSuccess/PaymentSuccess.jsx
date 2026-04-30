import { useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const table = searchParams.get('table');
    const amount = searchParams.get('amount');

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Payment Successful!</h2>
            <p>Table {table} — you paid €{parseFloat(amount).toFixed(2)}</p>
            <p>Thank you for dining with us. Your server appreciates you.</p>
        </div>
    );
}