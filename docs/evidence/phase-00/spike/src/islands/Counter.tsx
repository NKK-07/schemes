import { useStore } from "@nanostores/preact";
import { shortlist } from "../stores/shortlist";
export default function Counter() {
  const list = useStore(shortlist);
  return (
    <div>
      <p id="count">Saved: {list.length}</p>
      <button id="add" type="button" onClick={() => shortlist.set([...list, `id-${list.length}`])}>Add</button>
    </div>
  );
}
