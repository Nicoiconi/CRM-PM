import NavButton from "@/components/shared/NavButton/NavButton";

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>

      <nav className="flex justify-around p-3">
        <div>
          <NavButton
            path="/categories/dashboard"
            label="Dashboard"
          />
        </div>
        <div>
          <NavButton
            path="/categories/add"
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
