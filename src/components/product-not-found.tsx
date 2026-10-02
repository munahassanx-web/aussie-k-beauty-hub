import { Link } from "@tanstack/react-router";

export function ProductNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-foreground">Product not found</h1>
      <p className="mt-3 text-muted-foreground">
        That product isn't in our range.{" "}
        <Link to="/shop" className="text-primary underline">
          Browse the shop
        </Link>
        .
      </p>
    </div>
  );
}
