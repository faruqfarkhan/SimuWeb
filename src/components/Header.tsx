'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, LayoutGrid, Link2, Bot, LogIn, LogOut, Home, Phone, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Produk', icon: LayoutGrid },
  { href: '/contact', label: 'Kontak', icon: Phone },
];

const toolLinks = [
    { href: '/url-builder', label: 'URL Builder', icon: Link2 },
    { href: '/campaign-assistant', label: 'Campaign Assistant', icon: Bot },
]

const Header = () => {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useUser();

  const getInitials = (email: string) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/></svg>
          <span className="font-headline text-xl font-bold">SimuWeb</span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === link.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(
                'flex items-center gap-1 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 p-0',
                 (pathname === '/url-builder' || pathname === '/campaign-assistant') && 'text-foreground'
                )}>
                    Marketing Tools
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {toolLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href}>
                            <link.icon className="mr-2 h-4 w-4" />
                            {link.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="flex flex-1 md:flex-none items-center justify-end space-x-2">
           <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground p-0 text-xs">
                  {wishlistCount}
                </Badge>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
              <span className="sr-only">Keranjang Belanja</span>
            </Link>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Masuk sebagai</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
