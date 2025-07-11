export default function Footer() {
  return (
    <footer className="">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative group">
          <section className="relative z-10 p-6 bg-[var(--background-100)]/20 backdrop-blur-[6px] border border-[var(--primary-200)] rounded-xl text-[var(--text-900)] transform hover:scale-105 hover:border-[var(--primary-300)] transition-all duration-300 hover:shadow-2xl">
            
           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className=" text-2xl lg:text-3xl font-bold tracking-tighter">
                sdhhf.
              </h1>

              <div className="flex items-center gap-4">
                <div className="text-sm text-[var(--text-700)] max-w-xs text-center">
                  💡 be innovative.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </footer>
  )
}