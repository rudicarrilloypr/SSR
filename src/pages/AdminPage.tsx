import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Archive, FilePlus2, Pencil, Search, X } from "lucide-react";
import { AppShell } from "../components/AppShell";
import {
  useContent,
  type ManagedRecord,
} from "../context/ContentContext";
import type { PublicationStatus } from "../lib/types";

export function AdminPage() {
  const {
    samplePacks,
    instrumentals,
    upsertManagedRecord,
    archiveManagedRecord,
  } = useContent();
  const contentRecords = useMemo<ManagedRecord[]>(
    () => [
      ...samplePacks.map((item) => ({
        id: item.id,
        title: item.title,
        type: "Sample pack" as const,
        bpm: item.bpm,
        musicalKey: item.musicalKey,
        genre: item.genre,
        tags: item.tags,
        status: item.status,
        updatedAt: "01/06/2026",
      })),
      ...instrumentals.map((item) => ({
        id: item.id,
        title: item.title,
        type: "Instrumental" as const,
        bpm: item.bpm,
        musicalKey: item.musicalKey,
        genre: item.genre,
        tags: item.tags,
        status: item.status,
        updatedAt: "30/05/2026",
      })),
    ],
    [instrumentals, samplePacks],
  );
  const [records, setRecords] = useState(contentRecords);
  const [selectedId, setSelectedId] = useState(contentRecords[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | PublicationStatus>("");
  const selected = records.find((record) => record.id === selectedId);
  const filteredRecords = useMemo(
    () =>
      records.filter(
        (record) =>
          record.title.toLowerCase().includes(search.toLowerCase()) &&
          (!status || record.status === status),
      ),
    [records, search, status],
  );

  useEffect(() => {
    setRecords((current) => {
      const unsaved = current.filter(
        (record) =>
          !contentRecords.some((contentRecord) => contentRecord.id === record.id),
      );
      return [...unsaved, ...contentRecords];
    });
  }, [contentRecords]);

  function updateSelected(patch: Partial<ManagedRecord>) {
    setRecords((current) =>
      current.map((record) =>
        record.id === selectedId ? { ...record, ...patch } : record,
      ),
    );
  }

  function addRecord() {
    const id = crypto.randomUUID();
    setRecords((current) => [
      {
        id,
        title: "Registro sin descifrar",
        type: "Sample pack",
        bpm: null,
        musicalKey: null,
        genre: "Sin clasificar",
        tags: [],
        status: "draft",
        updatedAt: new Date().toLocaleDateString("es-MX"),
      },
      ...current,
    ]);
    setSelectedId(id);
  }

  async function archiveSelected() {
    if (!selected) {
      return;
    }
    await archiveManagedRecord(selected);
    setRecords((current) => current.filter((record) => record.id !== selectedId));
    setSelectedId(records.find((record) => record.id !== selectedId)?.id ?? "");
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!selected) {
      return;
    }
    await upsertManagedRecord(selected);
    updateSelected({ updatedAt: new Date().toLocaleDateString("es-MX") });
  }

  return (
    <AppShell>
      <div className="admin-layout">
        <section className="admin-content">
          <header className="admin-heading">
            <h1>Consola del Archivista</h1>
            <button className="button button--primary" type="button" onClick={addRecord}>
              <FilePlus2 size={16} /> Nuevo registro
            </button>
          </header>
          <div className="admin-filters">
            <label className="search-field">
              <Search size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar en el archivo" />
            </label>
            <select value={status} onChange={(event) => setStatus(event.target.value as "" | PublicationStatus)}>
              <option value="">Todos los estados</option>
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
            </select>
          </div>
          <div className="admin-summary">
            <span><strong>{records.filter((record) => record.status === "published").length}</strong> publicados</span>
            <span><strong>{records.filter((record) => record.status === "draft").length}</strong> borradores</span>
            <span><strong>3</strong> planes</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th><th>Tipo</th><th>BPM</th><th>Tono</th>
                  <th>Estado</th><th>Actualizado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr className={record.id === selectedId ? "is-selected" : ""} key={record.id}>
                    <td>{record.title}</td>
                    <td>{record.type}</td>
                    <td>{record.bpm ?? "—"}</td>
                    <td>{record.musicalKey ?? "—"}</td>
                    <td><span className={`status status--${record.status}`}>{record.status === "published" ? "Publicado" : "Borrador"}</span></td>
                    <td>{record.updatedAt}</td>
                    <td>
                      <button type="button" aria-label={`Editar ${record.title}`} onClick={() => setSelectedId(record.id)}>
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {selected ? (
          <aside className="admin-editor">
            <header><h2>Editar registro</h2><X size={20} /></header>
            <form onSubmit={handleSave}>
              <label>Título<input value={selected.title} onChange={(event) => updateSelected({ title: event.target.value })} /></label>
              <label>Género<input value={selected.genre} onChange={(event) => updateSelected({ genre: event.target.value })} /></label>
              <div className="field-pair">
                <label>BPM<input type="number" value={selected.bpm ?? ""} onChange={(event) => updateSelected({ bpm: event.target.value ? Number(event.target.value) : null })} /></label>
                <label>Tono<input value={selected.musicalKey ?? ""} onChange={(event) => updateSelected({ musicalKey: event.target.value })} /></label>
              </div>
              <label>Tags<input value={selected.tags.join(", ")} onChange={(event) => updateSelected({ tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} /></label>
              <label>Estado<select value={selected.status} onChange={(event) => updateSelected({ status: event.target.value as PublicationStatus })}><option value="published">Publicado</option><option value="draft">Borrador</option></select></label>
              <button className="button button--primary button--wide">Guardar cambios</button>
              <button className="button button--danger button--wide" type="button" onClick={() => void archiveSelected()}><Archive size={16} /> Archivar</button>
            </form>
          </aside>
        ) : null}
      </div>
    </AppShell>
  );
}
