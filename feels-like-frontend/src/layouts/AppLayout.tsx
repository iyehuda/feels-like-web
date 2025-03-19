import { Navigate, Outlet } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import useAuth from "../hooks/useAuth";
import SidebarFooter from "../components/SidebarFooter";
import Null from "../components/Null";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout
      disableCollapsibleSidebar
      slots={{ toolbarActions: Null, sidebarFooter: SidebarFooter }}
    >
      <PageContainer slotProps={{ header: { breadcrumbs: [], title: "" } }} sx={{ margin: 0 }}>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
