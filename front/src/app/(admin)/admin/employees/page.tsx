/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEmployees } from "@/hooks/useEmployees";
import { EnrollModal } from "@/components/admin/EnrollModal";

/* ----------------------------------------------------------------- */
/* 1. Validación con Zod                                              */
/* ----------------------------------------------------------------- */
const employeeSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  number: z.string().min(1, "El número de empleado es requerido"),
  photo: z.instanceof(File).optional(),
});
type EmployeeFormValues = z.infer<typeof employeeSchema>;

/* ----------------------------------------------------------------- */
/* 2. Componente principal                                            */
/* ----------------------------------------------------------------- */
export default function EmployeesPage() {
  /* Estado UI */
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [showEnroll, setShowEnroll] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  /* Paginación */
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  /* Hook backend */
  const {
    data: employees = [],
    isLoading,
    create,
    update,
    remove,
    uploadPhoto,
  } = useEmployees();

  const totalPages = Math.ceil(employees.length / PAGE_SIZE) || 1;
  const paged = employees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [employees, page, totalPages]);

  /* React-hook-form */
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { name: "", number: "" },
  });

  /* -------------------------------------------------------------- */
  /* 3. Handlers                                                    */
  /* -------------------------------------------------------------- */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("photo", file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EmployeeFormValues) => {
    if (editingEmployee) {
      await update(editingEmployee.id, {
        name: data.name,
        number: data.number,
      });
      if (data.photo) await uploadPhoto(editingEmployee.id, data.photo);
      toast.success("Empleado actualizado");
    } else {
      console.log(data.number)
      await create({ name: data.name, number: data.number });
      toast.success("Empleado creado");
    }
    setIsDialogOpen(false);
    setEditingEmployee(null);
    setPhotoPreview(null);
    form.reset();
  };

  const openEditDialog = (emp: any) => {
    setEditingEmployee(emp);
    form.reset({ name: emp.name, number: String(emp.number) });
    setPhotoPreview(emp.photoUrl);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingEmployee(null);
    form.reset({ name: "", number: "" });
    setPhotoPreview(null);
    setIsDialogOpen(true);
  };

  /* -------------------------------------------------------------- */
  /* 4. Render                                                      */
  /* -------------------------------------------------------------- */
  return (
    <div className="animate-in fade-in duration-500">
      {/* Encabezado + botón Nuevo */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#7A2430]">
          Gestión de Empleados
        </h2>

        {/* Dialog alta / edición */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNewDialog}
              className="bg-[#7A2430] hover:bg-[#7A2430]/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? "Editar Empleado" : "Nuevo Empleado"}
              </DialogTitle>
              <DialogDescription>
                Complete los datos del empleado y haga clic en guardar cuando
                termine.
              </DialogDescription>
            </DialogHeader>

            {/* Formulario */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex flex-col items-center mb-4">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={photoPreview || ""} />
                      <AvatarFallback className="bg-[#E48A19]/20 text-[#E48A19]">
                        {form.watch("name")?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 rounded-full bg-[#7A2430] p-1 text-white cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Haga clic en el icono para subir una foto
                  </p>
                </div>

                {/* Nombre */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del empleado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Número */}
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Empleado</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 1001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-[#7A2430] hover:bg-[#7A2430]/90"
                  >
                    Guardar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border bg-white shadow-sm">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7A2430]" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Número de Empleado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paged.map((emp) => (
                  <TableRow key={emp.id}>
                    {/* Avatar */}
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={emp.photoUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-[#E48A19]/20 text-[#E48A19]">
                          {emp.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    {/* Nombre y nº */}
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.number}</TableCell>

                    {/* Acciones */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Editar */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(emp)}
                        >
                          <Pencil className="h-4 w-4 text-[#E48A19]" />
                          <span className="sr-only">Editar</span>
                        </Button>

                        {/* Enrolar tarjeta */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={async () => {
                            setShowEnroll(true); // abre modal
                            await fetch("http://localhost:3030/enroll", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                employeeNumber: emp.number,
                              }),
                            });
                          }}
                        >
                          <Upload className="h-4 w-4 text-[#7A2430]" />
                          <span className="sr-only">Enrolar</span>
                        </Button>

                        {/* Eliminar */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={async () => {
                            await remove(emp.id);
                            toast.success("Empleado eliminado");
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <EnrollModal
              open={showEnroll}
              onDone={(ok) => {
                setShowEnroll(false);
                if (ok) toast.success("Tarjeta enrolada");
                else toast.error("Falló el enrolamiento");
              }}
            />

            {/* Paginación */}
            <Pagination className="justify-end border-t p-4">
              <PaginationContent>
                <PaginationPrevious
                  href="#"
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
                <span className="px-3 py-2 text-sm">
                  {page} / {totalPages}
                </span>
                <PaginationNext
                  href="#"
                  onClick={() => page < totalPages && setPage(page + 1)}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
}
