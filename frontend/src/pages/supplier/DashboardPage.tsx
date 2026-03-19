import LogOutButton from "../../components/auth/LogOutButton";
import DocumentsList from "../../components/documents/DocumentsList";

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DocumentsList />
      <LogOutButton />
    </div>
  );
}
export default DashboardPage;
