"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Salad } from "lucide-react";

export default function LoginView({ onLogin }) {
  const [email, setEmail] = useState("admin@delinut.com");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block relative bg-linear-to-br from-emerald-500 to-emerald-700">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-white space-y-6 max-w-md">
            <Salad className="w-16 h-16" />
            <h1 className="text-5xl font-bold">Delinut</h1>
            <p className="text-xl text-emerald-50">
              Sistema de gestión para comida saludable. Administra menús,
              pedidos y personal desde un solo lugar.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <Salad className="w-10 h-10 text-emerald-600 md:hidden" />
              <h2 className="text-3xl font-bold text-gray-900">Delinut</h2>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Bienvenido de vuelta
            </h3>
            <p className="text-gray-600">
              Ingresa tus credenciales para acceder al panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@delinut.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              Ingresar al Sistema
            </Button>
          </form>

          <div className="text-center text-sm text-gray-500">
            <p>¿Olvidaste tu contraseña? Contacta al administrador</p>
          </div>
        </div>
      </div>
    </div>
  );
}
