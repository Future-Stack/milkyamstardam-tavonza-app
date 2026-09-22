export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#090B10]">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c6a4d27eceb0?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#090B10]/50 to-[#090B10]"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37] opacity-10 blur-[100px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00F2FE] opacity-10 blur-[100px] rounded-full z-0 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-0">
        {children}
      </div>
    </div>
  );
}
