import SupplierDetail from "@/components/supplier-details/SupplierDetails";
import { useParams } from "react-router-dom";

function SupplierDetailPage() {
  const { id } = useParams();

  return <SupplierDetail id={id!} />;
}
export default SupplierDetailPage;
