import NavButton from "@/components/shared/NavButton/NavButton";

export default function BuyersLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <nav className="flex justify-around p-3">
        <div>
          <NavButton
            path="/buyers/dashboard"
            label="Dashboard"
          />
        </div>
        <div>
          <NavButton
            path="/buyers/add"
            label="Add"
          />
        </div>
      </nav>

      <div className="w-full">
          {children}
      </div>
    </main>
  )
}
