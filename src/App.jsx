import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './App.css';

function Tarefa({
  item,
  editandoId,
  alternarCheckbox,
  removerItem,
  editarItem,
  salvarEdicao,
  textoEditando,
  setTextoEditando,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid gray',
    borderRadius: '8px',
    margin: '5px 0',
    padding: '10px',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    minHeight: '50px', // altura mínima para não aumentar
    maxHeight: '50px',
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} className="tarefa-item">
      <div className="tarefa-left">
        <input
          type="checkbox"
          checked={item.marcado}
          onChange={() => alternarCheckbox(item.id)}
        />
        <span
          {...listeners}
          style={{
            cursor: 'grab',
            marginLeft: '8px',
            userSelect: 'none',
            color: '#e23260',
            flexShrink: 0,
          }}
        >
          ☰
        </span>
      </div>

      <div className="tarefa-texto">
        {editandoId === item.id ? (
          <input
            type="text"
            value={textoEditando}
            onChange={(e) => setTextoEditando(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && salvarEdicao(item.id)}
            style={{ width: '100%' }}
          />
        ) : (
          <span
            style={{
              textDecoration: item.marcado ? 'line-through' : 'none',
            }}
          >
            {item.nome}
          </span>
        )}
      </div>

      <div className="tarefa-right">
        {editandoId === item.id ? (
          <button onClick={() => salvarEdicao(item.id)}>💾</button>
        ) : (
          <button onClick={() => editarItem(item.id)}>✏️</button>
        )}
        <button onClick={() => removerItem(item.id)}>❌</button>
      </div>
    </li>
  );
}

function App() {
  const [tarefa, setTarefa] = useState('');
  const [itens, setItens] = useState([]);
  const [textoEditando, setTextoEditando] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  function adicionarNaLista() {
    if (!tarefa.trim()) return;

    const novoItem = {
      id: Date.now(),
      nome: tarefa,
      marcado: false,
    };

    setItens([...itens, novoItem]);
    setTarefa('');
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = itens.findIndex((item) => item.id === active.id);
    const newIndex = itens.findIndex((item) => item.id === over.id);

    setItens((items) => arrayMove(items, oldIndex, newIndex));
  }

  function alternarCheckbox(id) {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, marcado: !item.marcado } : item,
      ),
    );
  }

  function removerItem(id) {
    setItens(itens.filter((item) => item.id !== id));
  }

  function editarItem(id) {
    const item = itens.find((i) => i.id === id);
    setEditandoId(id);
    setTextoEditando(item.nome);
  }

  function salvarEdicao(id) {
    setItens(
      itens.map((item) =>
        item.id === id ? { ...item, nome: textoEditando } : item,
      ),
    );
    setEditandoId(null);
    setTextoEditando('');
  }

  function limparLista() {
    if (window.confirm('Deseja realmente limpar toda a lista?')) {
      setItens([]);
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>To-Do List</h1>

      <input
        type="text"
        placeholder="Digite aqui..."
        value={tarefa}
        onChange={(e) => setTarefa(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            adicionarNaLista();
          }
        }}
        style={{ padding: '8px', width: '250px', marginRight: '10px' }}
      />

      <button onClick={adicionarNaLista} style={{ padding: '8px 16px' }}>
        Adicionar
      </button>

      <button onClick={limparLista} style={{ padding: '8px 16px' }}>
        Limpar Lista
      </button>

      <p style={{ marginTop: '20px' }}>
        <strong>Tarefa digitada:</strong> {tarefa}
      </p>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={itens.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {itens.map((item) => (
              <Tarefa
                key={item.id}
                item={item}
                editandoId={editandoId}
                textoEditando={textoEditando}
                alternarCheckbox={alternarCheckbox}
                removerItem={removerItem}
                editarItem={editarItem}
                salvarEdicao={salvarEdicao}
                setTextoEditando={setTextoEditando}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default App;
