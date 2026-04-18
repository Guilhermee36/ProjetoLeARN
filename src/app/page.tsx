export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <main className="flex flex-col gap-4 items-center">
        <h1 className="text-4xl font-bold">Projeto LeARN</h1>
        <p className="text-lg text-gray-600">O servidor está rodando corretamente! 🚀</p>
        
        <div className="p-4 border rounded-lg bg-slate-50 dark:bg-zinc-900">
          <p>Edite o arquivo <code>src/app/page.tsx</code> para começar.</p>
        </div>
      </main>
    </div>
  );
}