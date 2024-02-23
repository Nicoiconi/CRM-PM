import FooterContainer from "@/components/shared/FooterContainer/FooterContainer";
import MobileNav from "@/components/shared/MobileNav/MobileNav";
import SideBar from "@/components/shared/SideBar/SideBar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {

  return (
    <main className={`flex h-screen w-auto `}>
      <SideBar />
      <MobileNav />

      <div className="w-full overflow-auto">
        {children}
        <FooterContainer />
      </div>
    </main>
  )
}
