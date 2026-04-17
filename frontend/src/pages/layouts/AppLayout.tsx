import { Outlet } from "react-router-dom";

// TODO: Remplacer par la vraie navbar adaptative (restaurant / supplier)
function AppLayout() {
  return (
    <div>
      <nav>AppNavbar</nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
export default AppLayout;
