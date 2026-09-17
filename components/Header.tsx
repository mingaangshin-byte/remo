'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

const links = [['Home','/'],['About','/about'],['Projects','/projects'],['Contact','/contact']];

export default function Header(){
  const path = usePathname();
  return (
    <header className="site-header">
      <Link href="/" className="logo pixel">REMO</Link>
      <nav>
        {links.map(([label,href]) => <Link key={href} className={path===href?'active':''} href={href}>{label}</Link>)}
      </nav>
    </header>
  );
}
