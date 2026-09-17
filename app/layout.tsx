import type {Metadata} from 'next';import './globals.css';import Header from '@/components/Header';
export const metadata:Metadata={title:'REMO — Small Ideas, Big Waves',description:'REMO Team Company'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body><Header/>{children}</body></html>}
