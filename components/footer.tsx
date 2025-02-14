export function Footer() {
  return (
    <footer className="container mx-auto w-full border-t bg-background px-10">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About FoodHub</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">About Us</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Careers</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Blog</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Restaurants</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Partner with us</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Apps for you</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Learn More</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Security</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Terms</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Social Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Facebook</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">Instagram</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-muted-foreground">
            © 2024 FoodHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}