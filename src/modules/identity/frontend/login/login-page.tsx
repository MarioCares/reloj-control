import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "./login-form";

export function LoginPage() {
	return (
		<main className="flex min-h-svh items-center justify-center px-4 py-10">
			<Card className="w-full max-w-sm">
				<CardHeader className="text-center">
					<CardTitle>
						<h1>Iniciar sesión</h1>
					</CardTitle>
					<CardDescription>
						Ingresa tus credenciales para acceder a la plataforma.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<LoginForm />
				</CardContent>
			</Card>
		</main>
	);
}
