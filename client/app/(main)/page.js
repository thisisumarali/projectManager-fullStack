import Image from "next/image";
import ProductCard from "@/components/devComponents/ProductCard";
import CategoryCard from "@/components/devComponents/CategoryCard";
import CompanyCard from "@/components/devComponents/CompanyCard";
import InvoiceCard from "@/components/devComponents/InvoiceCard";

export default function Home() {
  return (


    <div className="lg:flex lg:justify-center lg:*:items-center ">
      {/* <CategoryCard />
      <CompanyCard /> */}
      <InvoiceCard />
    </div>

  );
}
