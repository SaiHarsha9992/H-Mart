import Link from "next/link";
import { simplifiedProduct } from "../interface";
import { client } from "../lib/sanity";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

async function getData(category: string) {
  console.log(category);

  if (category == "all") {
    const query = `*[_type == "product"]{
        _id,
        "imageUrl": image[0].asset->url,
        price,
        name,
        "slug": slug.current,
        "categoryName": category->name
    }`;
    const data = await client.fetch(query);
    console.log("Fetched products:", data.length);
    return data;
  }
  const query = `*[_type == "product" && category->name == "${category}"]{
        _id,
        "imageUrl": image[0].asset->url,
        price,
        name,
        "slug": slug.current,
        "categoryName": category->name
    }`;
  const data = await client.fetch(query);
  console.log("Fetched products:", data);
  return data;
}

export const dynamic = "force-dynamic";
export default async function CategoryPage({
  params,
}: {
  params: {
    category: string;
  };
}) {
  const data: simplifiedProduct[] = await getData(params.category);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Our Products for {params.category}
          </h2>

          <Link href="/all" className="text-primary flex items-center gap-x-1">
            See All{" "}
            <span>
              <ArrowRight />
            </span>
          </Link>
        </div>

        {/* Updated grid settings to show 4 products per row */}
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((product) => (
            <div key={product._id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                <Image
                  src={product.imageUrl}
                  alt="Product Image"
                  className="w-full h-full object-center object-cover lg:h-full lg:w-full"
                  width={300}
                  height={300}
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/product/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {product.categoryName}
                  </p>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  &#8377;{product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
