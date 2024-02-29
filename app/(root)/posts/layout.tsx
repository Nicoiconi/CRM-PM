import NavButton from "@/components/shared/NavButton/NavButton";

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>

      <nav className="flex justify-around p-3 py-5">
        <div>
          <NavButton
            path="/posts/dashboard"
            label="Dashboard"
          />
        </div>
        <div>
          <NavButton
            path="/posts/add"
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
