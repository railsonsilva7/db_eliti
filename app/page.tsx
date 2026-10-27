import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

interface Aluno extends RowDataPacket {
  id: number;
  nome: string;
  idade: number;
}

export default async function Home() {
  // READ
  const [alunos] = await db.query<Aluno[]>("SELECT * FROM aluno");

  // CREATE
  async function salvarAluno(formData: FormData) {
    "use server";

    const nome = formData.get("nome") as string;
    const idade = Number(formData.get("idade"));

    if (!nome || !idade) return;

    await db.query("INSERT INTO aluno (nome, idade) VALUES (?, ?)", [
      nome,
      idade,
    ]);

    revalidatePath("/");
  }

  // UPDATE
  async function editarAluno(formData: FormData) {
    "use server";

    const id = Number(formData.get("id"));
    const nome = formData.get("nome") as string;
    const idade = Number(formData.get("idade"));

    if (!id || !nome || !idade) return;

    await db.query("UPDATE aluno SET nome = ?, idade = ? WHERE id = ?", [
      nome,
      idade,
      id,
    ]);

    revalidatePath("/");
  }

  // DELETE
  async function deletarAluno(formData: FormData) {
    "use server";

    const id = Number(formData.get("id"));

    if (!id) return;

    await db.query("DELETE FROM aluno WHERE id = ?", [id]);

    revalidatePath("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <form
        action={salvarAluno}
        className="flex w-full max-w-md flex-col gap-3 rounded-lg border p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold">Novo Aluno</h2>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          required
          className="rounded border px-3 py-2"
        />
        <input
          type="number"
          name="idade"
          placeholder="Idade"
          required
          className="rounded border px-3 py-2"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Salvar
        </button>
      </form>

      <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Alunos cadastrados</h2>
        <ul className="flex flex-col gap-3">
          {alunos.map((aluno) => (
            <li key={aluno.id}>
              <form
                action={editarAluno}
                className="flex items-center gap-2 rounded border p-2"
              >
                <input type="hidden" name="id" value={aluno.id} />
                <input
                  type="text"
                  name="nome"
                  defaultValue={aluno.nome}
                  required
                  className="w-full rounded border px-2 py-1"
                />
                <input
                  type="number"
                  name="idade"
                  defaultValue={aluno.idade}
                  required
                  className="w-20 rounded border px-2 py-1"
                />
                <button
                  type="submit"
                  className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                >
                  Editar
                </button>
                <button
                   formAction={deletarAluno}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                  Excluir
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
