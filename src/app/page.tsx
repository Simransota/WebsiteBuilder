import WebsiteBuilder from "./components/website-builder"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b p-4 bg-background">
        <div className="container flex items-center justify-between">
          <h1 className="text-xl font-bold">Websites.co.in Builder</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-muted rounded-md text-sm">Save</button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Publish</button>
          </div>
        </div>
      </header>
      <WebsiteBuilder />
    </main>
  )
}

