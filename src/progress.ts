export type Progress = { completed: string[]; practices: number[]; best: number | null };
export const emptyProgress: Progress = { completed: [], practices: [], best: null };
export function readProgress(): Progress {
 try { const p = JSON.parse(localStorage.getItem('leitersafe-v1') || 'null');
 if (!p || !Array.isArray(p.completed) || !p.completed.every((x:unknown)=>typeof x==='string') || !Array.isArray(p.practices) || !p.practices.every((x:unknown)=>typeof x==='number') || !(p.best===null || (Number.isInteger(p.best)&&p.best>=0&&p.best<=10))) return {...emptyProgress};
 return p;
 } catch { return {...emptyProgress}; }
}
