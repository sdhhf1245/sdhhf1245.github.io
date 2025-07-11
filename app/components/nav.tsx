import Link from 'next/link'
// import { NightDay } from './nightday';
const navItems = {
  '/': {
    name: 'home',
  },
  '/blog': {
    name: 'blog',
  },
}

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight bg-[var(--background-100)]/20 backdrop-blur-[6px] border border-[var(--primary-200)] rounded-lg text-[var(--text-900)]">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-center justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => (
              <Link
                key={path}
                href={path}
               className="transition-all hover:text-[var(--accent-800)] hover:scale-105 hover:[animation:ping_1s_cubic-bezier(0,0,0.2,1)_1] flex align-middle relative py-1 px-2 m-1 text-[var(--text-950)]"
              >
                {name}
              </Link>
            ))}
          </div>
           {/* <span className="flex items-center justify-center text-base p-1">
            <NightDay/>
          </span> */}
        </nav>
      </div>
    </aside>
  );
}