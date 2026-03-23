const CompanyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">About CartLi</h1>
      
      <div className="max-w-4xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            CartLi was founded with a simple mission: to make fashion accessible to everyone. 
            We believe that style should not come at the expense of quality or affordability.
            Our curated collection of men's and women's clothing brings you the latest trends 
            at prices you'll love.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Quality First</h3>
              <p className="text-gray-600 text-sm">
                Every item in our collection is carefully selected to ensure the highest quality standards.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Affordable Fashion</h3>
              <p className="text-gray-600 text-sm">
                We believe great style shouldn't break the bank. Competitive pricing on all items.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Customer Focus</h3>
              <p className="text-gray-600 text-sm">
                Your satisfaction is our priority. Easy returns, fast shipping, and dedicated support.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Women's Collection</h3>
              <p className="text-gray-600">
                From casual wear to formal attire, discover the latest trends in women's fashion. 
                We offer a wide range of dresses, tops, gowns, and more to suit every occasion.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Men's Collection</h3>
              <p className="text-gray-600">
                Stylish shirts, pants, jackets, and kurtas for the modern man. 
                Quality apparel that combines comfort with contemporary design.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            Have questions or need help? We're here for you!
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-2"><strong>Email:</strong> support@shopsy.com</p>
            <p className="mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Hours:</strong> Mon-Fri, 9am-6pm</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CompanyPage;
