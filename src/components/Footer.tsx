export function Footer() {
  return (
    <footer className="py-8 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-heading text-lg font-bold text-foreground">
            Gen<span className="text-gradient">Speak</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Muhammad Muawaz</span>
            <span>•</span>
            <span>© GenSpeak</span>
            <span>•</span>
            <a
              href="https://calendly.com/muawaz-genspeak/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Book a Call
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}