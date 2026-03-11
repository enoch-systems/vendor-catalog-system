import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        router.push('/admin/products')
    }

    return (
        <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <form
                onSubmit={handleSubmit}
                className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <Link href="/" className="flex items-center p-3 mb-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors group">
                    <ArrowLeft size={20} className="min-w-[20px]" />
                    <span className="ml-3 font-medium">Back to Store</span>
                </Link>
                <div className="p-8 pb-6">
                    <div className="text-center">
                        <Link
                            href="/"
                            aria-label="go home">
                        <img src="/wig.png" alt="Logo" className="h-8 w-auto object-contain mx-auto" />
                        </Link>
                        <h1 className="mb-1 mt-4 text-xl font-semibold">Login as Admin</h1>
                    </div>


                        <div className="space-y-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="block text-sm">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                placeholder="Enter your email address"
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <Label
                                htmlFor="pwd"
                                className="text-sm">
                                Password
                            </Label>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                required
                                name="pwd"
                                id="pwd"
                                placeholder="Enter your password"
                                maxLength={18}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-3 inset-y-0 flex items-center justify-center text-gray-400 hover:text-gray-300 mt-5"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <Button className="w-full">
                            Login
                        </Button>
                    </div>
                </div>
            </form>
        </section>
    )
}
