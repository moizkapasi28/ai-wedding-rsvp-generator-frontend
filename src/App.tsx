import AppSidebar from "@/components/AppSidebar";
import Page, { PageHeader } from "@/components/Page";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "./components/Header";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider open={false}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main>
            <Page>
              <PageHeader />
              {/* <DashboardCard
                title="Hello"
                description="World"
                buttonText="ABC"
              ></DashboardCard> */}
            </Page>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
