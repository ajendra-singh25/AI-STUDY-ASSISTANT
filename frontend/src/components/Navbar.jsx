import {Link} from "react-router-dom"; 
function Navbar() {
  return (
    <nav
  className="
  sticky
  top-0
  z-50
  backdrop-blur-xl
  bg-slate-950/40
  border-b
  border-white/10
"
>
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        <h1 className="text-3xl font-bold text-cyan-400">
          AI Study
        </h1>

        <ul className="flex gap-10 text-slate-300">

  <li>
    <a
      href="#features"
      className="hover:text-cyan-400 transition"
    >
      Features
    </a>
  </li>

  <li>
    <a
      href="#pricing"
      className="hover:text-cyan-400 transition"
    >
      Pricing
    </a>
  </li>

  <li>
    <a
      href="#about"
      className="hover:text-cyan-400 transition"
    >
      About
    </a>
  </li>

</ul>

        <Link
  to="/login"
  className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-xl font-semibold transition hover:scale-105"
>
  Login
</Link>

      </div>

    </nav>
  );
}

export default Navbar;