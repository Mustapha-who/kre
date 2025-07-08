'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User2, Home } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSignupOptions, setShowSignupOptions] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await res.json();
      // If backend says to redirect to sign-up-house2, do so
      if (data.redirect) {
        window.location.href = data.redirect;
        return;
      }

      // Default: go to main
      router.refresh();
      router.push("/main");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your email and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
              <button
               type="button"
                 className="underline underline-offset-4 font-semibold 
                 text-primary hover:text-primary/80 
                 hover:underline-offset-[3px] 
                  transition-all duration-200
                  cursor-pointer"
                onClick={() => setShowSignupOptions(true)}
                >
              Sign up
              </button>
            </div>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Floating sign-up options as two shadcn cards with icons */}
      {showSignupOptions && (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    onClick={() => setShowSignupOptions(false)}  // Add this line
  >
    <div 
      className="flex flex-col items-center"
      onClick={(e) => e.stopPropagation()}  // Prevent click propagation from cards
    >
      <button
        className="absolute top-2 right-3 text-2xl font-bold text-gray-400 hover:text-black"
        onClick={(e) => {
          e.stopPropagation();
          setShowSignupOptions(false);
        }}
        aria-label="Close"
        style={{ right: "2rem", top: "2rem" }}
      >
        ×
      </button>
      <div className="mb-6 text-lg font-semibold text-center text-white">Choose your sign up type</div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* User Card */}
        <Card
          className="w-64 cursor-pointer hover:shadow-2xl border-primary/50 transition-shadow group relative"
          onClick={(e) => {
            e.stopPropagation();
            router.push("/sign-up-user");
          }}
        >
                <CardHeader className="flex flex-col items-center gap-2">
                  <div className="bg-primary/10 rounded-full p-4 mb-2 group-hover:bg-primary/20 transition">
                    <User2 className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary text-center">User</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-center">
                    Sign up as a regular user to browse and save houses.
                  </div>
                </CardContent>
              </Card>
              {/* House Owner Card */}
              <Card
                className="w-64 cursor-pointer hover:shadow-2xl border-primary/50 transition-shadow group relative"
                onClick={() => router.push("/sign-up-house")}
              >
                <CardHeader className="flex flex-col items-center gap-2">
                  <div className="bg-primary/10 rounded-full p-4 mb-2 group-hover:bg-primary/20 transition">
                    <Home className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary text-center">House Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-center">
                    Sign up as a house owner to list and manage your properties.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
