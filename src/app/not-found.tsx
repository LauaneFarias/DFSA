import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container
      as="main"
      className="flex min-h-screen flex-col items-center justify-center gap-4 text-center"
    >
      <h1 className="font-display text-2xl font-medium">Page not found</h1>
      <Link href="/" className="text-brand underline underline-offset-4">
        Back home
      </Link>
    </Container>
  );
}
