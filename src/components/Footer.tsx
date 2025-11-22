export function Footer() {
    return (
        <footer className="py-8 px-6 bg-[#050505] border-t border-zinc-900">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center text-zinc-600 text-sm">
                <div className="mb-4 md:mb-0">
                    <span className="font-medium text-zinc-500">BaseCapital</span> &copy; {new Date().getFullYear()}
                </div>
                <div className="flex gap-6 items-center">
                    <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-zinc-400 transition-colors">Risk Disclosure</a>
                    <div className="h-4 w-[1px] bg-zinc-800 mx-2 hidden md:block" />
                    <span className="text-xs text-zinc-600">
                        Developed and designed by <a href="https://skylos.solutions" target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-winner)] text-zinc-500 hover:text-zinc-300 transition-colors ml-1 text-sm">skylos</a>
                    </span>
                </div>
            </div>
        </footer>
    );
}
