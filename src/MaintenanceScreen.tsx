import { Clock3, ShieldCheck, Sparkles } from 'lucide-react';

export function MaintenanceScreen() {
  return (
    <main className="min-h-screen bg-[#07111c] text-white flex items-center justify-center px-5 py-10 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-[#19B5A8]/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-[#F2C75B]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.045] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      <section className="relative z-10 w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-2xl shadow-black/20">
          <img src="/icon.svg" alt="MARÉ" className="h-16 w-16 object-contain" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#19B5A8]/25 bg-[#19B5A8]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#7de4da]">
          <Sparkles size={13} />
          MARÉ
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] leading-[0.95]">
          SERVICIO EN
          <span className="block text-[#19B5A8]">MANTENIMIENTO</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-sm sm:text-base leading-7 text-white/65">
          Nuestra tienda online se encuentra temporalmente fuera de servicio mientras realizamos trabajos de actualización y mantenimiento.
        </p>

        <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
            <Clock3 className="mx-auto mb-3 text-[#F2C75B]" size={23} />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Duración</p>
            <p className="mt-2 text-lg font-black">TIEMPO INDEFINIDO</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
            <ShieldCheck className="mx-auto mb-3 text-[#19B5A8]" size={23} />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Estado</p>
            <p className="mt-2 text-lg font-black">ESTAMOS TRABAJANDO</p>
          </div>
        </div>

        <div className="mt-9 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
            Gracias por tu paciencia
          </p>
          <p className="mt-2 text-sm text-white/60">
            El servicio volverá a estar disponible cuando finalicen los trabajos.
          </p>
        </div>

        <p className="mt-10 text-[9px] font-black uppercase tracking-[0.25em] text-white/25">
          © {new Date().getFullYear()} MARÉ
        </p>
      </section>
    </main>
  );
}
