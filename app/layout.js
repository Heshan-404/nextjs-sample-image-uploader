import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Dorsa} from 'next/font/google';
import BootstrapClient from './components/BootstrapClient.js';

const dorsa = Dorsa({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-dorsa',
});

export const metadata = {title: 'My Portfolio'};

export default function RootLayout({children}) {
    return (
        <html lang="en" className={dorsa.variable} suppressHydrationWarning={true}>
        <body>
        {children}
        <BootstrapClient/>
        </body>
        </html>
    );
}