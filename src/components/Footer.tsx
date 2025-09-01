'use client';

import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted text-muted-foreground mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-headline text-lg font-bold text-foreground mb-4">SimuWeb</h3>
                        <p className="text-sm">Platform e-commerce dan pemasaran simulasi untuk pembelajaran dan pengembangan.</p>
                    </div>
                    <div>
                        <h3 className="font-headline text-lg font-bold text-foreground mb-4">Jelajahi</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/products" className="hover:text-primary transition-colors">Produk</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">Tentang Kami (Dummy)</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Kontak</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-headline text-lg font-bold text-foreground mb-4">Marketing Tools</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/url-builder" className="hover:text-primary transition-colors">Campaign URL Builder</Link></li>
                            <li><Link href="/campaign-assistant" className="hover:text-primary transition-colors">Campaign Assistant</Link></li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-headline text-lg font-bold text-foreground mb-4">Kontak (Dummy)</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Email: kontak@simuweb.com</li>
                            <li>Telepon: (021) 555-0123</li>
                            <li>Alamat: Jl. Simulasi No. 123, Jakarta</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-border pt-6 text-center text-sm">
                    <p>&copy; {currentYear} SimuWeb. Semua hak dilindungi (dalam simulasi).</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
