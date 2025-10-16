export default function Home() {
  return (
    <main className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold underline">Tailwind + DaisyUI Test</h1>
      <button className="btn btn-neutral">Neutral</button>
      <button className="btn btn-primary">Primary</button>
      <button className="btn btn-accent">Accent</button>
      
      <input type="text" placeholder="neutral" className="input input-neutral" />
    </main>
  );
}
