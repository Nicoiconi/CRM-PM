import NavButton from "@/components/shared/NavButton/NavButton";

export default function BuyersLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <nav className="flex justify-around p-3">
        <div>
          <NavButton
            path="/matches/dashboard"
            label="Dashboard"
          />
        </div>
        <div>
          <NavButton
            path="/matches/add"
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
