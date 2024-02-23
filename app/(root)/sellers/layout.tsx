import NavButton from "@/components/shared/NavButton/NavButton";

export default function SellersLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>

      <nav className="flex justify-around p-3">
        <div>
          <NavButton
            path="/sellers/dashboard"
            label="Dashboard"
          />
        </div>
        <div>
          <NavButton
            path="/sellers/add"
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
