import { Outlet } from "react-router-dom";

// TODO: Remplacer par la vraie navbar publique
function PublicLayout() {
  return (
    <div>
      <nav>PublicNavbar</nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
export default PublicLayout;
