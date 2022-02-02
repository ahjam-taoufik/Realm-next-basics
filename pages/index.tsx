import Head from 'next/head'
import { useEffect, useState } from 'react'
import * as Realm from "realm-web"
import Header from './../components/Header';
import Container from './../components/Container';
import Hero from './../components/Hero';
import Category from './../components/Category';
import Products from './../components/Products';
import Pagination from './../components/Pagination';
import Footer from './../components/Footer';

export default function Home() {
  const [products, setProducts] = useState([]);

   useEffect(async () => {
      const REALM_APP_ID="products-rdcyx"
      const app = new Realm.App({ id: REALM_APP_ID });
      const credentials = Realm.Credentials.anonymous();
      try {
        const user =await app.logIn(credentials);
        const allProducts=await user.functions.getAllProducts()
        setProducts(()=>allProducts)
      } catch(err) {
        console.error("Failed to log in", err);
      }
   
   }, []);
   
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="bg-white w-full min-h-screen">
           <Header/>
           <Container>
             <Hero/>
             <Category
            category="Tech Wear"
            categoryCount={`${products.length} Products`}
          />
           <Products products={products} />
           <Pagination/>
           </Container>
           <Footer/>
        </div>
    </div>
  )
}



{/* <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
{products && products.map((product)=>{return <p key={product._id}>{product.name}</p>  })}
</main> */}
